import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public model:any = {};
  response: any;
  constructor(
    private _apiService:ApiService,
    private router:Router,
    private notifyService: NotificationService
  ) { }

  ngOnInit() {
  }

  signin() {
    console.log("login.component.ts: sign() called");
    this._apiService.login(this.model).subscribe(
      data => {
        console.log("Successfull", data);
        this.response = data;
        console.log("Response: ", this.response.message);
        //check the response message
        if(this.response.message === "Auth successful") {
          console.log("login.component.ts: data: ", data);
          //this.toastr.success(data["message"], "Success")
          this.notifyService.showSuccess("<h2>Data Shown successfully</h2>", "Notification");
          localStorage.setItem('user_type', data['user_type']);
          localStorage.setItem("token", data['token']);
          this.router.navigate(['/books']);
        }
      },
      error => {
        this.notifyService.showError("Error in login.component.ts", "Notification");
      }
    )
  }

}


