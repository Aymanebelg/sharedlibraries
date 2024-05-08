import { NextFunction, type Request, type Response } from "express";
import findRootDirectory from "../functions/FindRootDir";
import fs from "fs";
import path from "path";
import DateValidator from "../validators/DateParamValidator";
import { ErrorTypes, StatusCode } from "../utils/MessageTypes";

export const getLogFileController = (logger: any) => (req: Request, res: Response, nextFunction: NextFunction) => {
    const date = req.params.date;
    logger.info(`Validating the input date ${date}...`)
    const { error } = DateValidator.validate(date, { abortEarly: false })
    if (error) {
      const errorMessages = error.details.map(detail => detail.message)
      res.status(StatusCode.BAD_REQUEST).json({
        error: {
          name: ErrorTypes.INVALID_DATE,
          details: errorMessages
        }
      })
    }

    logger.info(`Looking for logs directory...`)
    const rootDirectory = findRootDirectory(__dirname);
    if(rootDirectory instanceof Error){
        logger.error(`Logs directory not found`)
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: {
            name: ErrorTypes.UNEXPECTED_ERROR,
            details: rootDirectory.message
          }
        });
        return
    }
    const logPath = path.join(`${rootDirectory}/logs`, `${date}.log`);

    logger.info(`Looking for log file of date: ${date}`)
    fs.access(logPath, fs.constants.F_OK, (err) => {
        if (err) {
          const errorMsg = `Log file not found for date: ${date}. ${err.message}`
          logger.error(errorMsg)
          res.status(StatusCode.NOT_FOUND).json({
            error: {
              name: ErrorTypes.LOG_FILE_NOT_FOUND,
              details: errorMsg
            }
          });
          return
        }
        logger.info(`Log file for date: ${date} has been found.`)
        res.download(logPath, (err) => {
          if (err) {
            const errorMsg = `Failed to download log file. ${err.message}`
            logger.error(errorMsg)
            res.status(StatusCode.BAD_REQUEST).json({
              error: {
                name: ErrorTypes.LOG_FILE_NOT_FOUND,
                details: errorMsg
              }
            });
            return
          }
        });
    });
}