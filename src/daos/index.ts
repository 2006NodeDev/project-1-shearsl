import { Pool } from 'pg';

export const connectionPool:Pool = new Pool({
    host:process.env['RevL^2_DB'], // the public ip address of your sql instance
    user:process.env['RevL2_USER'], //user on your database ( probably postgres)
    password:process.env['RevL^2password'],
    database:process['RevL^2_DB'], //name of database
    port: 5432, // the database's port
    max: 8 //maximum number of connections
})