import DataModel from "../models/DataModel";

const revertData = (convertedData: string): any => {
    const dataModel = JSON.parse(convertedData) as DataModel
    switch(dataModel.type) {
        case "number":
            return parseFloat(dataModel.dataAsString!);
        case "boolean":
            return dataModel.dataAsString === "true";
        case "object":
            return JSON.parse(dataModel.dataAsString!);
        default:
            return dataModel.dataAsString;
    }
}

export default revertData