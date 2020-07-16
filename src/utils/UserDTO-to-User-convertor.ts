import { UserDTO } from "../dtos/user-dto";
import { User } from "../models/User";
//import { Role } from "../models/Role";

export function UserDTOtoUserConvertor( udto:UserDTO):User{
   /* let roles:Role[] = [];
    for (const r in udto.roleid){
        roles {roleid:r.roleid; role:r.role}
    }  */
    //let jobrole = [{roleid: udto.role}, {role:}] 
    //jobrole = {roleid: udto.roleid, role: udto.role}; //Role[] = { roleid:udto.role., udto.role }
    return {
        userid: udto.userid,
        username: udto.username,
        userpassword: udto.password,
        firstname: udto.firstname,
        lastname: udto.lastname,
        email: udto.email,
        roleid: udto.roleid,
        //role: udto.role[1]
    }
}