import e, { Request, Response, NextFunction } from 'express';
//import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserIdError } from '../errors/UserIdError';
import { UserInputError } from '../errors/UserInputError';
//import { User } from '../models/User'
import { getAllUsers, findUserById } from '../daos/user-daos';
import { PoolClient } from 'pg';

export let userRouter = e.Router();  //router already has the path '/users'


userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await getAllUsers(); //function in users-daos
        res.json(users);
    } catch (e) {
        next(e);
    }
});  


userRouter.post('/', (req: Request, res: Response) => {
    console.log(req.body);
    let client:PoolClient;
    let insertStr:string;
    let { username, password, firstname, lastname, email, roleid } = req.body //destructuring
    if (username && password && firstname && lastname && email && roleid) {
        insertStr = `insert into users (userName, userPassword, firstName, lastName, email, roleId)
                 values (${username}, ${password}, ${firstname}, ${lastname}, ${email}, ${roleid})`;
        client.query(insertStr, (req, res)=>{});  //code similar to code found at:
        res.sendStatus(201);                      // https://kb.objectrocket.com/postgresql/how-to-use-nodejs-to-insert-into-a-postgresql-table-958
    } else {
        //res.status(400).send("Please enter all required information.");
        throw new UserInputError();
    }
});  


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


