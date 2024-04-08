import * as amqp from "amqplib";
import ErrorType from "../utils/errorMessages";
import config from "../config/config";

const sharedResources = {
  connection: null as amqp.Connection | null,
  channel: null as amqp.Channel | null,
};

async function ensureAMQPChannel(): Promise<amqp.Channel> {
  if (sharedResources.channel) return sharedResources.channel;

  const { client_cert, client_key, ca_cert, passphrase, rabbitmqurl } = config;
  if (!client_cert || !client_key || !ca_cert || !rabbitmqurl) {
    throw new Error(ErrorType.CONFIGURATION_ERROR);
  }

  try {
    if (!sharedResources.connection) {
      sharedResources.connection = await amqp.connect(rabbitmqurl, {
        cert: client_cert,
        key: client_key,
        passphrase,
        ca: [ca_cert],
        checkServerIdentity: () => undefined,
      });
      setUpConnectionListeners(sharedResources.connection);
    }

    sharedResources.channel = await sharedResources.connection.createChannel();
    return sharedResources.channel;
  } catch (error) {
    console.error("Failed to create AMQP channel:", error);
    throw error;
  }
}

function setUpConnectionListeners(connection: amqp.Connection) {
  connection.on("error", (err) => console.error("AMQP Connection error:", err));
  connection.on("close", () => console.log("AMQP Connection closed"));
}


export async function consumeMessages(
  exchange: string,
  routingKey: string,
  apiKey: string,
  callback: (content: string, key: string) => void,
): Promise<void> {
  try {
    const channel = await ensureAMQPChannel();

    await channel.assertExchange(exchange, "direct", { durable: true });
    const { queue } = await channel.assertQueue(apiKey, { exclusive: false, autoDelete: true });
    await channel.bindQueue(queue, exchange, routingKey);

    console.log(`Subscribed to ${exchange}/${routingKey} via queue ${queue}`);

    await channel.consume(queue, (msg) => {
      if (msg) {
        const content = msg.content.toString();
        const key = msg.fields.routingKey;
        console.log(`Received message: '${content}' with key '${key}'`);
        callback(content, key);
        channel.ack(msg);
      }
    }, { noAck: false });

  } catch (error) {
    console.error("Error consuming messages:", error);
    throw error;
  }
}
