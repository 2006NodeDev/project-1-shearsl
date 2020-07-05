import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { UserInputError } from "../errors/UserInputError";
import { User } from "../models/User";
//import { UserInputError } from "../errors/UserInputError";
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

export async function findUserByUsername(uname:string){
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
                                    where u.username = ${uname}`); 
        if(results.rowCount===0){ 
            throw new Error('NotFound');
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


export async function updateUserById(partUser:User){ //id is embedded into the partial user information
    let client: PoolClient;
    let updatedUser:User;
    try{  
        client = await connectionPool.connect();
        await client.query('BEGIN;')//start a transaction
        //update values for any values that were passed in
        if(partUser.username){  console.log(partUser.username); //<-- code for testing
            /*let results = */await client.query(`update lsquaredmath.users set "username" =  $1 where "userid"=$2`,
                                            [partUser.username, partUser.userid]);
            //updatedUser.username = results.rows[0].username;
        }
        if(partUser.firstname){ console.log(partUser.firstname);//<-code for testing
            /*let results = */await client.query(`update lsquaredmath.users set firstname=$1 where userid=$2`,
                                            [partUser.firstname, ]);
            //updatedUser.firstname = results.rows[0].firstname;
        }
        if(partUser.lastname){ console.log(partUser.lastname); //code for testing
            await client.query(`update lsquaredmath.users set lastname=$1 where userid=$2`,
            [partUser.lastname, partUser.userid]);
        }
        if(partUser.userpassword){ console.log(partUser.userpassword); //<--code for testing
            await client.query(`update lsquaredmath.users set userpassword=$1 where userid=$2`,
            [partUser.userpassword, partUser.userid]);
        }
        if(partUser.email){ console.log(partUser.email); //<--code for testing
           await client.query(`update lsquaredmath.users set email=$1 where userid=$2`,
           [partUser.email, partUser.userid]);
        }
        if(partUser.roleid){  console.log(partUser.roleid);  //<-- code for testing
            await client.query(`update lsquaredmath.users set roleid=$1 where userid=$2`,
             [partUser.roleid, partUser.userid]);
        }
        await client.query('COMMIT;'); //ends transaction
        return updatedUser;
    }catch(e){
        client && client.query('ROLLBACK;')//if a js error takes place, undo the sql
        if(e.message === 'Role Not Found'){
            throw new UserInputError();// role not found error
        }
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured');
    }finally{
        client && client.release();
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
            throw new Error('NotFound');
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

// save one user
export async function saveOneUser(newUser:User):Promise<User>{
    let client:PoolClient;
    try{  
        client = await connectionPool.connect();
        //if you have multiple querys, you should make a transaction
        await client.query('BEGIN;')//start a transaction
        /*let results =*/ await client.query(`insert into lsquaredmath.users ("username", "firstname", "lastname", "userpassword","email","roleid")
                                        values($1,$2,$3,$4,$5,$6) returning "userid" `,//allows you to return some values from the rows in an insert, update or delete
                                        [newUser.username, newUser.firstname, 
                                        newUser.lastname, newUser.userpassword, 
                                        newUser.email, newUser.roleid]);
        //newUser.userid = results.rows[0].userid;
        //console.log(`in save new user newUser.userid = ${newUser.userid}`);
        await client.query('COMMIT;'); //ends transaction
        return newUser

    }catch(e){
        client && client.query('ROLLBACK;')//if a js error takes place, undo the sql
        if(e.message === 'Role Not Found'){
            throw new UserInputError();// role not found error
        }
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured');
    }finally{
        client && client.release();
    }
}