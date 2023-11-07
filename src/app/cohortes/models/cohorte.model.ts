import { BeneficiaireModel } from "src/app/beneficiaires/models/beneficiaire.model"; 
import { PlanRemboursementModel } from "src/app/beneficiaires/models/plan_remousement.model"; 

export interface CohorteModel {
    id: number;
    name_cohorte: string;
    contrat_ref: string; 
    statut: string; // Ouvert et cloturer 
    // montant_global: string; 
    beneficiaires: BeneficiaireModel[];
    plan_remboursements: PlanRemboursementModel[];
    signature: string; 
    created: Date; 
    update_created: Date; 
}