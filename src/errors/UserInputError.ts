import {HttpError} from "./HttpError";

export class UserInputError extends HttpError {
    constructor(){
        super(400, 'Please fill out all of the user infromation.');
    }
}