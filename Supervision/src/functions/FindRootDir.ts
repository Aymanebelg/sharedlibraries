import fs from "fs";
import path from "path";

const findRootDirectory = (currentDir: string): string | Error =>  {
    if (fs.existsSync(path.join(currentDir, 'logs'))) {
        return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
        return new Error('Logs directory does not exist in the current microservice');
    }

    return findRootDirectory(parentDir);
}

export default findRootDirectory