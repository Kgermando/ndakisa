import { BanqueModel } from "src/app/banques/models/banque.model";
import { CohorteModel } from "src/app/cohortes/models/cohorte.model";
import { RemboursementModel } from "src/app/remboursements/models/remboursement.model";

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
    secteur_activite: string; 
    numero_impot: string; 
    id_nat: string;
    rccm: string; 
    adresse: string; 
    
    montant_garantie: string; 
    credit_accorde: string; 
    interet: string; 
    montant_a_debourser: string; 

    delai_de_grace: Date;
    delai_de_reajustement: Date;
    duree_credit: number; // La durée de validité que le beneficiaire devra payé 
    date_valeur: Date; // Date à la quel on donné le credit 
    date_maturite: Date; // Date du dernier remboursement donc écheance  
    date_de_rembousement: Date; // Date de remboursement à la banque doit etre ajustable 
    cohorte: CohorteModel; 
    banque: BanqueModel; 
    statut: string; // En cours // Terminer
    remboursements: RemboursementModel[];
}