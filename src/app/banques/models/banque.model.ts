import { BeneficiaireModel } from "src/app/beneficiaires/models/beneficiaire.model"; 
import { PlanRemboursementModel } from "src/app/beneficiaires/models/plan_remousement.model"; 

export interface BanqueModel {
    id: number;
    name_banque: string;
    statut: boolean;
    beneficiaires: BeneficiaireModel[];
    plan_remboursements: PlanRemboursementModel[];
    signature: string; 
    created: Date; 
    update_created: Date; 
}