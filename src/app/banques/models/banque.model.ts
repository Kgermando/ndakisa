import { BeneficiaireModel } from "src/app/beneficiaires/models/beneficiaire.model"; 
import { RemboursementModel } from "src/app/beneficiaires/models/remboursement.model";

export interface BanqueModel {
    id: number;
    name_banque: string;
    beneficiaires: BeneficiaireModel[];
    remboursements: RemboursementModel[];
    signature: string; 
    created: Date; 
    update_created: Date; 
}