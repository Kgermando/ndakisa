export interface CorbeilModel {
    id: number;
    type: string;  // Beneficiaire, Cohorte, Utilisateurs
    title: string;
    update_created: Date; // Date de update_created
}