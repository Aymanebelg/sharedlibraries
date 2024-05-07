import getRedisConnection from "../functions/getRedisConnection";
import convertData from "../functions/convertData";

/**
 * Saves data to Redis using the specified key.
 * @param {object} logger - The logger object used for logging messages.
 * @returns {(key: string, data: any) => Promise<boolean>} An asynchronous function that takes a key and data as input and returns a Promise<boolean>.
 */
export const saveToRedis = (logger: any) => async (key: string, data: any): Promise<boolean> => {
    /**
     * Logs a message indicating that data with the specified key is being saved to Redis.
     */
    logger.info(`Saving data with key:${key} to redis...`);
    
    // Attempt to get a Redis connection
    const redisConnection = getRedisConnection(logger);
    if (redisConnection) {
        try {
            // Convert the data (assuming convertData function is defined and works correctly)
            const convertedData = convertData(data)
            // Attempt to save the data to Redis
            const result = await redisConnection.set(key, convertedData);
            if (!result) throw new Error(`Error saving data`);
            // Log the successful saving of data
            logger.info(`Data with key:${key} has been saved successfully.`);
            return true;
        } catch (err) {
            // Log any errors that occur during data saving
            logger.error(`Redis Error saving data: ${(err as Error).message}`);
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
    logger.error(`Saving data with key:${key} process has been stopped`)
    return false;
};