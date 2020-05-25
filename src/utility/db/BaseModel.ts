import { ValidatorOptions, validate, IsOptional, IsString } from "class-validator";
// import { ErrorMaybe, argumentValidationError } from "./ErrorHandlers";

export const FETCH_LIMIT = 25;

export abstract class BaseModel {
    id: string;

    @IsOptional()
    @IsString()
    created?: string;

    @IsOptional()
    @IsString()
    modified?: string;
}
