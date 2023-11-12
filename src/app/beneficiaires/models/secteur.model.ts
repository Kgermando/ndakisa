import { BeneficiaireModel } from "./beneficiaire.model";

export interface SecteurModel {
    id: number;
    name_secteur: string;
    beneficiaires: BeneficiaireModel[];
    signature: string;
    created: Date;
    update_created: Date;
}