import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class StateService {
  private token;
  public data;
  
  setData(data: any) {
    this.token = data["token"];
    localStorage.setItem("token", this.token);
  }

  getToken(): string {
    return this.token;
  }
  
  logout() {
    localStorage.clear();
    this.data = null;
    this.router.navigate(["/login"]);
  }

  constructor(
    public router: Router,
    public httpClient: HttpClient
  ) {
    this.token = localStorage.getItem("token");
  }
}
