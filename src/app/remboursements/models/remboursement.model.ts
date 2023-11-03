import { BanqueModel } from "src/app/banques/models/banque.model";
import { BeneficiaireModel } from "src/app/beneficiaires/models/beneficiaire.model";
import { CohorteModel } from "src/app/cohortes/models/cohorte.model";

export interface RemboursementModel {
    id: number;
    cohorte: CohorteModel; 
    banque: BanqueModel;
    beneficiare: BeneficiaireModel;
    montant_payer: string; 
    Observation: string; 
    file_scan: string; 
    signature: string; 
    created: Date; 
    update_created: Date;
}