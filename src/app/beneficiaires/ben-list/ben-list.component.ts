import { Component } from '@angular/core';
import { CohorteExportXLSXDialogBox } from 'src/app/cohortes/cohorte-list/cohorte-list.component';
import { RemboursementUploadCSVDialogBox } from '../beneficiare-list/beneficiare-list.component';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ben-list',
  templateUrl: './ben-list.component.html',
  styleUrls: ['./ben-list.component.scss']
})
export class BenListComponent {

  banque: string;

  constructor( 
    public themeService: CustomizerSettingsService, 
    private dialog: MatDialog
  ) {}


  onChange(event: any) {
    this.banque = event.value;
  }


  openExportDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CohorteExportXLSXDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  }

  UploadDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(RemboursementUploadCSVDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
      // data: {
      //   banque: this.banque
      // }
    }); 
  }


  downloadExcel() {
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = '/assets/excel/model_de_remboursement.xlsx';
    link.download = 'model_de_remboursement.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }



  toggleTheme() {
    this.themeService.toggleTheme();
  }


}
