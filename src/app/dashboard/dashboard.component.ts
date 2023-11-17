import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomizerSettingsService } from '../common/customizer-settings/customizer-settings.service';
import { DashboardService } from './dashboard.service';
import { formatDate } from '@angular/common'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dateRange!: FormGroup;
  start_date: string;
  end_date: string; 

  isLoading = false;

  totalBeneficiaireList: any[] = [];
  totalBeneficiaire = 0;
  totalCohorteList: any[] = [];
  totalCohorte = 0;
  totalBanqueList: any[] = [];
  totalBanque = 0;

  tauxParticipatiionProvinceList:any[] = []; 

  sexeList: any = [];
  trancheAgeList: any[] = [];
  banqueList: any = [];

  totalGarantieList: any[] = [];
  totalGarantie = 0;
  totalCreditAccordeList: any[] = [];
  totalCreditAccorde = 0;
  totalARembourserList: any[] = [];
  totalARembourser = 0;
  totalRembourseList: any[] = [];
  totalRembourse = 0;
  resteARembourserList: any[] = [];
  resteARembourser = 0;

  statutBeneficiaireList:any[] = []; 
  remboursementList:any[] = [];
  statutCohorteList: any[] = [];
  secteurActiviteList:any[] = [];
  cohorteList: any = [];

  progressionRemboursementHommeList: any[] = [];
  progressionRemboursementFemmeList: any[] = [];
  progressionRemboursementDateList: any[] = [];

  totalOuverte = 0;
  totalFermee = 0;

  constructor(
    public themeService: CustomizerSettingsService,
    private _formBuilder: FormBuilder,
    private dashboardService: DashboardService
  ) {}


  ngOnInit(): void { 
    var date = new Date();
    var tomorrow = new Date(date);
    tomorrow.setDate(date.getDate()+1);
    // tomorrow.toLocaleDateString();
 
    this.dateRange = this._formBuilder.group({
      start: new FormControl(new Date('2023-10-20')),
      end: new FormControl(tomorrow),
    });
 
    this.start_date = formatDate(this.dateRange.value.start, 'yyyy-MM-dd', 'en-US');
    this.end_date = formatDate(this.dateRange.value.end, 'yyyy-MM-dd', 'en-US');

    if (this.start_date && this.end_date) {
      this.getTotal();
      this.getStatsBanque(); 
      this.getStatsBeneficiaireStatut();
      this.getStatsCohorteStatut();
      this.getStatsCohorteRemboursement();
      this.getStatsGurantieRemboursement();
      this.getStatsNombre();
      this.getStatsProgress();
      this.getStatsSecteurActitivte();
      this.getStatsAge();
      this.getStatsSexe();
    }

    console.log('start_date 0', this.start_date);
    console.log('end_date 0', this.end_date);

    this.onChanges();
  }

  onChanges(): void {
    this.dateRange.valueChanges.subscribe(val => {
      this.start_date = formatDate(val.start, 'yyyy-MM-dd', 'en-US');
      this.end_date = formatDate(val.end, 'yyyy-MM-dd', 'en-US');

      console.log('start_date 1', this.start_date);
      console.log('end_date 1', this.end_date);

      
      this.getTotal();

      this.getStatsBanque(); 

      this.getStatsBeneficiaireStatut();

      this.getStatsCohorteStatut();

      this.getStatsCohorteRemboursement();

      this.getStatsGurantieRemboursement();

      this.getStatsNombre();

      this.getStatsProgress();

      this.getStatsSecteurActitivte();

      this.getStatsAge();

      this.getStatsSexe();
    });
  }


  getTotal() {
    this.dashboardService.totalBeneficiaire(this.start_date, this.end_date).subscribe(
      res =>  {
        this.totalBeneficiaireList = res;
        this.totalBeneficiaireList.map((item: any) => this.totalBeneficiaire = parseFloat(item.total));
      }
    );
    this.dashboardService.totalCohorte(this.start_date, this.end_date).subscribe(
      res =>  {
        this.totalCohorteList = res;
        this.totalCohorteList.map((item: any) => this.totalCohorte = parseFloat(item.total));
      }
    );
    this.dashboardService.totalBanque(this.start_date, this.end_date).subscribe(
      res =>  {
        this.totalBanqueList = res;
        this.totalBanqueList.map((item: any) => this.totalBanque = parseFloat(item.total));
      }
    );

    this.dashboardService.tauxParticipatiionProvince(this.start_date, this.end_date).subscribe(
      res => {
        this.tauxParticipatiionProvinceList = res; 
      }
    ); 
  }

  getStatsSexe() { 
    this.isLoading = true;
    this.dashboardService.sexe(this.start_date, this.end_date).subscribe(
      res => {
        this.sexeList = res;
        this.isLoading = false;
      }
    );
  }

  getStatsAge() {
    this.dashboardService.ageBeneficiaires(this.start_date, this.end_date).subscribe(
      res => {
        this.trancheAgeList = res;
        this.isLoading = false;
      }
    )
  }

  getStatsBanque() { 
    this.dashboardService.participationParBanque(this.start_date, this.end_date).subscribe(
      res => {
        this.banqueList = res;
        this.isLoading = false;
      }
    )
  }

  getStatsNombre() { 
    this.dashboardService.totalGarantie(this.start_date, this.end_date).subscribe(
      res =>  {
        this.totalGarantieList = res;
        this.totalGarantieList.map((item: any) => this.totalGarantie = parseFloat(item.montant_garantie));
      }
    );
    this.dashboardService.totalCreditAccorde(this.start_date, this.end_date).subscribe(
      res =>  {
        this.totalCreditAccordeList = res;
        this.totalCreditAccordeList.map((item: any) => this.totalCreditAccorde = parseFloat(item.credit_accorde));
      }
    );
    this.dashboardService.totalARembourser(this.start_date, this.end_date).subscribe(
      res =>  {
        this.totalARembourserList = res;
        this.totalARembourserList.map((item: any) => this.totalARembourser = parseFloat(item.montant_a_rembourser));
      }
    );
    this.dashboardService.totalRembourse(this.start_date, this.end_date).subscribe(
      res =>  {
        this.totalRembourseList = res;
        this.totalRembourseList.map((item: any) => this.totalRembourse = parseFloat(item.montant_payer));
      }
     );
    this.dashboardService.resteARembourse(this.start_date, this.end_date).subscribe(
      res =>  {
        this.resteARembourserList = res;
        this.resteARembourserList.map((item: any) => this.resteARembourser = parseFloat(item.reste_a_rembourser));
      }
    );
  } 
  getStatsBeneficiaireStatut() { 
    this.dashboardService.statutBeneficiaires(this.start_date, this.end_date).subscribe(
      res => {
        this.statutBeneficiaireList = res;
        this.isLoading = false;
      }
    )
  }

  getStatsCohorteStatut() {
    this.dashboardService.statutCohorte(this.start_date, this.end_date).subscribe(
      res => {
        this.statutCohorteList = res;
        for(let item of this.statutCohorteList) {
          if (item.statut == 'Ouverte') {
            this.totalOuverte = item.count;
          } else if (item.statut == 'Fermée') {
            this.totalFermee = item.count;
          }
        }
        this.isLoading = false;
      }
    );
  }

  getStatsCohorteRemboursement() { 
    this.dashboardService.remboursementCohorte(this.start_date, this.end_date).subscribe(
      res => {
          this.cohorteList = res;
          this.isLoading = false;
      }
    );
  }

  getStatsGurantieRemboursement() { 
    this.dashboardService.remboursementTotalEtReste(this.start_date, this.end_date).subscribe(
      res => {
        this.remboursementList = res;
        this.isLoading = false;
      }
    )
  }

  getStatsProgress() { 
    this.dashboardService.progressionRemboursementSexeDate(this.start_date, this.end_date).subscribe(
      res => {
          this.dashboardService.progressionRemboursementSexeHomme(this.start_date, this.end_date).subscribe(
              h => {
                  this.dashboardService.progressionRemboursementSexeFemme(this.start_date, this.end_date).subscribe(
                      f => {
                        this.progressionRemboursementDateList = res;
                        this.progressionRemboursementHommeList = h;
                        this.progressionRemboursementFemmeList = f;
                        this.isLoading = false; 
                      } 
                  );
              } 
          ); 
      }
      
  );
  }

  getStatsSecteurActitivte() { 
    this.dashboardService.secteurActivite(this.start_date, this.end_date).subscribe(
      res => {
        this.secteurActiviteList = res;
      }
    )
  }



  













  onSubmit() {
    var dateNow = new Date();
    var dateNowFormat = formatDate(dateNow, 'dd-MM-yyyy_HH:mm', 'en-US');
    this.start_date = formatDate(this.dateRange.value.start, 'yyyy-MM-dd', 'en-US');
    this.end_date = formatDate(this.dateRange.value.end, 'yyyy-MM-dd', 'en-US');
  } 
 

  toggleTheme() {
      this.themeService.toggleTheme();
  }

  toggleCardBorderTheme() {
      this.themeService.toggleCardBorderTheme();
  }

  toggleCardBorderRadiusTheme() {
      this.themeService.toggleCardBorderRadiusTheme();
  }
}
