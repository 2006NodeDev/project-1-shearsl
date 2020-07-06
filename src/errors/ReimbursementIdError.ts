import { HttpError } from "./HttpError";

export class ReimbursementIdError extends HttpError{
    constructor(){
        super(400, 'ReimbursementId must be a number.');
    }
}