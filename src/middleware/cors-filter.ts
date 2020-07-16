import { Request, Response, NextFunction } from "express";

export function corsFilter(req:Request, res:Response, next:NextFunction){
    //must set access control allow origin header for every request
    res.header('Access-Control-Allow-Origin','*');//bad because we allow any origin to send requests
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    res.header('Access-Control-Allow-Creditionals', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    if(req.method === 'OPTIONS'){
        res.sendStatus(200);
    }else{
        next();
    }
}