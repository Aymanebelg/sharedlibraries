import getRedisConnection from "../functions/getRedisConnection";

/**
 * Deletes a key from Redis.
 * @param {object} logger - The logger object used for logging messages.
 * @returns {(key: string) => Promise<boolean>} An asynchronous function that takes a key as input and returns a Promise<boolean>.
 */
export const deleteFromRedis = (logger: any) => async (key: string): Promise<boolean> => {
    /**
     * Logs a message indicating that data with the specified key is being deleted from Redis.
     */
    logger.info(`Deleting data with key:${key} from redis...`);

    // Attempt to get a Redis connection
    const redisConnection = getRedisConnection(logger);
    if (!redisConnection) {
      logger.error('Failed to get Redis connection');
      return false;
    }
  
    try {
        // Attempt to delete the key from Redis
        const result = await redisConnection.del(key);
        const resultBool = result === 1;
        // Log the result of the delete operation
        resultBool
            ? logger.info(`Data with key:${key} has been deleted successfully`)
            : logger.error(`Key: ${key} not found.`);

        return resultBool;
    } catch (error) {
        // Log any errors that occur during the delete operation
        logger.error(`Error deleting key: ${error}`);
        return false;
    } finally {
        // Attempt to close the Redis connection
        const closed = await redisConnection.quit().catch((err) => {
            logger.error(`Error closing redis connection: ${err}`);
        });
        // Log the result of the connection closing operation
        if(closed) logger.info(`Redis Connection has been closed`);
    }
};
