import * as amqp from "amqplib";
import ErrorType from "../utils/errorMessages";
import config from "../config/config";
import { Logger } from "winston";
import Request from "../models/request";
/**
 * An object to hold shared AMQP resources like connection and channel.
 */
export const sharedResources = {
  connection: null as amqp.Connection | null,
  channel: null as amqp.Channel | null,
};

/**
 * Ensures a single AMQP channel is created and reused within the application.
 * @param logger A Winston logger instance for logging status and errors.
 * @returns A Promise resolving to an AMQP channel.
 */
async function ensureAMQPChannel(logger: Logger): Promise<amqp.Channel> {
  logger.info('Creating channel...')
  if (sharedResources.channel) {
    logger.warn('Channel already exists...')
    return sharedResources.channel;
  };

  const { client_cert, client_key, ca_cert, passphrase, rabbitmqurl } = config;
  if (!client_cert || !client_key || !ca_cert || !rabbitmqurl) {
    throw new Error(`Failed to create AMQP channel: ${ErrorType.CONFIGURATION_ERROR}`);
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
      setUpConnectionListeners(sharedResources.connection, logger);
    }

    sharedResources.channel = await sharedResources.connection.createChannel();
    logger.info('Channel created successfully')
    return sharedResources.channel;
  } catch (error) {
    logger.error(`Failed to create AMQP channel: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Sets up listeners for the AMQP connection events.
 * @param connection The AMQP connection to attach listeners to.
 * @param logger A Winston logger instance for logging connection events.
 */
function setUpConnectionListeners(connection: amqp.Connection, logger: Logger) {
  logger.info('Setting up connection listeners')
  connection.on("error", (err) => logger.error("AMQP Connection error:", (err as Error).message));
  connection.on("close", () => logger.info("AMQP Connection closed"));
}

/**
 * Creates a consumer function for RabbitMQ that subscribes to a specific exchange and routing key.
 * @param createLogger Function to create a logger instance.
 * @returns A function to handle AMQP message consumption.
 */
export const consumeMessages = (createLogger: ((callingModule?: NodeModule, path?: string) => Logger)): 
((
  topic: string,
  consumerApiKey: string, 
  callback: (content: any) => void
  ) => Promise<void>
) => {
  const logger = createLogger(undefined, 'RabbitMqClient/consumer/index.ts')
  return async (topic: string, consumerApiKey: string, callback: (content: any) => void): Promise<void> => {
    try {
      const channel = await ensureAMQPChannel(logger);
      await channel.assertExchange(topic, "direct", { durable: true });
      const { queue } = await channel.assertQueue(consumerApiKey, { exclusive: false, autoDelete: true });
      await channel.bindQueue(queue, topic, topic);
      logger.info(`Subscribed to ${topic} via queue ${topic}/${queue}.`);

      logger.info('Waiting for publishers requests...')
      await channel.consume(queue, (msg) => {
        if (msg) {
          const request = JSON.parse(msg.content.toString()) as Request;

          logger.info(`Data arrived from apiKey: ${request.publisherApikey} in queue ${topic}/${queue}.`)

          logger.info(`Consuming data from queue ${topic}/${queue}...`)
          Promise
          .resolve(callback(request.data))
          .catch((err) => { logger.error(`Error calling the callback: ${(err as Error).message}`) })
          
          channel.ack(msg);
        }
      }, { noAck: false });
    } catch (error) {
      logger.error(`${ErrorType.CONSUMER_ERROR}: ${(error as Error).message}`)
      throw new Error(error.message);
    }
  }
}
