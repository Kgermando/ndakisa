import { PlanRemboursementModel } from "src/app/beneficiaires/models/plan_remousement.model";
import { BeneficiaireModel } from "../../beneficiaires/models/beneficiaire.model";

export interface SecteurModel {
    id: number;
    name_secteur: string;
    statut: boolean;
    beneficiaires: BeneficiaireModel[];
    plan_remboursements: PlanRemboursementModel[];
    signature: string;
    created: Date;
    update_created: Date;
}