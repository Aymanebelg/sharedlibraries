import { NextFunction, type Request, type Response } from "express";
import SupervisionService from "../Services/SupervisionService";
import ConnectivityChecks from "../models/ConnectivityChecks";
import { StatusCode } from "../utils/MessageTypes";

export const healthCheckController = (logger: any) => (req: Request, res: Response, nextFunction: NextFunction) => {
    logger.info('Checking server health...')
    res.status(StatusCode.OK).json({ message: 'Server is UP'});
}

export const connectivityCheckController = (logger: any) => (checks: ConnectivityChecks) => async (req: Request, res: Response, nextFunction: NextFunction) => {
    logger.info('Starting a connectivity check...')
    const connectivityChecksResult: ConnectivityChecks = {};

    if (checks.mongoDb) {
        logger.info('Checking mongoDb connection...')
        const mongoDbConnection = await SupervisionService.mongoDbConnectivity();
        mongoDbConnection 
            ? logger.info('MongoDb is connected.')
            : logger.error('MongoDb is not connected.')
        connectivityChecksResult.mongoDb = mongoDbConnection;
    }

    if (checks.rabbitMq) {
        logger.info('Checking RabbitMq connection...')
        const rabbitMqConnection = await SupervisionService.rabbitMqConnectivity();
        rabbitMqConnection 
            ? logger.info('RabbitMq is connected.')
            : logger.error('RabbitMq is not connected.')
        connectivityChecksResult.rabbitMq = rabbitMqConnection;
    }

    if (checks.redis) {
        logger.info('Checking Redis connection...')
        const redisConnection = await SupervisionService.redisConnectivity();
        redisConnection 
            ? logger.info('Redis is connected.')
            : logger.error('Redis is not connected.')
        connectivityChecksResult.redis = redisConnection;
    }

    logger.info(`Connectivity check result: ${JSON.stringify(connectivityChecksResult)}`)
    res.status(StatusCode.OK).json(connectivityChecksResult);
}

