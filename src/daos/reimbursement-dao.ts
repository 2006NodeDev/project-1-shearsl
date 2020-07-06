import { PoolClient, QueryResult, /*QueryResultBase*/ } from "pg";
import { connectionPool } from ".";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementInputError } from "../errors/ReimbursementInputError";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";

export async function getAllReimbursements(){
    let client:PoolClient;
    try{  
        client = await connectionPool.connect();
        let results: QueryResult = await client.query(`select r.reimbursementId, 
                                    r.userId, 
                                    u.firstname,
                                    u.lastname,
                                    r.amount,
                                    r.dateSubmitted, 
                                    r.dateResolved, 
                                    r.description, 
                                    r.resolver,
                                    r.statusId,
                                    s.status,
                                    r.typeId
                                    from lsquaredmath.users u 
                                    natural join lsquaredmath.reimbursement r 
                                    natural join lsquaredmath.reimbursementStatus s
                                    order by r.dateSubmitted`);
        return results.rows; //.rows.map(); need to write the UserDTOtoUserConvertor.ts and reference it here.
    }catch(e){  //error processing coming soon
        console.log(e);
        throw new Error('un-implemented error handling');
    }finally{  //if client is defined we release it's connection
        client && client.release();  //if the client doesn't exist, there is nothing to release
    }
}

export async function updateReimbursement(partialReimburse:Reimbursement){
    let client: PoolClient;   
    try{
        client = await connectionPool.connect();
        await client.query('BEGIN');

        //let results: QueryResultBase;
        if (partialReimburse.amount){
            await client.query('update lsquaredmath.reimbursement set amount=$1 where reimbursementId=$2',
                            [partialReimburse.amount, partialReimburse.reimbursementId]);
        }

        if (partialReimburse.dateResolved){
            await client.query('update lsquaredmath.reimbursement set dateResolved=$1 where reimbursementId=$2',
                            [partialReimburse.dateResolved, partialReimburse.reimbursementId]);
        }

        if (partialReimburse.dateSubmitted){
            await client.query('update lsquaredmath.reimbursement set dateSubmitted=$1 where reimbursementId=$2',
                            [partialReimburse.dateSubmitted, partialReimburse.reimbursementId]);
        }

        if (partialReimburse.description){
            await client.query('update lsquaredmath.reimbursement set description=$1 where reimbursementId=$2',
                            [partialReimburse.description, partialReimburse.reimbursementId]);
        }

        if (partialReimburse.resolver){
            await client.query('update lsquaredmath.resolver set dateResolved=$1 where reimbursementId=$2',
                            [partialReimburse.resolver, partialReimburse.reimbursementId]);
        }

        if (partialReimburse.statusId){
            await client.query('update lsquaredmath.statusId set dateResolved=$1 where reimbursementId=$2',
                            [partialReimburse.statusId, partialReimburse.reimbursementId]);
        }

        if (partialReimburse.typeId){
            await client.query('update lsquaredmath.typeId set dateResolved=$1 where reimbursementId=$2',
                            [partialReimburse.typeId, partialReimburse.reimbursementId]);
        }

        if (partialReimburse.userId){
            await client.query('update lsquaredmath.userId set dateResolved=$1 where reimbursementId=$2',
                            [partialReimburse.userId, partialReimburse.reimbursementId]);
        }

        await client.query('COMMIT;');
        //return;
    }catch(e){
        client && client.query('FOLLBACK;');
        throw new ReimbursementInputError();
    }finally{
        client && client.release();
    }
}

export async function findReimbursementById(id:number){
    let client: PoolClient;
    try{   
        client = await connectionPool.connect();
        
        let results: QueryResult = await client.query(`select r.reimbursementId, 
                                r."userid", 
                                r."amount", 
                                r."datesubmitted", 
                                r."dateresolved", 
                                r."description", 
                                r."resolver",
                                r."statusid",
                                r."typeid"
                                from lsquaredmath.reimbursement r
                                where r.reimbursementid = ${id}`);
        if(results.rowCount===0){ 
            throw new Error('NotFound');
        }else{
            return results.rows; //need to write convertor code to format the results nicely
        }
    }catch(err){
        if(err.message === 'NotFound'){
            throw new ReimbursementNotFoundError();
        }
        console.log(err);
        throw new Error('un-implemented error handling');
    }finally{
        client && client.release();
    }
}