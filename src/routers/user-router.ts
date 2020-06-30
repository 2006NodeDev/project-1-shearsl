import e, { Request, Response, NextFunction } from 'express';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserIdError } from '../errors/UserIdError';
import { UserInputError } from '../errors/UserInputError';
//import { User } from '../models/User'
import { getAllUsers } from '../daos/user-daos';

export let userRouter = e.Router();  //router already has the path '/users'


userRouter.get('/', async (req:Request, res:Response, next: NextFunction)=>{
    //try catch is handled by express in a pr
    let users = await getAllUsers();
    res.json(users);
});

userRouter.post('/', (req:Request, res:Response)=>{
     console.log(req.body);
     let {userId, username, password, firstName, lastName, email, role} = req.body //destructuring
     if(userId && username && password && firstName && lastName && email && role){
         //users.push({userId, username, password, firstName, lastName, email, role});
         res.sendStatus(201)
     }else{
         //res.status(400).send("Please enter all required information.");
         throw new UserInputError();
     }
});


userRouter.get('/:id', async (req:Request, res:Response, next:NextFunction)=>{
    let {id}=req.params;
    if (isNaN(+id)){
        next(new UserIdError());
    }else{
        try {
           let user = await finduserById(+id);
           res.json(user); 
        }
       
        if (!found) {
            throw new UserNotFoundError();
        }
    }
});


