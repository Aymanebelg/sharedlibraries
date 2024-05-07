import DataModel from "../models/DataModel"

const convertData = (data: any): string =>{
    const dataType = typeof data
    const dataAsString =  getString(dataType, data)
    const dataModel: DataModel = {
        type: typeof data,
        dataAsString: dataAsString
    }
    return JSON.stringify(dataModel)
}

const getString = (dataType: string, data: any): string => {
    switch(dataType) {
        case "object":
            return JSON.stringify(data);
        default:
            return String(data);
    }
}

export default convertData