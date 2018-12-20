import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomMaterialModule } from '../material.module';
import { PhonebookComponent } from './phonebook/phonebook.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { ListMessageComponent } from './list-message/list-message.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { StateService } from './state.service';
import { AuthGuardService } from './auth-guard-service';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    PhonebookComponent,
    SendMessageComponent,
    ListMessageComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
