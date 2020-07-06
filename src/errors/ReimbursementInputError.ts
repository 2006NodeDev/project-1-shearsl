import {HttpError} from "./HttpError";

export class ReimbursementInputError extends HttpError {
    constructor(){
        super(400, 'Please fill out all of the reimbursement infromation.');
    }
}

export class ReimbursementInputError2 extends HttpError {
    constructor(){
        super(400, 'Please fill out the reimburesment information that needs to be updated along with the reimbursementId.');
    }
}