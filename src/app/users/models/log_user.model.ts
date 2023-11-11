import { UserModel } from "./user.model";

export interface LogUserModel {
    id: number;
    user: UserModel;
    date_operation: Date;
    type_operation: string; // Create, Update, Delete
    module: string; // Beneficiaire, Cohorte, Banque, Utilisateurs
    title: string; // Titre de l'objet
    observation: string; // Mise en corbeil
    signature: string;
    created: Date;
    update_created: Date;
}