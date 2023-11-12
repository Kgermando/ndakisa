import { BeneficiaireModel } from "../../beneficiaires/models/beneficiaire.model";

export interface SecteurModel {
    id: number;
    name_secteur: string;
    statut: boolean;
    beneficiaires: BeneficiaireModel[];
    signature: string;
    created: Date;
    update_created: Date;
}