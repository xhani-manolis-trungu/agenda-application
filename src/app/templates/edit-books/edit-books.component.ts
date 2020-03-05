import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ApiService} from '../../services/api.service';
import {ActivatedRoute} from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-edit-books',
  templateUrl: './edit-books.component.html',
  styleUrls: ['./edit-books.component.css']
})
export class EditBooksComponent implements OnInit {
  id: any;
  public model:any = {}
  constructor(
    private _apiService:ApiService,
    private notifyService: NotificationService,
    private router:Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    console.log("FE: edit-books.component.ts - call _apiService.bookDetail/id", this.id);
    this._apiService.bookDetail(this.id).subscribe(
      data => {
        this.model = data['books']['0'];
      },
      error => {
        if(error.status = 401){
          this.notifyService.showError("Token Expired!", "Error");
          this.router.navigate(['/login']);
        }
      }
    )
  }

  updateBook(){
    this._apiService.editBook(this.id, this.model).subscribe(
      data => {
        this.notifyService.showSuccess(data['message'], "Success");
        this.router.navigate(['/books']);
      },
      error => {
        console.log(error.error.error.path);
        if(error.error.error.code){
          this.notifyService.showError("Book with this name already exist!", "Error");
        } else if (error.error.error.path == 'price') {
          this.notifyService.showError("Price should only be in numbers", "Error");
        } else if (error.error.error.path == 'isbn'){
          this.notifyService.showError("ISBN should only be in numbers", "Error");
        } else {
          this.notifyService.showError("Auth Error", "Error");
          this.router.navigate(['/login']);
        }
      }
    )
  }
}
