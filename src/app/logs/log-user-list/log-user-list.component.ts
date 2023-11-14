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

  lastPage: number;

  constructor(private logService: LogUserService) {}

  ngOnInit(): void {
    this.load();
  }

  load(page = 1): void {
    this.isLoading = true;
    this.logService.all(page).subscribe(res => {
        this.logUserList = res.data;
        this.lastPage = res.meta.last_page;
        this.isLoading = false;
        // load image
        // this.products.map(product => {
        //   if (!product.image.startsWith("http")) // if it's not an image link from the internet, it was an uploaded image
        //     product.image = `${environment.api}/uploads/${product.image}`;
        // });
      }
    );
  }

}
