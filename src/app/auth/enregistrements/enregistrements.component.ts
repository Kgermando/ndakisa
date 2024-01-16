import { Component, OnInit } from '@angular/core'; 
import { AuthService } from 'src/app/auth/auth.service'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; 
import { RoleSupportDataList } from 'src/app/shared/tools/role-list';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enregistrements',
  templateUrl: './enregistrements.component.html',
  styleUrls: ['./enregistrements.component.scss']
})
export class EnregistrementsComponent implements OnInit {

  isLoading: boolean = false; 
  formGroup!: FormGroup; 

 
  sexeList: string[] = [
    'Femme', 'Homme'
  ];
  
  roleList: string[] = RoleSupportDataList; 


  constructor( public themeService: CustomizerSettingsService, 
    private _formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService) {}



  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      nom: ['Admin', Validators.required],
      postnom: ['Admin', Validators.required],
      prenom: ['Admin', Validators.required],
      email: ['admin@fogec.cd'],
      telephone: ['+243 00 000 00 00', Validators.required],
      sexe: ['Homme', Validators.required],
      adresse: ['-', Validators.required],
    });
  }
  
  
  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var val = Math.floor(1000 + Math.random() * 9000);
        var body = {
          photo: '-',
          nom: this.formGroup.value.nom,
          postnom: this.formGroup.value.postnom,
          prenom: this.formGroup.value.prenom,
          email: this.formGroup.value.email,
          telephone: this.formGroup.value.telephone,
          sexe: this.formGroup.value.sexe,
          adresse: this.formGroup.value.adresse,
          matricule: `admin-${val}`.toLowerCase(),
          roles: this.roleList,
          permission: 'CRUD',
          signature: '-',
          created: new Date(),
          update_created: new Date(),
          password: '1234',
          password_confirm: '1234'
        };
        this.authService.register(body).subscribe({
          next: () => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/layouts/auth/login']);
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      }
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  } 

}

