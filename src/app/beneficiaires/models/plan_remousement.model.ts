import { BeneficiaireModel } from "./beneficiaire.model";

export interface PlanRemboursementModel {
    id: number;
    beneficiaire: BeneficiaireModel;
    date_de_rembousement: Date;
    credit_en_debut_periode: string;
    mensualite: string;
    interet: string;
    capital: string;
    signature: string;
    created: Date;
    update_created: Date;
}