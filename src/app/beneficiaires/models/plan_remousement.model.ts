import { CohorteModel } from "src/app/cohortes/models/cohorte.model";
import { BeneficiaireModel } from "./beneficiaire.model";
import { BanqueModel } from "src/app/banques/models/banque.model";
import { SecteurModel } from "src/app/secteurs/models/secteur.model";

export interface PlanRemboursementModel {
    id: number;
    cohorte: CohorteModel; 
    banque: BanqueModel;
    beneficiaire: BeneficiaireModel;
    name_beneficiaire: string; // Pour le dialog qui gere ADD/Edit de remboursement
    secteur_activite: SecteurModel;
    date_de_rembousement: Date;
    delai_reajustement: number;
    credit_en_debut_periode: string;
    // mensualite: string;  // somme de interet + capital
    interet: string;
    capital: string; 
    montant_payer: string; 
    observation: string; 
    date_paiement: Date; 
    file_scan: string;
    signature: string;
    created: Date;
    update_created: Date;
}