import { PoolClient } from "pg";
import { connectionPool } from ".";

export async function getAllSections(){
    let client:PoolClient;
    try{
        client = await connectionPool.connect();
    }
    finally{
        
    }
}