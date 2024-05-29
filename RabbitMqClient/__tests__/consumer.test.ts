import * as amqp from "amqplib";
import { Logger } from "winston";
import { consumeMessages, sharedResources } from "../src/consumer/index";
import winston = require("winston");

jest.mock("../src/config/config", () => ({
  default: {
    client_cert: "fake_cert",
    client_key: "fake_key",
    ca_cert: "fake_ca_cert",
    passphrase: "fake_passphrase",
    rabbitmqurl: "amqp://fake_url",
  },
}));

jest.mock("winston", () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  })),
}));

const createMockChannel = () => ({
  assertExchange: jest.fn(),
  assertQueue: jest.fn().mockResolvedValue({ queue: "test_queue" }),
  bindQueue: jest.fn(),
  consume: jest.fn(),
  ack: jest.fn(),
  nack: jest.fn(),
});

const createMockConnection = (channel: any) => ({
  createChannel: jest.fn().mockResolvedValue(channel),
  on: jest.fn(),
});

jest.mock("amqplib", () => ({
  connect: jest.fn(),
}));

describe("consumeMessages", () => {
  let logger: Logger;
  let mockChannel: any;
  let mockConnection: any;

  beforeEach(() => {
    mockChannel = createMockChannel();
    mockConnection = createMockConnection(mockChannel);
    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);
    logger = (winston.createLogger as jest.Mock).mockReturnValue({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    })();
  });

  afterEach(() => {
    jest.clearAllMocks();
    sharedResources.connection = null;
    sharedResources.channel = null;
  });

  it("should create a channel and consume messages", async () => {
    const mockCallback = jest.fn();

    const consumer = consumeMessages(() => logger);
    await consumer("test_topic", "test_api_key", mockCallback);

    expect(amqp.connect).toHaveBeenCalled();
    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect(mockChannel.assertExchange).toHaveBeenCalledWith("test_topic", "direct", { durable: true });
    expect(mockChannel.assertQueue).toHaveBeenCalledWith("test_api_key", { exclusive: false, autoDelete: true });
    expect(mockChannel.bindQueue).toHaveBeenCalledWith("test_queue", "test_topic", "test_topic");
    expect(mockChannel.consume).toHaveBeenCalledWith("test_queue", expect.any(Function), { noAck: false });

    const message = {
      content: Buffer.from(JSON.stringify({ publisherApikey: "publisher_key", data: "test_data" })),
    };

    const consumeCallback = mockChannel.consume.mock.calls[0][1];
    await consumeCallback(message);

    expect(mockCallback).toHaveBeenCalledWith("test_data");
    expect(mockChannel.ack).toHaveBeenCalledWith(message);
  });

  it("should handle errors during channel creation", async () => {
    const mockCallback = jest.fn();
    (amqp.connect as jest.Mock).mockRejectedValue(new Error("Connection error"));

    const consumer = consumeMessages(() => logger);
    await expect(consumer("test_topic", "test_api_key", mockCallback)).rejects.toThrow("Connection error");

    expect(logger.error).toHaveBeenCalledWith("Failed to create AMQP channel: Connection error");
  });

  it("should handle errors in callback function", async () => {
    const mockCallback = jest.fn().mockRejectedValue(new Error("Callback error"));

    const consumer = consumeMessages(() => logger);
    await consumer("test_topic", "test_api_key", mockCallback);

    const message = {
      content: Buffer.from(JSON.stringify({ publisherApikey: "publisher_key", data: "test_data" })),
    };

    const consumeCallback = mockChannel.consume.mock.calls[0][1];
    await consumeCallback(message);

    expect(mockCallback).toHaveBeenCalledWith("test_data");
    expect(logger.error).toHaveBeenCalledWith("Error calling the callback: Callback error");
  });

  it("should log a warning if the channel already exists", async () => {
    sharedResources.channel = mockChannel;

    const mockCallback = jest.fn();
    const consumer = consumeMessages(() => logger);
    await consumer("test_topic", "test_api_key", mockCallback);

    expect(logger.warn).toHaveBeenCalledWith("Channel already exists...");
    sharedResources.channel = null;
  });

  it("should log connection errors and closures", async () => {
    const mockCallback = jest.fn();

    const consumer = consumeMessages(() => logger);
    await consumer("test_topic", "test_api_key", mockCallback);

    expect(mockConnection.on).toHaveBeenCalledWith("error", expect.any(Function));
    expect(mockConnection.on).toHaveBeenCalledWith("close", expect.any(Function));
 
    const errorCallback = mockConnection.on.mock.calls[0][1];
    errorCallback(new Error("Connection error"));
    expect(logger.error).toHaveBeenCalledWith("AMQP Connection error:", "Connection error");

    const closeCallback = mockConnection.on.mock.calls[1][1];
    closeCallback();
    expect(logger.info).toHaveBeenCalledWith("AMQP Connection closed");
  });

  it("should correctly bind to a different routing key", async () => {
    const mockCallback = jest.fn();
    const differentRoutingKey = "test_topic";
 
    const consumer = consumeMessages(() => logger);
    await consumer("test_topic", differentRoutingKey, mockCallback);

    expect(mockChannel.bindQueue).toHaveBeenCalledWith("test_queue", "test_topic", differentRoutingKey);
  });


  
});
