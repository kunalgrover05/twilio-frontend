import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { AuthGuardService } from './auth-guard-service';
import { ListMessageComponent } from './list-message/list-message.component';

const routes: Routes = [ 
   { path: "login", component: LoginComponent },
   { path: "", component: SendMessageComponent, canActivate: [AuthGuardService] },
   { path: "view", component: ListMessageComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
