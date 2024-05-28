import mongoose from "mongoose";
import * as amqp from "amqplib";
import Redis from "ioredis";
import SupervisionService from "../../src/Services/SupervisionService";
import config from "../../src/config/config";

jest.mock("mongoose");
jest.mock("amqplib");
jest.mock("ioredis");

describe("SupervisionService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("rabbitMqConnectivity", () => {
        it("should return true if RabbitMQ is connected", async () => {
            const mockConnect = jest.spyOn(amqp, "connect").mockResolvedValue({
                close: jest.fn().mockResolvedValue(undefined),
            } as unknown as amqp.Connection);

            const result = await SupervisionService.rabbitMqConnectivity();

            expect(mockConnect).toHaveBeenCalledWith(config.rabbitMqUrl, expect.any(Object));
            expect(result).toBe(true);
        });

        it("should return false if RabbitMQ connection fails", async () => {
            jest.spyOn(amqp, "connect").mockRejectedValue(new Error("Connection failed"));

            const result = await SupervisionService.rabbitMqConnectivity();

            expect(result).toBe(false);
        });
    });

    describe("mongoDbConnectivity", () => {
        it("should return true if MongoDB is connected", async () => {
            Object.defineProperty(mongoose, 'connection', {
                value: {
                    readyState: 1
                },
                writable: true
            });

            const result = await SupervisionService.mongoDbConnectivity();

            expect(result).toBe(true);
        });

        it("should return false if MongoDB is not connected", async () => {
            Object.defineProperty(mongoose, 'connection', {
                value: {
                    readyState: 0
                },
                writable: true
            });

            const result = await SupervisionService.mongoDbConnectivity();

            expect(result).toBe(false);
        });
    });

    describe("redisConnectivity", () => {
        it("should return true if Redis is connected", async () => {
            const mockRedis = jest.spyOn(Redis.prototype, "ping").mockResolvedValue("PONG");
            const mockQuit = jest.spyOn(Redis.prototype, "quit").mockResolvedValue("OK");

            const result = await SupervisionService.redisConnectivity();

            expect(mockRedis).toHaveBeenCalled();
            expect(mockQuit).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it("should return false if Redis connection fails", async () => {
            jest.spyOn(Redis.prototype, "ping").mockRejectedValue(new Error("Connection failed"));
            const mockQuit = jest.spyOn(Redis.prototype, "quit").mockResolvedValue("OK");

            const result = await SupervisionService.redisConnectivity();

            expect(mockQuit).toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });
});
