//The Role model is used to track what permissions a user has
export class Role{
  roleid: number; // primary key
  role: string; // not null, unique
}
//there are only 3 roles: 1:teacher, 2:teaching-assistant, 3:student

