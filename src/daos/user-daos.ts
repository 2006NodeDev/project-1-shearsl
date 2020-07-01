import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { UserNotFoundError } from "../errors/UserNotFoundError";
//import e from "express";


export async function getAllUsers(){
    let client:PoolClient;
    try{
        client = await connectionPool.connect();
        let results: QueryResult = await client.query(`select u.userId, 
                                    u."username", 
                                    u."userpassword",
                                    u."firstname", 
                                    u."lastname", 
                                    u."email", 
                                    u."roleid",
                                    r."workroles"
                                    from lsquaredmath.users u natural join lsquaredmath.roles r
                                    order by u.roleid`);
        return results.rows; //.rows.map(); need to write the UserDTOtoUserConvertor.ts and reference it here.
    }catch(e){  //error processing coming soon
        console.log(e);
        throw new Error('un-implemented error handling');
    }finally{  //if client is defined we release it's connection
        client && client.release();  //if the client doesn't exist, there is nothing to release
    }
}

export async function findUserById(id:number){
    let client: PoolClient;
    try{
        client = await connectionPool.connect();
        let results: QueryResult = await client.query(`select u.userId, 
                                u."username", 
                                u."userpassword", 
                                u."firstname", 
                                u."lastname", 
                                u."email", 
                                u."roleid" 
                                from lsquaredmath.users u
                                where u.userid = ${id}`);
        if(results.rowCount===0){ 
            throw new Error('NotFound');;
        }else{
            return results.rows; //need to write convertor code to format the results nicely
        }
    }catch(err){
        if(err.message === 'NotFound'){
            throw new UserNotFoundError();
        }
        console.log(err);
        throw new Error('un-implemented error handling');
    }finally{
        client && client.release();
    }
}