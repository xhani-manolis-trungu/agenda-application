import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-add-books',
  templateUrl: './add-books.component.html',
  styleUrls: ['./add-books.component.css']
})
export class AddBooksComponent implements OnInit {
  public model:any = {}
  constructor(
    private _apiService:ApiService,
    private router:Router,
    private notifyService: NotificationService
  ) { }

  ngOnInit() {
  }

  addNew() {
    this._apiService.addNewBook(this.model).subscribe(
      data => {
        console.log("data: ", data);
        this.notifyService.showSuccess(data["message"], "Success")
        this.router.navigate(['/books'])  
      },
      error => {
        console.log(error);
        if(error.error.error.code){
          this.notifyService.showError("A book with this name already exist!", "Error");
        } else if (error.error.error.errors.price.path == 'price' && error.error.error.errors.ibsn.path == 'isbn'){
          this.notifyService.showError("Price && ISBN should only be numbers", "Error");
        } else {
          this.notifyService.showError(error.error.message, "Errror");
        }
      }
    )
  }
}
