export interface UserModel {
    id: number;
    photo: string;
    nom: string;
    postnom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    sexe: string;
    matricule: string;
    title: string;
    statut_user: boolean;
    roles: string[];
    permission: string;  // Give access to CRUD  [Create, Read, Update, Delete] C R U D
    password: string;
    signature: string; // celui qui fait le document
    created: Date;
    update_created : Date; 
}