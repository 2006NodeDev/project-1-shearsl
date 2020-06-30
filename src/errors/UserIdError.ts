import { HttpError } from "./HttpError";

export class UserIdError extends HttpError{
    constructor(){
        super(400, 'UserId must be a number.');
    }
}