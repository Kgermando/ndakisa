import { CohorteModel } from "src/app/cohortes/models/cohorte.model";
import { BanqueModel } from "./banque.model";

export interface BanqueCohorteModel {
    id: number; 
    banque: BanqueModel;  
    cohorte: CohorteModel; 
    montant_garantie: string;
    signature: string; 
    created: Date; 
    update_created: Date; 
}

export interface BanqueCohorteGarantieModel {
    id: number; 
    name_cohorte: string;  
    statut_cohorte: string;
    montant_garantie: string;
    signature: string; 
    created: Date; 
    update_created: Date; 
}