export interface CorbeilModel {
    id: number;
    type: string;  // Beneficiaire, Cohorte, Utilisateurs
    title: string;
    date_corbeil: Date; // Date de update_created
}