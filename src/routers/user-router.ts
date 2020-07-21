import e, { Request, Response, NextFunction } from 'express';
//import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserIdError } from '../errors/UserIdError';
import { UserInputError, UserInputError2 } from '../errors/UserInputError';
import { User } from '../models/User'
import { getClassLists, findUserById, saveOneUser, updateUserById } from '../daos/user-dao';
//import { authorizationMiddleware } from '../middleware/authorization-middleware';
//import { PoolClient } from 'pg';

export let userRouter = e.Router();  //router already has the path '/users'

//only a teacher can get all users, a teacher assistant can get all users in the class they are assigned to
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {       
        let users = await getClassLists(); //function in users-dao
        res.json(users);
    } catch (e) {
        next(e);
    }
});  

//update a user selected by id only teachers should be able to do this
userRouter.patch('/', async(req:Request, res:Response, next:NextFunction) =>{
    let { userid, username, userpassword, firstname, lastname, email, roleid, sectionid } = req.body //destructuring
    if ((username || userpassword || firstname || lastname || email || roleid || sectionid) && userid){
        if (isNaN(+userid)){
            next(new UserIdError());
        }
        let partialUser:User = { 
            userid: +userid, 
            username:(username?username:""),                //before the colon is like 'username =' since this is a key:value pair, 
            userpassword:(userpassword?userpassword:""),    //(if truthy, then username else "")
            firstname:(firstname?firstname:""),             //having else "" or else 0 causes a falsey value 
            lastname:(lastname?lastname:""),                //which just means that that particular field will 
            email:(email?email:""),                         //not be updated.  At least one of these must have a 
            roleid:(roleid?roleid:0),                       //truthy value or we wouldn't be in this if statement.
            sectionid:(sectionid?sectionid:0)
        }
        try { 
            await updateUserById(partialUser);
            let userUpdated = await findUserById(userid);
            res.json(userUpdated);
        } catch (e) {
            next(e);
        }
    } else {
        next(new UserInputError2); 
    }
});



//save a new user, the user can sign up for an account with roleid 3 for student
//teachers and teaching assistants are entered directly into the database by an administrator
//I wanted to also call the findUserById(0) to try can call the user that was just created to I could make 
// it display with the proper user id
userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    // get input from the user
    let { username, userpassword, firstname, lastname, email, sectionid } = req.body //destructuring

    //verify the input
    if (username && userpassword && firstname && lastname && email && sectionid){
        let newUser:User = { userid:0, username, userpassword, firstname, lastname, email, roleid:3, sectionid }
        try { //try with a function call to the dao layer to try and save the user
            let savedUser = await saveOneUser(newUser);  //function in user-dao
            res.json(savedUser)// needs to have the updated 'userid'
           // console.log(savedUser.userid);
           //savedUser = await findUserById(0);
        } catch (e) {
            next(e)
        }
    } else  {
        next(new UserInputError);    
    }
})  

//the teacher can access, the teacher-assistant can access if they are assigned to the class,
// the student can access their own
userRouter.get('/:userid', async (req: Request, res: Response, next: NextFunction) => { 
    let { userid } = req.params;
    if (isNaN(+userid)) {
        next(new UserIdError());
    } else {
        try {
            let user = await findUserById(+userid);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }
});


