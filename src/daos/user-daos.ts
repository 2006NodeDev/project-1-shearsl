import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";


export async function getAllUsers(){
    let client:PoolClient;
    try{
        client = await connectionPool.connect();
        let results: QueryResult = await client.query(`select u.userId, u."username", u."userpassword", u."firstname", u."lastname", u."email", u."roleId"
                                    from lsquaredmath.users u
                                    natural join lsquaredmath.roles,
                                    natural join lsquaredmath.reimbursementStatus,
                                    natural join lsquaredmath.reimbursementType,
                                    natural join lsquaredmath.reimbursement
                                    group by u.roleId`);
        return results.rows; //.rows.map();
    }catch(e){  //error processing coming soon
        console.log(e);
        throw new Error('un-implemented error handling');
    }finally{  //if client is defined we release it the connection
        client && client.release();  //if the client doesn't exist, there is nothing to release
    }
}

export async function findUserById(id:number){
    let client: PoolClient;
    try{
        client = await connectionPool.connect();
        let results: QueryResult = await client.query(`select u.userId, u."username", u."userpassword", u."firstname", u."lastname", u."email", u."roleId" 
                                from lsquaredmath.users u
                                natural join lsquaredmath.roles,
                                natural join lsquaredmath.reimbursementStatus,
                                natural join lsquaredmath.reimbursementType,
                                natural join lsquaredmath.reimbursement
                                where u.userId = ${id}`);
    }
}