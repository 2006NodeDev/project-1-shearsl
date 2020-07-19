import { getAllSections } from "../daos/section-dao";
import e, { Request, Response, NextFunction } from "express";

export let sectionRouter = e.Router();  //router already has the path '/users'
//anyone can list all of the sections
sectionRouter.get('/:secid', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await getAllSections(); //function in section-dao
        res.json(users);
    } catch (e) {
        next(e);
    }
});  
