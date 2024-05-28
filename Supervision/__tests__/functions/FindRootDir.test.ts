import fs from "fs";
import path from "path";
import findRootDirectory from "../../src/functions/FindRootDir";

jest.mock("fs");

describe("findRootDirectory", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return the current directory if 'logs' exists", () => {
        const currentDir = "/mock/current/dir";
        (fs.existsSync as jest.Mock).mockReturnValue(true);

        const result = findRootDirectory(currentDir);

        expect(fs.existsSync).toHaveBeenCalledWith(path.join(currentDir, 'logs'));
        expect(result).toBe(currentDir);
    });

    it("should return an error if 'logs' directory does not exist in the hierarchy", () => {
        const currentDir = "/mock/current/dir";
        const parentDir = "/mock/current";
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        jest.spyOn(path, 'dirname').mockImplementation((dir) => {
            if (dir === currentDir) return parentDir;
            if (dir === parentDir) return parentDir; 
            return "/";
        });

        const result = findRootDirectory(currentDir);

        expect(fs.existsSync).toHaveBeenCalledWith(path.join(currentDir, 'logs'));
        expect(fs.existsSync).toHaveBeenCalledWith(path.join(parentDir, 'logs'));
        expect(result).toEqual(new Error('Logs directory does not exist in the current microservice'));
    });

    it("should traverse up the directory hierarchy to find 'logs' directory", () => {
        const currentDir = "/mock/current/dir";
        const parentDir = "/mock/current";
        const rootDir = "/mock";
        (fs.existsSync as jest.Mock)
            .mockReturnValueOnce(false) 
            .mockReturnValueOnce(false) 
            .mockReturnValueOnce(true); 

        jest.spyOn(path, 'dirname').mockImplementation((dir) => {
            if (dir === currentDir) return parentDir;
            if (dir === parentDir) return rootDir;
            return "/";
        });

        const result = findRootDirectory(currentDir);

        expect(fs.existsSync).toHaveBeenCalledWith(path.join(currentDir, 'logs'));
        expect(fs.existsSync).toHaveBeenCalledWith(path.join(parentDir, 'logs'));
        expect(fs.existsSync).toHaveBeenCalledWith(path.join(rootDir, 'logs'));
        expect(result).toBe(rootDir);
    });
});
