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
 
  progressionRemboursementParSexeList: any[] = [];

  remboursementsInterrompusList: any[] = [];
  remboursementInterrompus = 0;
  remboursementInterrompuPourcent = 0;

  totalOuverte = 0;
  totalFermee = 0;

  constructor(
    public themeService: CustomizerSettingsService,
    private _formBuilder: FormBuilder,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void { 
    const date = new Date();
    const yestday = new Date(date);
    const tomorrow = new Date(date);
    yestday.setDate(date.getDate()-29);
    tomorrow.setDate(date.getDate()+1);

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
 
    this.dateRange = this._formBuilder.group({
      start: new FormControl(firstDay),
      end: new FormControl(tomorrow),
    });
 
    this.start_date = formatDate(this.dateRange.value.start, 'yyyy-MM-dd', 'en-US');
    this.end_date = formatDate(this.dateRange.value.end, 'yyyy-MM-dd', 'en-US');

    if (this.start_date && this.end_date) {
      this.getTotal();
      this.getStatsBanque(); 
      this.getStatsBeneficiaireStatut();
      this.getStatsCohorteStatut();
      this.getStatsBeneficiaireParCohorte();
      this.getStatsGurantieRemboursement();
      this.getStatsNombre();
      this.getStatsProgress();
      this.getStatsSecteurActitivte();
      this.getStatsAge();
      this.getStatsSexe();
      this.remboursementsInterrompus();
      this.remboursementsInterrompuPourcent();
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

      this.getStatsBeneficiaireParCohorte();

      this.getStatsGurantieRemboursement();

      this.getStatsNombre();

      this.getStatsProgress();

      this.getStatsSecteurActitivte();

      this.getStatsAge();

      this.getStatsSexe();

      this.remboursementsInterrompus();

      this.remboursementsInterrompuPourcent();
    });
  }


  getTotal() {
    this.dashboardService.totalBeneficiaire().subscribe(
      res =>  {
        this.totalBeneficiaireList = res;
        this.totalBeneficiaireList.map((item: any) => this.totalBeneficiaire = parseFloat(item.total));
      }
    );
    this.dashboardService.totalCohorte().subscribe(
      res =>  {
        this.totalCohorteList = res;
        this.totalCohorteList.map((item: any) => this.totalCohorte = parseFloat(item.total));
      }
    );
    this.dashboardService.totalBanque().subscribe(
      res =>  {
        this.totalBanqueList = res;
        this.totalBanqueList.map((item: any) => this.totalBanque = parseFloat(item.total));
      }
    );

    this.dashboardService.tauxParticipatiionProvince().subscribe(
      res => {
        this.tauxParticipatiionProvinceList = res; 
      }
    ); 
  }

  getStatsSexe() { 
    this.isLoading = true;
    this.dashboardService.sexe().subscribe(
      res => {
        this.sexeList = res;
        this.isLoading = false;
      }
    );
  }

  getStatsAge() {
    this.dashboardService.tranchAgeBeneficiaires().subscribe(
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
    this.dashboardService.totalGarantie().subscribe(
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
    this.dashboardService.statutBeneficiaires().subscribe(
      res => {
        this.statutBeneficiaireList = res;
        this.isLoading = false;
      }
    )
  }

  getStatsCohorteStatut() {
    this.dashboardService.statutCohorte().subscribe(
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

  getStatsBeneficiaireParCohorte() { 
    this.dashboardService.beneficiaireParCohorte().subscribe(
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
    this.dashboardService.progressionRemboursementParSexe(this.start_date, this.end_date).subscribe(res => {
      this.progressionRemboursementParSexeList = res;
      console.log("ParSexeList", this.progressionRemboursementParSexeList)
    });
  }

  getStatsSecteurActitivte() { 
    this.dashboardService.secteurActivite().subscribe(
      res => {
        this.secteurActiviteList = res;
      }
    )
  }

  remboursementsInterrompus() {
    this.dashboardService.remboursementsInterrompus(this.start_date, this.end_date).subscribe(
      res => {
        this.remboursementsInterrompusList = res;
        this.remboursementInterrompus = this.remboursementsInterrompusList[0].reste_interrompu;
      }
    )
  }


  remboursementsInterrompuPourcent() { 
    this.dashboardService.remboursementsInterrompuPourcent(this.start_date, this.end_date).subscribe(
      res => {
        var remboursementInterrompuPourcentList = res;
        this.remboursementInterrompuPourcent = remboursementInterrompuPourcentList[0].pourcent_interrompu;
      }
    )
  }
  













  onSubmit() {
    // var dateNow = new Date();
    // var dateNowFormat = formatDate(dateNow, 'dd-MM-yyyy_HH:mm', 'en-US');
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
