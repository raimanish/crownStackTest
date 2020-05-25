export enum DbError {
    Unauthorized = "Unauthorized",
    UniqueKey = "Duplicate key found.",
    UniqueObject = "Duplicate objects found.",
    GenericNotFound = "Not Found",
    ObjectIdNotFound = "Object ID Not Found",
    InvalidObjectId = "Invalid Object ID",
    MethodNotImplemented = "Method Not Implemented",
    ArgumentValidationError = "Argument Validation Error"
}

export interface IError extends Error {
    statusCode?: number;
    validationErrors?: any[];
}

export type ErrorMaybe = IError | void;
export type ASyncErrorMaybe = () => Promise<ErrorMaybe>;

// Note: This should not be an export
function errorResponse(errorStatus: number = 500, errorMessage: string = "Internal Server Error"): IError {
    const error: IError = new Error(errorMessage);
    error.statusCode = errorStatus;
    return error;
}

export function handleError(err: any): ErrorMaybe {
    if (err && err.message !== undefined) {
        switch (err.message) {
            case DbError.Unauthorized:
                return errorResponse(401, "Access to the resource was unauthorized.");
            case DbError.UniqueKey:
                return errorResponse(409, "Unique validation failed. The object was not created.");
            case DbError.UniqueObject:
                return errorResponse(409, "The object query returned more than one duplicate result.");
            case DbError.ObjectIdNotFound:
                return errorResponse(404, "The provided object id (:id) was not found on the server.");
            case DbError.GenericNotFound:
                return errorResponse(404, "The resource was not found on the server.");
            case DbError.InvalidObjectId:
                return errorResponse(400, "The provided object id (:id) was not in the correct format.");
            case DbError.ArgumentValidationError:
                return err;
        }
    }
    console.log("Error: ", err);
    return errorResponse();
}

export function argumentValidationError(errors: any[]) {
    let error: IError = errorResponse(409, DbError.ArgumentValidationError);
    error.validationErrors = errors;
    return error;
}
