import * as amqp from 'amqplib'
import ErrorType from '../utils/errorMessages'
import config from '../config/config'
import { Logger } from 'winston'
import Request from '../models/request'

/**
 * Creates a function to send messages to a specified RabbitMQ exchange and routing key.
 * @param createLogger Function to create a logger instance.
 * @returns A function capable of sending messages through RabbitMQ.
 */
export const sendMessage = (createLogger: ((callingModule?: NodeModule, path?: string) => Logger)):
  ((
    topic: string,
    data: object,
    publisherApiKey: string
    ) => Promise<void>
  ) => {
    const logger = createLogger(undefined, 'RabbitMqClient/consumer/index.ts')
    return async (topic: string, data: object | string, publisherApiKey: string): Promise<void> => {
      try {
        const passphrase = config.passphrase;
        if (!config.client_cert || !config.client_key || !config.ca_cert || !config.rabbitmqurl) {
          logger.error(`${ErrorType.CERT_PATH_NOT_DEFINED}: One or many of RabbitMq client certifications are not found.`)
          throw new Error(`${ErrorType.CERT_PATH_NOT_DEFINED}: One or many of RabbitMq client certifications are not found.`)
        }
        const clientCert = config.client_cert;
        const clientKey = config.client_key;
        const caCert = config.ca_cert;

        const connection: amqp.Connection = await amqp.connect(config.rabbitmqurl, {
          cert: clientCert,
          key: clientKey,
          passphrase,
          ca: [caCert],
          checkServerIdentity: () => undefined // This skips the hostname/IP check
        });
        
        logger.info('Opening channel...')
        const channel: amqp.Channel = await connection.createChannel();

        await channel.assertExchange(topic, 'direct', { durable: true });

        logger.info(`Publishing data via exchange ${topic}...`);
        const request: Request = {
          publisherApikey: publisherApiKey,
          data: data
        }
        const requestBuffer = Buffer.from(JSON.stringify(request))
        const result = channel.publish(topic, topic, requestBuffer);
        result ? logger.info(`Data published successfully via exchange ${topic}.`)
              : logger.error(`Data failed to be published via exchange ${topic}.`)
        
        logger.info('Closing channel...')
        await channel.close();
        logger.info('Closing connection...')
        await connection.close();
      } catch (error) {
        logger.error(`${ErrorType.PUBLISH_ERROR}: ${(error as Error).message}`);
      }
    }
}