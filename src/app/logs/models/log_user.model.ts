import { UserModel } from "../../users/models/user.model";

export interface LogUserModel {
    id: number;
    // user: UserModel;
    matricule: string;
    date_operation: Date;
    type_operation: string; // Create, Update, Delete
    module: string; // Beneficiaire, Cohorte, Banque, Utilisateurs
    title: string; // Titre de l'objet
    observation: string; // Mise en corbeil
}