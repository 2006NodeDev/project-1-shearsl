import e, { Request, Response, NextFunction } from 'express';
//import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserIdError } from '../errors/UserIdError';
import { UserInputError, UserInputError2 } from '../errors/UserInputError';
import { User } from '../models/User'
import { getAllUsers, findUserById, saveOneUser, updateUserById } from '../daos/user-daos';
//import { authorizationMiddleware } from '../middleware/authorization-middleware';
//import { PoolClient } from 'pg';
//import { User } from '../models/User';

export let userRouter = e.Router();  //router already has the path '/users'


userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await getAllUsers(); //function in users-daos
        res.json(users);
    } catch (e) {
        next(e);
    }
});  

//update a user selected by id
userRouter.patch('/', async(req:Request, res:Response, next:NextFunction) =>{
    let { userid, username, userpassword, firstname, lastname, email, roleid } = req.body //destructuring
    if ((username || userpassword || firstname || lastname || email || roleid) && userid){
        if (isNaN(+userid)) {
            next(new UserIdError());
        }
        let partialUser:User = { 
            userid: +userid, 
            username:(username?username:""), 
            userpassword:(userpassword?userpassword:""), 
            firstname:(firstname?firstname:""), 
            lastname:(lastname?lastname:""), 
            email:(email?email:""), 
            roleid:(roleid?roleid:0) 
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



//save a new user
userRouter.post('/', /*authorizationMiddleware(['Admin']),*/ async (req: Request, res: Response, next: NextFunction) => {
    // get input from the user
    let { username, userpassword, firstname, lastname, email, roleid } = req.body //destructuring

    //verify the input
    if (username && userpassword && firstname && lastname && roleid){
        let newUser:User = { userid:0, username, userpassword, firstname, lastname, email, roleid }
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


