import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { UserInputError } from "../errors/UserInputError";
import { User } from "../models/User";
import { UserDTOtoUserConvertor } from "../utils/UserDTO-to-User-convertor";


export async function getClassLists(){
    let client:PoolClient;
    try{
        client = await connectionPool.connect();
        let results: QueryResult = await client.query(`select userid, firstname, 
                                    lastname, email, roledescription from 
                                    (sections natural join users natural join roles)`); 
                                    //where sectionid=${id};`);    after adding login add some code to make this return only what the user has access tonpm 
    return results.rows.map(UserDTOtoUserConvertor); //results.rows; //.rows.map(); need to write the UserDTOtoUserConvertor.ts and reference it here.
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
    //let updatedUser: User;
    let results: QueryResult;
    try{    
        client = await connectionPool.connect();
        await client.query('BEGIN;')//start a transaction
        //update values for any values that were passed in
        if(partUser.username){  
            await client.query(`update lsquaredmath.users set username=$1 where userid=$2`,
                                            [partUser.username, partUser.userid]);
        }else{
            results = await client.query(`select firstname from lsquaredmath.users where userid = ${partUser.userid}`);
            partUser.username = results.rows.values.toString();
        }
        
        if(partUser.firstname){ 
            await client.query(`update lsquaredmath.users set firstname=$1 where userid=$2`,
                                            [partUser.firstname, partUser.userid]);
        } else {
            results = await client.query(`select firstname from lsquaredmath.users where userid = ${partUser.userid}`);
            partUser.firstname = results.rows.values.toString();
        }
        
        if(partUser.lastname){ 
            await client.query(`update lsquaredmath.users set lastname=$1 where userid=$2`,
                                            [partUser.lastname, partUser.userid]);
        }else{
            results = await client.query(`select lastname from lsquaredmath.users where userid = ${partUser.userid}`);
            partUser.lastname = results.rows.values.toString();
        }
        
        if(partUser.userpassword){ 
            await client.query(`update lsquaredmath.users set userpassword=$1 where userid=$2`,
                                            [partUser.userpassword, partUser.userid]);
        }else{
            results = await client.query(`select userpassword from lsquaredmath.users where userid = ${partUser.userid}`);
            partUser.userpassword = results.rows.values.toString();
        }
     
        if(partUser.email){
            await client.query(`update lsquaredmath.users set email=$1 where userid=$2`,
                                            [partUser.email, partUser.userid]);
        }else{
            results = await client.query(`select email from lsquaredmath.users where userid = ${partUser.userid}`);
            partUser.email = results.rows.values.toString();
        }
        
        if(partUser.roleid){  
            await client.query(`update lsquaredmath.users set roleid=$1 where userid=$2`,
                                            [partUser.roleid, partUser.userid]);
        }else{
            results = await client.query(`select roleid from lsquaredmath.users where userid = ${partUser.userid}`);
            partUser.roleid = +results.rows.values;
        }
        await client.query('COMMIT;'); //ends transaction
        return partUser;
    }catch(e){
        client && client.query('ROLLBACK;')//if a js error takes place, undo the sql
        //if(e.message === 'Role Not Found'){
            throw new UserInputError();// role not found error
        //}
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured');
    }finally{
        client && client.release();
    }
}



// save one user
export async function saveOneUser(newUser:User):Promise<User>{
    let client:PoolClient;
    try{  
        client = await connectionPool.connect();
        await client.query(`insert into lsquaredmath.users ("username", "firstname", "lastname", "userpassword","email","role")
                                        values($1,$2,$3,$4,$5,$6) returning "userid" `,//allows you to return some values from the rows in an insert, update or delete
                                        [newUser.username, newUser.firstname, 
                                        newUser.lastname, newUser.userpassword, 
                                        newUser.email, newUser.roleid]);
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