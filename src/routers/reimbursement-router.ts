import e, { Request, Response, NextFunction } from 'express';
import { getAllReimbursements, updateReimbursement, findReimbursementById } from '../daos/reimbursement-dao';
import { ReimbursementIdError } from '../errors/ReimbursementIdError';
import { /*ReimbursementInputError,*/ ReimbursementInputError2} from '../errors/ReimbursementInputError';
import { Reimbursement } from '../models/Reimbursement';

export let reimbursementRouter = e.Router();

reimbursementRouter.get('/', async(req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await getAllReimbursements(); //function in users-daos
        res.json(users);
    } catch (e) {
        next(e);
    }
});

//update a user selected by id
reimbursementRouter.patch('/', async(req:Request, res:Response, next:NextFunction) =>{
    let { reimbursementid, userId, amount, datesubmitted, dateResolved, description, resolver, statusId, typeId } = req.body //destructuring
    console.log(datesubmitted);
    if ((userId || amount || datesubmitted || dateResolved || description || !resolver || statusId || typeId) && reimbursementid){
        if (isNaN(+reimbursementid)) {
            next(new ReimbursementIdError());
        }
        let partialReimburement:Reimbursement = { 
            reimbursementId: +reimbursementid, 
            userId:(userId?userId:0),
            amount:(amount?amount:0), 
            dateSubmitted:(datesubmitted?datesubmitted:0), 
            dateResolved:(dateResolved?dateResolved:0), 
            description:(description?description:""), 
            resolver:(resolver?resolver:0), 
            statusId:(statusId?statusId:0), 
            typeId:(typeId?typeId:0)
        }
        try { 
            await updateReimbursement(partialReimburement);
            let reimburseUpdated = await findReimbursementById(reimbursementid);
            res.json(reimburseUpdated);
        } catch (e) {
            next(e);
        }
    } else {
        next(new ReimbursementInputError2); 
    }
});