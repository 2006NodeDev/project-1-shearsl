import {HttpError} from "./HttpError";

export class UserInputError extends HttpError {
    constructor(){
        super(400, 'Please fill out all of the user infromation.');
    }
}

export class UserInputError2 extends HttpError {
    constructor(){
        super(400, 'Please fill out the user information that needs to be updated along with the userId.');
    }
}