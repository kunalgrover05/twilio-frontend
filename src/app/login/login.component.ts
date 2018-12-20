import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { StateService } from "../state.service";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });
  error = null;

  constructor(public http: HttpClient, public stateService: StateService, public router: Router) {}

  ngOnInit() {}

  submitForm() {
    console.log("Logging in");
    this.http.post(environment.base_url + '/api-token-auth/', this.form.value)
      .subscribe(
        data => {
          console.log("Data received");
          this.stateService.setData(data);
          this.router.navigate([""]);
        },
        err => {
          this.error = "Failed to login";
        }
      );
  }

}
