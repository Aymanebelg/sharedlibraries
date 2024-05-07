import { deleteFromRedis } from "./remove/remove";
import { getFromRedis } from "./retreive/retreive";
import { saveToRedis } from "./save/save";
import RedisClient from './models/RedisClient'

/**
 * Function to get a Redis client with specified logger.
 * @param {any} logger The logger object to use.
 * @returns {RedisClient} A Redis client instance.
 */
const getRedisClient = (logger: any): RedisClient => {
    const client: RedisClient = {
        get: getFromRedis(logger),
        save: saveToRedis(logger),
        remove: deleteFromRedis(logger)
    };
    return client;
};

export default getRedisClient;
