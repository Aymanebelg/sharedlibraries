import { NextFunction, type Response, type Request } from "express";
import ConnectivityChecks from "./ConnectivityChecks";

interface SupervisionController {
    getConnectivityCheck: (checks: ConnectivityChecks) => (req: Request, res: Response, nextFunction: NextFunction) => void;
    getLogFileByDate: (req: Request, res: Response, nextFunction: NextFunction) => void;
    healthCheck: (req: Request, res: Response, nextFunction: NextFunction) => void;
}

export default SupervisionController;