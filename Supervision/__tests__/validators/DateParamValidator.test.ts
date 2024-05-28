import Joi from "joi";
import DateValidator from "../../src/validators/DateParamValidator"; 

describe("DateValidator", () => {
    it("should validate a correct date string", () => {
        const { error } = DateValidator.validate("2023-05-28");
        expect(error).toBeUndefined();
    });

    it("should invalidate a date string with incorrect format (MM-DD-YYYY)", () => {
        const { error } = DateValidator.validate("05-28-2023");
        expect(error).toBeDefined();
    });

    it("should invalidate a date string with non-numeric characters", () => {
        const { error } = DateValidator.validate("2023-05-XX");
        expect(error).toBeDefined();
    });

    it("should invalidate an empty date string", () => {
        const { error } = DateValidator.validate("");
        expect(error).toBeDefined();
    });

    it("should invalidate a date string with additional characters", () => {
        const { error } = DateValidator.validate("2023-05-28T00:00:00");
        expect(error).toBeDefined();
    });

    it("should invalidate a date string with missing parts", () => {
        const { error } = DateValidator.validate("2023-05");
        expect(error).toBeDefined();
    });

    it("should validate a date string with an incorrect month (as it checks format only)", () => {
        const { error } = DateValidator.validate("2023-13-28");
        expect(error).toBeUndefined();
    });

    it("should validate a date string with an incorrect day (as it checks format only)", () => {
        const { error } = DateValidator.validate("2023-05-32");
        expect(error).toBeUndefined();
    });
});
