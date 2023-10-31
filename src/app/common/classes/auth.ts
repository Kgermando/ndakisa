import { EventEmitter } from "@angular/core";  
import { UserModel } from "src/app/users/models/user.model";

export class Auth {
    static userEmitter = new EventEmitter<UserModel>();
}