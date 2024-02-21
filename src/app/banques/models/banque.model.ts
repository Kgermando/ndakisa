import { BeneficiaireModel } from "src/app/beneficiaires/models/beneficiaire.model"; 
import { PlanRemboursementModel } from "src/app/beneficiaires/models/plan_remousement.model"; 
import { BanqueCohorteModel } from "./banque-cohorte.model";

export interface BanqueModel {
    id: number;
    name_banque: string;
    statut: boolean;
    beneficiaires: BeneficiaireModel[];
    plan_remboursements: PlanRemboursementModel[];
    banque_cohortes: BanqueCohorteModel[];
    signature: string; 
    created: Date; 
    update_created: Date; 
}