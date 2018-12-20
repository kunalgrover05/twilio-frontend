import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { StateService } from "./state.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private stateService: StateService, private router: Router) {
    console.log("INitialized AuthGaurd");
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.stateService.getToken() != null) {
      console.log("Don't redirect");
      return true;
    } else {
      console.log("redreect");
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
