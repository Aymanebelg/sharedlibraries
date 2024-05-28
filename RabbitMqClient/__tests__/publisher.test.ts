import * as amqp from 'amqplib';
import { sendMessage } from '../src/publisher/index';
import ErrorType from '../src/utils/errorMessages';
import config from '../src/config/config';
import { Logger } from 'winston';

jest.mock('amqplib');
jest.mock('../src/config/config');
jest.mock('winston');

describe('sendMessage', () => {
  let createLoggerMock: jest.Mock;
  let loggerMock: jest.Mocked<Logger>;

  beforeEach(() => {
    loggerMock = {
      error: jest.fn(),
      info: jest.fn(),
    } as any;
    createLoggerMock = jest.fn().mockReturnValue(loggerMock);

    config.client_cert = 'clientCert';
    config.client_key = 'clientKey';
    config.ca_cert = 'caCert';
    config.rabbitmqurl = 'amqp://localhost';
    config.passphrase = 'passphrase';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if any RabbitMQ client certifications are not found', async () => {
    config.client_cert = undefined;

    const sendMessageFunc = sendMessage(createLoggerMock);
    await sendMessageFunc('testTopic', {}, 'apiKey');

    expect(loggerMock.error).toHaveBeenCalledWith(`${ErrorType.CERT_PATH_NOT_DEFINED}: One or many of RabbitMq client certifications are not found.`);
  });

  it('should log error and not throw if connection fails', async () => {
    const connectMock = jest.spyOn(amqp, 'connect').mockRejectedValue(new Error('Connection failed'));

    const sendMessageFunc = sendMessage(createLoggerMock);
    await sendMessageFunc('testTopic', {}, 'apiKey');

    expect(connectMock).toHaveBeenCalledWith(config.rabbitmqurl, {
      cert: config.client_cert,
      key: config.client_key,
      passphrase: config.passphrase,
      ca: [config.ca_cert],
      checkServerIdentity: expect.any(Function),
    });
    expect(loggerMock.error).toHaveBeenCalledWith(`${ErrorType.PUBLISH_ERROR}: Connection failed`);
  });

  it('should publish a message successfully', async () => {
    const channelMock = {
      assertExchange: jest.fn(),
      publish: jest.fn().mockReturnValue(true),
      close: jest.fn(),
    };
    const connectionMock = {
      createChannel: jest.fn().mockResolvedValue(channelMock),
      close: jest.fn(),
    };
    jest.spyOn(amqp, 'connect').mockResolvedValue(connectionMock as any);

    const sendMessageFunc = sendMessage(createLoggerMock);
    await sendMessageFunc('testTopic', { test: 'data' }, 'apiKey');

    expect(loggerMock.info).toHaveBeenCalledWith('Opening channel...');
    expect(channelMock.assertExchange).toHaveBeenCalledWith('testTopic', 'direct', { durable: true });
    expect(channelMock.publish).toHaveBeenCalledWith('testTopic', 'testTopic', Buffer.from(JSON.stringify({ publisherApikey: 'apiKey', data: { test: 'data' } })));
    expect(loggerMock.info).toHaveBeenCalledWith(`Data published successfully via exchange testTopic.`);
    expect(loggerMock.info).toHaveBeenCalledWith('Closing channel...');
    expect(channelMock.close).toHaveBeenCalled();
    expect(loggerMock.info).toHaveBeenCalledWith('Closing connection...');
    expect(connectionMock.close).toHaveBeenCalled();
  });

  it('should log error if publishing fails', async () => {
    const channelMock = {
      assertExchange: jest.fn(),
      publish: jest.fn().mockReturnValue(false),
      close: jest.fn(),
    };
    const connectionMock = {
      createChannel: jest.fn().mockResolvedValue(channelMock),
      close: jest.fn(),
    };
    jest.spyOn(amqp, 'connect').mockResolvedValue(connectionMock as any);

    const sendMessageFunc = sendMessage(createLoggerMock);
    await sendMessageFunc('testTopic', { test: 'data' }, 'apiKey');

    expect(loggerMock.info).toHaveBeenCalledWith('Opening channel...');
    expect(channelMock.assertExchange).toHaveBeenCalledWith('testTopic', 'direct', { durable: true });
    expect(channelMock.publish).toHaveBeenCalledWith('testTopic', 'testTopic', Buffer.from(JSON.stringify({ publisherApikey: 'apiKey', data: { test: 'data' } })));
    expect(loggerMock.error).toHaveBeenCalledWith(`Data failed to be published via exchange testTopic.`);
    expect(loggerMock.info).toHaveBeenCalledWith('Closing channel...');
    expect(channelMock.close).toHaveBeenCalled();
    expect(loggerMock.info).toHaveBeenCalledWith('Closing connection...');
    expect(connectionMock.close).toHaveBeenCalled();
  });

  it('should log error for invalid data type', async () => {
    const sendMessageFunc = sendMessage(createLoggerMock);

    await sendMessageFunc('testTopic', undefined as unknown as object, 'apiKey');

    expect(loggerMock.error).toHaveBeenCalledWith(`Data failed to be published via exchange testTopic.`);
  });

  it('should handle logger creation correctly', async () => {
    const sendMessageFunc = sendMessage(createLoggerMock);
    await sendMessageFunc('testTopic', { test: 'data' }, 'apiKey');

    expect(createLoggerMock).toHaveBeenCalledWith(undefined, 'RabbitMqClient/consumer/index.ts');
  });
});
