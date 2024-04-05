import * as amqp from "amqplib";
import ErrorType from "../utils/errorMessages";
import config from "../config/config";

const sharedConnection: { connection: amqp.Connection | null } = {
  connection: null,
};
const sharedChannel: { channel: amqp.Channel | null } = { channel: null };

async function createChannel(rabbitMQUrl: string): Promise<amqp.Channel> {
  if (sharedChannel.channel) {
    return sharedChannel.channel;
  }

  // Ensures all required configurations are present
  const { client_cert: clientCert, client_key: clientKey, ca_cert: caCert, passphrase } = config;
  if (!clientCert || !clientKey || !caCert) {
    throw new Error(ErrorType.CERT_PATH_NOT_DEFINED);
  }

  try {
    const connection = await amqp.connect(rabbitMQUrl, {
      cert: clientCert,
      key: clientKey,
      passphrase,
      ca: [caCert],
      checkServerIdentity: () => undefined, // Skips hostname/IP check
    });

    // Set up event listeners on the connection
    setUpConnectionListeners(connection);

    const channel = await connection.createChannel();
    // Persist the connection and channel for reuse
    sharedConnection.connection = connection;
    sharedChannel.channel = channel;

    return channel;
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error;
  }
}

function setUpConnectionListeners(connection: amqp.Connection) {
  connection.on("error", err => console.error("Shared connection error", err));
  connection.on("close", () => console.log("Shared connection closed"));
}
export async function consumeMessages(
  exchange: string,
  routingKey: string,
  apiKey: string,
  callback: (content: string, key: string) => void
): Promise<void> {
  try {
    const rabbitMQUrl = config.rabbitmqurl;
    const channel = await createChannel(rabbitMQUrl);

    const queueName = apiKey;
    await channel.assertExchange(exchange, "direct", { durable: true });
    const assertQueue = await channel.assertQueue(queueName, {
      exclusive: false,
      autoDelete: true,
    });
    await channel.bindQueue(assertQueue.queue, exchange, routingKey);

    console.log(
      `Waiting for messages in '${queueName}' from '${exchange}' with '${routingKey}'`
    );

    await new Promise<void>((resolve, reject) => {
      channel
        .consume(
          queueName,
          (msg) => {
            if (msg) {
              const content = msg.content.toString();
              const key = msg.fields.routingKey;

              console.log(`Received:'${content}' with key '${key}'`);
              callback(content, key);
              channel.ack(msg);
            }
          },
          { noAck: false }
        )
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
