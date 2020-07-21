import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { UserInputError, UserInputError2 } from "../errors/UserInputError";
import { User } from "../models/User";
//import { UserDTOtoUserConvertor } from "../utils/UserDTO-to-User-convertor";


export async function getClassLists(){
    let client:PoolClient;
    try{ 
        client = await connectionPool.connect();
        let results: QueryResult = await client.query(`select sectionid, classtitle, userid, username, firstname, 
                                    lastname, email, roledescription from (mathplay_sql.sections
                                    natural join mathplay_sql.users natural join mathplay_sql.roles)
                                    order by sectionid, roleid, lastname;`); 
                                    //where sectionid=${id};`);    after adding login add some code to make this return only what the user has access tonpm 
    return results.rows//.map(UserDTOtoUserConvertor); //results.rows; //.rows.map(); need to write the UserDTOtoUserConvertor.ts and reference it here.
    }catch(e){  //error processing coming soon
        console.log(e);
        throw new Error('un-implemented error handling');
    }finally{  //if client is defined we release it's connection
        client && client.release();  //if the client doesn't exist, there is nothing to release
    }
}

//Another way to try to do what I was doing below, but this one returns a user.  
//Not currently using. I need to move on so I am giving up on this for now.  I would 
//like to come back to this later.
export async function findMostRecentNewUser():Promise<User>{
    let client: PoolClient;
    let foundUser: User;
    try{
        client = await connectionPool.connect();
        let results: QueryResult = await client.query(`select sectionid,
                                classtitle, userid, username, firstname,
                                lastname, email, roledescription
                                from mathplay_sql.roles natural join mathplay_sql.users natural join mathplay_sql.sections
                                where userid = (select max(userid) from mathplay_sql.users);`);
        if (results.rowCount!==1){
            throw new Error('NotFound');
        }else{
            return foundUser; 
        }
    }finally{
        client && client.release();
    }
} 

//this function is called with a get id# in the router.  It finds a user by their id number and displays the results
//I tried also coalling it right after a new user is posted so it could display all of the results for that user, but
//I couldn't get that to work.  When a user is first created, their id is 0 and then it gets reset automatically in 
//the database.  Since they are the most recently added user, they would have the maximum userid.
export async function findUserById(id:number){ 
    let client: PoolClient;
    try{   
        client = await connectionPool.connect();
        let results: QueryResult;
       // let foundUser: User;
        await client.query('BEGIN;')//start a transaction
        if (id !== 0){
            results = await client.query(`select sectionid, 
                            classtitle, userid, username,  
                            firstname, lastname, email, roledescription
                            from mathplay_sql.roles natural join mathplay_sql.users natural join mathplay_sql.sections
                            where userid = ${id}`);
        }else{  console.log("doing anything?");  //Not currently using.
            results  = await client.query(`select sectionid,
                            classtitle, userid, username, firstname,
                            lastname, email, roledescription
                            from mathplay_sql.roles natural join mathplay_sql.users natural join mathplay_sql.sections
                            where userid = (select max(userid) from mathplay_sql.users);`);
        }
        
        if(results.rowCount===0){ 
            await client.query('COMMIT;'); //ends transaction
            throw new Error('NotFound');
        }else{
            await client.query('COMMIT;'); //ends transaction
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


//this function is working properly and does just what it says.  the patch function in the router calls it
//only the information that needs to be updated and the id have truthy values sent.  The information 
//that is staying the same has falsey values.
export async function updateUserById(partUser:User){ //id is embedded into the partial user information
    let client: PoolClient;
    let results: QueryResult;  
    try{    
        client = await connectionPool.connect();
        await client.query('BEGIN;')//start a transaction
        //update values for any values that were passed in
        if(partUser.username){  
            await client.query(`update mathplay_sql.users set username=$1 where userid=$2`,
                                            [partUser.username, partUser.userid]);
        }else{
            results = await client.query(`select firstname from mathplay_sql.users where userid = ${partUser.userid}`);
            partUser.username = results.rows.values.toString();
        }
        
        if(partUser.firstname){ 
            await client.query(`update mathplay_sql.users set firstname=$1 where userid=$2`,
                                            [partUser.firstname, partUser.userid]);
        } else {
            results = await client.query(`select firstname from mathplay_sql.users where userid = ${partUser.userid}`);
            partUser.firstname = results.rows.values.toString();
        }
        
        if(partUser.lastname){ 
            await client.query(`update mathplay_sql.users set lastname=$1 where userid=$2`,
                                            [partUser.lastname, partUser.userid]);
        }else{
            results = await client.query(`select lastname from mathplay_sql.users where userid = ${partUser.userid}`);
            partUser.lastname = results.rows.values.toString();
        }
        
        if(partUser.userpassword){ 
            await client.query(`update mathplay_sql.users set userpassword=$1 where userid=$2`,
                                            [partUser.userpassword, partUser.userid]);
        }else{
            results = await client.query(`select userpassword from mathplay_sql.users where userid = ${partUser.userid}`);
            partUser.userpassword = results.rows.values.toString();
        }
     
        if(partUser.email){
            await client.query(`update mathplay_sql.users set email=$1 where userid=$2`,
                                            [partUser.email, partUser.userid]);
        }else{
            results = await client.query(`select email from mathplay_sql.users where userid = ${partUser.userid}`);
            partUser.email = results.rows.values.toString();
        }
        
        if(partUser.roleid){  
            await client.query(`update mathplay_sql.users set roleid=$1 where userid=$2`,
                                            [partUser.roleid, partUser.userid]);
        }else{
            results = await client.query(`select roleid from mathplay_sql.users where userid = ${partUser.userid}`);
            partUser.roleid = +results.rows.values;
        }

        if(partUser.sectionid){  
            await client.query(`update mathplay_sql.users set sectionid=$1 where userid=$2`,
                                            [partUser.sectionid, partUser.userid]);
        }else{
            results = await client.query(`select roleid from mathplay_sql.users where userid = ${partUser.sectionid}`);
            partUser.sectionid = +results.rows.values;
        }

        await client.query('COMMIT;'); //ends transaction
        return partUser;
    }catch(e){
        client && client.query('ROLLBACK;')//if a js error takes place, undo the sql
        //if(e.message === 'Role Not Found'){
            throw new UserInputError2();// role not found error
        //}
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured');
    }finally{
        client && client.release();
    }
}



// This function gets called by the post function in the router.  If userid and roleid are sent, they are ignored.
//Everyone that logs in via the website will have a roleid of 3 (student).  Teachers and teaching-assistants will 
//get their data set up directly in the database.
export async function saveOneUser(newUser:User):Promise<User>{
    let client:PoolClient;
    try{  
        client = await connectionPool.connect();
        await client.query(`insert into mathplay_sql.users ("username", "userpassword", "firstname", "lastname", "email", "roleid", "sectionid")
                                        values($1,$2,$3,$4,$5,$6,$7) returning "userid"; `, //allows you to return some values from the rows in an insert, update or delete
                                        [newUser.username, newUser.userpassword, newUser.firstname, 
                                        newUser.lastname, newUser.email, newUser.roleid, newUser.sectionid]);
        console.log("2nd query to find the new maximum user id");
        console.log(await client.query(`select max(userid) from mathplay_sql.users;`));
        return newUser;

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