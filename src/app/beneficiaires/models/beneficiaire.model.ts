import { BanqueModel } from "src/app/banques/models/banque.model";
import { CohorteModel } from "src/app/cohortes/models/cohorte.model"; 
import { PlanRemboursementModel } from "./plan_remousement.model"; 
import { SecteurModel } from "../../secteurs/models/secteur.model";

export interface BeneficiaireModel {
    id: number;
    photo: string;
    name_beneficiaire: string; 
    sexe: string; 
    date_naissance: Date; 
    province: string; 
    identifiant: string; 
    email: string; 
    telephone: string; 
    raison_sociale: string; 
    secteur_activite: SecteurModel; 
    numero_impot: string; 
    id_nat: string;
    rccm: string;
    compte_bancaire: string;
    adresse: string;
    
    montant_garantie: string; 
    credit_accorde: string;
    interet: string;
    montant_a_debourser: string; // Montant à rembourser c'est le montant que les beneficieres doivent rembourser donc credit + interet

    delai_de_grace: number;
    duree_credit: number; // La durée de validité que le beneficiaire devra payé 
    date_valeur: Date; // Date à la quel on donné le credit 
    date_maturite: Date; // Date du dernier remboursement donc écheance  
    
    cohorte: CohorteModel;
    banque: BanqueModel; 
    statut: string; // En cours, Interrompu, Complete 
    plan_remboursements: PlanRemboursementModel[];
    
}