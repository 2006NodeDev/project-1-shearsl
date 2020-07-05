//import {Role} from "./Role";


//The User model keeps track of users information.
export class User {
  	userid: number = 0; // primary key
	username: string; // not null, unique
	userpassword: string; // not null
	firstname: string; // not null
	lastname: string; // not null
	email: string; // not null
	roleid:number;
	//role: Role[]; // not null
}