import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {NotificationService} from '../../services/notification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public model:any = {}

  constructor(
    private _apiService:ApiService,
    private notifyService: NotificationService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  signup() {
    this._apiService.signup(this.model).subscribe(
      data => {
        console.log("data: ", data);
        this.notifyService.showSuccess(data["message"], "Success")
        this.router.navigate(['/login']);
      },
      error => {
        this.notifyService.showError(error.error.message, "Error in signup.component.ts");
      }
    )
  }
}
