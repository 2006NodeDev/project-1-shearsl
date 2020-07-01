import { Request, Response, NextFunction } from "express";
import { Role } from "../models/Role";

//making sure user is authorized (a valid L^2 Math employee)
export function authorizationMiddleware(roles:Role[]){
    return (req:Request, res:Response, next:NextFunction) => {
        let allowed = false;
        //map data so we just end up with roleId.  We don't need the role description here.
        let roleIdArray = roles.map(({roleid})=>roleid); 
  
        for(const id of roleIdArray){
            if(!isNaN(+req.param.name) && (+req.param.name === id)){
                allowed = true;
                next();
            }
        }
        if (!allowed){
            res.status(403).send('You have insufficent permissions for this endpoint.');
        }
    }
}

//write a few more authorizations to check for some restricted levels of permission
// after testing the above.