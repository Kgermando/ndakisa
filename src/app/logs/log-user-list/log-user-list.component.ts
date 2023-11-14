import { Component, OnInit } from '@angular/core';
import { LogUserModel } from '../models/log_user.model';
import { LogUserService } from 'src/app/users/log-user.service';

@Component({
  selector: 'app-log-user-list',
  templateUrl: './log-user-list.component.html',
  styleUrls: ['./log-user-list.component.scss']
})
export class LogUserListComponent implements OnInit {
  isLoading: boolean = false;
  logUserList: LogUserModel[] = [];

  constructor(private logService: LogUserService) {}


  ngOnInit(): void {
    this.isLoading = true;
    this.logService.getAll().subscribe(res => {
      this.logUserList = res;
      this.isLoading = false;
    });
  }

}
