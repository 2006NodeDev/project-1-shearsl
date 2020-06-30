import { HttpError } from "./HttpError";

export class UserNotFoundError extends HttpError{
    constructor(){
        super(404, 'The requested user does not exist.  Make sure you entered the correct username and password.');
    }
}