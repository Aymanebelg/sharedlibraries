import { Request, Response } from "express";
import { connectivityCheckController, healthCheckController } from "../../src/Controllers/ConnectivityCheck";
import { StatusCode } from "../../src/utils/MessageTypes";
import SupervisionService from "../../src/Services/SupervisionService";

const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
};

const mockReq = {} as Request;
const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
} as unknown as Response;
const mockNext = jest.fn();

describe('healthCheckController', () => {
    it('should return server health status', () => {
        const controller = healthCheckController(mockLogger);

        controller(mockReq, mockRes, mockNext);

        expect(mockLogger.info).toHaveBeenCalledWith('Checking server health...');
        expect(mockRes.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server is UP' });
    });
});

jest.mock('../../src/Services/SupervisionService', () => ({
    mongoDbConnectivity: jest.fn(),
    rabbitMqConnectivity: jest.fn(),
    redisConnectivity: jest.fn(),
}));

describe('connectivityCheckController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should perform connectivity checks and return the results', async () => {
        const checks = { mongoDb: true, rabbitMq: true, redis: true };
        const controller = connectivityCheckController(mockLogger)(checks);

        (SupervisionService.mongoDbConnectivity as jest.Mock).mockResolvedValue(true);
        (SupervisionService.rabbitMqConnectivity as jest.Mock).mockResolvedValue(false);
        (SupervisionService.redisConnectivity as jest.Mock).mockResolvedValue(true);

        await controller(mockReq, mockRes, mockNext);

        expect(mockLogger.info).toHaveBeenCalledWith('Starting a connectivity check...');
        expect(mockLogger.info).toHaveBeenCalledWith('Checking mongoDb connection...');
        expect(mockLogger.info).toHaveBeenCalledWith('MongoDb is connected.');
        expect(mockLogger.info).toHaveBeenCalledWith('Checking RabbitMq connection...');
        expect(mockLogger.error).toHaveBeenCalledWith('RabbitMq is not connected.');
        expect(mockLogger.info).toHaveBeenCalledWith('Checking Redis connection...');
        expect(mockLogger.info).toHaveBeenCalledWith('Redis is connected.');
        expect(mockLogger.info).toHaveBeenCalledWith(`Connectivity check result: ${JSON.stringify({ mongoDb: true, rabbitMq: false, redis: true })}`);
        expect(mockRes.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(mockRes.json).toHaveBeenCalledWith({ mongoDb: true, rabbitMq: false, redis: true });
    });

    it('should handle cases when some services are not checked', async () => {
        const checks = { mongoDb: true, rabbitMq: false, redis: true };
        const controller = connectivityCheckController(mockLogger)(checks);

        (SupervisionService.mongoDbConnectivity as jest.Mock).mockResolvedValue(true);
        (SupervisionService.redisConnectivity as jest.Mock).mockResolvedValue(true);

        await controller(mockReq, mockRes, mockNext);

        expect(mockLogger.info).toHaveBeenCalledWith('Starting a connectivity check...');
        expect(mockLogger.info).toHaveBeenCalledWith('Checking mongoDb connection...');
        expect(mockLogger.info).toHaveBeenCalledWith('MongoDb is connected.');
        expect(mockLogger.info).toHaveBeenCalledWith('Checking Redis connection...');
        expect(mockLogger.info).toHaveBeenCalledWith('Redis is connected.');
        expect(mockLogger.info).toHaveBeenCalledWith(`Connectivity check result: ${JSON.stringify({ mongoDb: true, redis: true })}`);
        expect(mockRes.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(mockRes.json).toHaveBeenCalledWith({ mongoDb: true, redis: true });
    });

    it('should return all services as down', async () => {
        const checks = { mongoDb: true, rabbitMq: true, redis: true };
        const controller = connectivityCheckController(mockLogger)(checks);

        (SupervisionService.mongoDbConnectivity as jest.Mock).mockResolvedValue(false);
        (SupervisionService.rabbitMqConnectivity as jest.Mock).mockResolvedValue(false);
        (SupervisionService.redisConnectivity as jest.Mock).mockResolvedValue(false);

        await controller(mockReq, mockRes, mockNext);

        expect(mockLogger.info).toHaveBeenCalledWith('Starting a connectivity check...');
        expect(mockLogger.info).toHaveBeenCalledWith('Checking mongoDb connection...');
        expect(mockLogger.error).toHaveBeenCalledWith('MongoDb is not connected.');
        expect(mockLogger.info).toHaveBeenCalledWith('Checking RabbitMq connection...');
        expect(mockLogger.error).toHaveBeenCalledWith('RabbitMq is not connected.');
        expect(mockLogger.info).toHaveBeenCalledWith('Checking Redis connection...');
        expect(mockLogger.error).toHaveBeenCalledWith('Redis is not connected.');
        expect(mockLogger.info).toHaveBeenCalledWith(`Connectivity check result: ${JSON.stringify({ mongoDb: false, rabbitMq: false, redis: false })}`);
        expect(mockRes.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(mockRes.json).toHaveBeenCalledWith({ mongoDb: false, rabbitMq: false, redis: false });
    });

    it('should return all services as up', async () => {
        const checks = { mongoDb: true, rabbitMq: true, redis: true };
        const controller = connectivityCheckController(mockLogger)(checks);

        (SupervisionService.mongoDbConnectivity as jest.Mock).mockResolvedValue(true);
        (SupervisionService.rabbitMqConnectivity as jest.Mock).mockResolvedValue(true);
        (SupervisionService.redisConnectivity as jest.Mock).mockResolvedValue(true);

        await controller(mockReq, mockRes, mockNext);

        expect(mockLogger.info).toHaveBeenCalledWith('Starting a connectivity check...');
        expect(mockLogger.info).toHaveBeenCalledWith('Checking mongoDb connection...');
        expect(mockLogger.info).toHaveBeenCalledWith('MongoDb is connected.');
        expect(mockLogger.info).toHaveBeenCalledWith('Checking RabbitMq connection...');
        expect(mockLogger.info).toHaveBeenCalledWith('RabbitMq is connected.');
        expect(mockLogger.info).toHaveBeenCalledWith('Checking Redis connection...');
        expect(mockLogger.info).toHaveBeenCalledWith('Redis is connected.');
        expect(mockLogger.info).toHaveBeenCalledWith(`Connectivity check result: ${JSON.stringify({ mongoDb: true, rabbitMq: true, redis: true })}`);
        expect(mockRes.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(mockRes.json).toHaveBeenCalledWith({ mongoDb: true, rabbitMq: true, redis: true });
    });
});
