import { Request, Response, NextFunction } from "express";
import findRootDirectory from "../../src/functions/FindRootDir";
import fs from "fs";
import DateValidator from "../../src/validators/DateParamValidator";
import { ErrorTypes, StatusCode } from "../../src/utils/MessageTypes";
import { getLogFileController } from "../../src/Controllers/FindLogs";

const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
};

const mockReq = {
    params: {
        date: "2023-05-28",
    },
} as unknown as Request;

const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    download: jest.fn(),
} as unknown as Response;

const mockNext = jest.fn();

jest.mock("fs", () => ({
    access: jest.fn(),
    constants: {
        F_OK: 0,
    },
}));

jest.mock("../../src/functions/FindRootDir", () => jest.fn());

jest.mock("../../src/validators/DateParamValidator", () => ({
    validate: jest.fn(),
}));

describe("getLogFileController", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if the date is invalid", () => {
        (DateValidator.validate as jest.Mock).mockReturnValue({ error: { details: [{ message: "Invalid date format" }] } });
        const controller = getLogFileController(mockLogger);

        controller(mockReq, mockRes, mockNext);

        expect(mockLogger.info).toHaveBeenCalledWith("Validating the input date 2023-05-28...");
        expect(mockRes.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: {
                name: ErrorTypes.INVALID_DATE,
                details: ["Invalid date format"],
            },
        });
    });

    it("should return 500 if the root directory is not found", () => {
        (DateValidator.validate as jest.Mock).mockReturnValue({ error: null });
        (findRootDirectory as jest.Mock).mockReturnValue(new Error("Root directory not found"));
        const controller = getLogFileController(mockLogger);

        controller(mockReq, mockRes, mockNext);

        expect(mockLogger.info).toHaveBeenCalledWith("Looking for logs directory...");
        expect(mockLogger.error).toHaveBeenCalledWith("Logs directory not found");
        expect(mockRes.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: {
                name: ErrorTypes.UNEXPECTED_ERROR,
                details: "Root directory not found",
            },
        });
    });

    it("should return 404 if the log file is not found", () => {
        (DateValidator.validate as jest.Mock).mockReturnValue({ error: null });
        (findRootDirectory as jest.Mock).mockReturnValue("/mock/root/directory");
        (fs.access as unknown as jest.Mock).mockImplementation((path, flags, callback) => callback(new Error("File not found")));
        const controller = getLogFileController(mockLogger);

        controller(mockReq, mockRes, mockNext);

        expect(mockLogger.info).toHaveBeenCalledWith("Looking for log file of date: 2023-05-28");
        expect(mockLogger.error).toHaveBeenCalledWith("Log file not found for date: 2023-05-28. File not found");
        expect(mockRes.status).toHaveBeenCalledWith(StatusCode.NOT_FOUND);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: {
                name: ErrorTypes.LOG_FILE_NOT_FOUND,
                details: "Log file not found for date: 2023-05-28. File not found",
            },
        });
    });

    it("should return 400 if the log file download fails", () => {
        (DateValidator.validate as jest.Mock).mockReturnValue({ error: null });
        (findRootDirectory as jest.Mock).mockReturnValue("/mock/root/directory");
        (fs.access as unknown as jest.Mock).mockImplementation((path, flags, callback) => callback(null));
        (mockRes.download as jest.Mock).mockImplementation((path, callback) => callback(new Error("Download error")));
        const controller = getLogFileController(mockLogger);

        controller(mockReq, mockRes, mockNext);

        expect(mockLogger.info).toHaveBeenCalledWith("Looking for log file of date: 2023-05-28");
        expect(mockLogger.info).toHaveBeenCalledWith("Log file for date: 2023-05-28 has been found.");
        expect(mockLogger.error).toHaveBeenCalledWith("Failed to download log file. Download error");
        expect(mockRes.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: {
                name: ErrorTypes.LOG_FILE_NOT_FOUND,
                details: "Failed to download log file. Download error",
            },
        });
    });

    it("should successfully download the log file", () => {
        (DateValidator.validate as jest.Mock).mockReturnValue({ error: null });
        (findRootDirectory as jest.Mock).mockReturnValue("/mock/root/directory");
        (fs.access as unknown as jest.Mock).mockImplementation((path, flags, callback) => callback(null));
        (mockRes.download as jest.Mock).mockImplementation((path, callback) => callback(null));
        const controller = getLogFileController(mockLogger);

        controller(mockReq, mockRes, mockNext);

        expect(mockLogger.info).toHaveBeenCalledWith("Looking for log file of date: 2023-05-28");
        expect(mockLogger.info).toHaveBeenCalledWith("Log file for date: 2023-05-28 has been found.");
        expect(mockRes.download).toHaveBeenCalledWith("/mock/root/directory/logs/2023-05-28.log", expect.any(Function));
    });
});
