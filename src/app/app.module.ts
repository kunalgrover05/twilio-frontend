import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomMaterialModule } from '../material.module';
import { SendMessageComponent } from './send-message/send-message.component';
import { ListMessageComponent } from './list-message/list-message.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { StateService } from './state.service';
import { AuthGuardService } from './auth-guard-service';

@NgModule({
  declarations: [
    AppComponent,
    SendMessageComponent,
    ListMessageComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    StateService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
