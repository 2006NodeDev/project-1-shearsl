import { UserDTO } from "../dtos/user-dto";
import { User } from "../models/User";

export function UserDTOtoUserConvertor( udto:UserDTO):User{
    return {
        userid: udto.userid,
        username: udto.username,
        userpassword: udto.password,
        firstname: udto.firstname,
        lastname: udto.lastname,
        email: udto.email,
        roleid: udto.roleid,
        sectionid: udto.sectionid
    }
}