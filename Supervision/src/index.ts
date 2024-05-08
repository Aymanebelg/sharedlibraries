import SupervisionController from "./models/SupervisionControllerModel";
import { connectivityCheckController, healthCheckController } from "./Controllers/ConnectivityCheck";
import { getLogFileController } from "./Controllers/FindLogs";

const GetSupervisionController = (logger: any): SupervisionController => {
    const SupervisionController: SupervisionController = {
        getConnectivityCheck: connectivityCheckController(logger),
        getLogFileByDate: getLogFileController(logger),
        healthCheck: healthCheckController(logger)
    }
    return SupervisionController
}

export default GetSupervisionController
export { default as ConnectivityChecks } from "./models/ConnectivityChecks"