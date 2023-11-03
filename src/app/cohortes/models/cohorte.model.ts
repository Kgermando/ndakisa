import { BeneficiaireModel } from "src/app/beneficiaires/models/beneficiaire.model";
import { RemboursementModel } from "src/app/remboursements/models/remboursement.model";

export interface CohorteModel {
    id: number;
    name_cohorte: string;
    contrat_ref: string; 
    statut: string; // Ouvert et cloturer 
    montant_global: string; 
    beneficiaires: BeneficiaireModel[];
    remboursements: RemboursementModel[];
    signature: string; 
    created: Date; 
    update_created: Date; 
}