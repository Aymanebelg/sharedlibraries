import convertData from "../../src/functions/convertData"; 
import DataModel from "../../src/models/DataModel"; 

describe("convertData function", () => {
    it("should convert a string to DataModel", () => {
        const input = "Hello, world!";
        const result = convertData(input);
        const expected: DataModel = {
            type: "string",
            dataAsString: "Hello, world!"
        };
        expect(result).toEqual(JSON.stringify(expected));
    });

    it("should convert a number to DataModel", () => {
        const input = 42;
        const result = convertData(input);
        const expected: DataModel = {
            type: "number",
            dataAsString: "42"
        };
        expect(result).toEqual(JSON.stringify(expected));
    });

    it("should convert a boolean to DataModel", () => {
        const input = true;
        const result = convertData(input);
        const expected: DataModel = {
            type: "boolean",
            dataAsString: "true"
        };
        expect(result).toEqual(JSON.stringify(expected));
    }); 

    it("should convert an object to DataModel", () => {
        const input = { key: "value" };
        const result = convertData(input);
        const expected: DataModel = {
            type: "object",
            dataAsString: JSON.stringify(input)
        };
        expect(result).toEqual(JSON.stringify(expected));
    });

    it("should convert an array to DataModel", () => {
        const input = [1, 2, 3];
        const result = convertData(input);
        const expected: DataModel = {
            type: "object",
            dataAsString: JSON.stringify(input)
        };
        expect(result).toEqual(JSON.stringify(expected));
    });

    it("should convert a null to DataModel", () => {
        const input = null;
        const result = convertData(input);
        const expected: DataModel = {
            type: "object",
            dataAsString: "null"
        };
        expect(result).toEqual(JSON.stringify(expected));
    });

    it("should convert an undefined to DataModel", () => {
        const input = undefined;
        const result = convertData(input);
        const expected: DataModel = {
            type: "undefined",
            dataAsString: "undefined"
        };
        expect(result).toEqual(JSON.stringify(expected));
    });
});
