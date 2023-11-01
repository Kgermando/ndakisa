import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { RoleDataList } from 'src/app/shared/tools/role-list';
import { permissionDataList } from 'src/app/shared/tools/permission-list';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any; 

 
  sexeList: string[] = [
    'Femme', 'Homme'
  ]; 

  roleList: string[] = RoleDataList;
  permissionList = permissionDataList;

  constructor(private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService, 
    private userService: UserService, 
    private toastr: ToastrService) {}



  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

    this.formGroup = this._formBuilder.group({
      nom: ['', Validators.required],
      postnom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', Validators.required],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      sexe: ['', Validators.required],
      matricule: ['', Validators.required],  
      title: ['', Validators.required], 
      statut_user: ['', Validators.required],
      roles: ['', Validators.required],
      permission: ['', Validators.required],
    });
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          nom: this.capitalizeTest(this.formGroup.value.nom),
          postnom: this.capitalizeTest(this.formGroup.value.postnom),
          prenom: this.capitalizeTest(this.formGroup.value.prenom),
          email: this.formGroup.value.email,
          telephone: this.formGroup.value.telephone,
          adresse: this.formGroup.value.adresse, 
          sexe: this.formGroup.value.sexe,
          matricule: this.formGroup.value.matricule.toLowerCase(), 
          title: this.capitalizeTest(this.formGroup.value.title),
          statut_user: this.formGroup.value.statut_user,
          roles: this.formGroup.value.roles,
          permission: this.formGroup.value.permission,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
        };
        this.userService.create(body).subscribe({
          next: () => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/layouts/users/user-list']);
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


  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }


}
