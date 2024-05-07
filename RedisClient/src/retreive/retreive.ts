import getRedisConnection from "../functions/getRedisConnection";
import revertData from "../functions/revertData";

/**
 * Retrieves data from Redis using the specified key.
 * @param {object} logger - The logger object used for logging messages.
 * @returns {(key: string) => Promise<string>} An asynchronous function that takes a key as input and returns a Promise<any>.
 */
export const getFromRedis = (logger: any) => async (key: string): Promise<any> => {
    /**
     * Logs a message indicating that data with the specified key is being retrieved from Redis.
     */
    logger.info(`Retrieving data with key:${key} from redis...`);
    
    // Attempt to get a Redis connection
    const redisConnection = getRedisConnection(logger);
    if (redisConnection) {
        try {
            // Attempt to get the data from Redis
            const resultString = await redisConnection.get(key);
            if (!resultString) throw new Error(`Undefined key:${key}`);
            
            // Log the successful retrieval of data
            logger.info(`Data with key:${key} has been retrieved successfully.`);
            
            // Revert the data (assuming revertData function is defined and works correctly)
            const revertedData = revertData(resultString);
            return revertedData;
        } catch (err) {
            // Log any errors that occur during data retrieval
            logger.error(`Redis Error retrieving data: ${(err as Error).message}`);
        } finally {
            // Attempt to close the Redis connection
            const closed = await redisConnection.quit().catch((err) => {
                logger.error(`Error closing redis connection: ${err}`);
            });
            // Log the result of the connection closing operation
            if (closed) logger.info(`Redis Connection has been closed`);
        }
    }
    
    // Log an error message if the process is stopped
    logger.error(`Getting data with key:${key} process has been stopped`);
};
