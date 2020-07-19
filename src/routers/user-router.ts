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
            username:(username?username:""),                //before the colon is like 'username =', 
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



//save a new user, the user them self can sign up for an account
userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    // get input from the user
    let { username, userpassword, firstname, lastname, email, roleid, sectionid } = req.body //destructuring

    //verify the input
    if (username && userpassword && firstname && lastname && roleid && sectionid){
        let newUser:User = { userid:0, username, userpassword, firstname, lastname, email, roleid, sectionid }
        newUser.email = email || null;
        try { //try with a function call to the dao layer to try and save the user
            let savedUser = await saveOneUser(newUser)
            res.json(savedUser)// needs to have the updated userId
        } catch (e) {
            next(e)
        }
    } else  {
        next(new UserInputError);    
    }
})  

//the teacher can access, the teacher-assistant can access if they are assigned to the class,
// the student can access their own
userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => { 
    let { id } = req.params;
    if (isNaN(+id)) {
        next(new UserIdError());
    } else {
        try {
            let user = await findUserById(+id);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }
});


