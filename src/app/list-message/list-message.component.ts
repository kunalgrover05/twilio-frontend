import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import deepcopy from 'deepcopy';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StateService } from '../state.service';

@Component({
  selector: 'app-list-message',
  templateUrl: './list-message.component.html',
  styleUrls: ['./list-message.component.scss']
})
export class ListMessageComponent implements OnInit {
  expandCustomer: any;
  sms = [];
  tags = [];
  saved = null;
  saving = null;
  selected = 0;
  filteredSms = [];
  customerSms = [];
  filteredCustomerSms = [];

  sendMessage = new FormGroup({
    message: new FormControl(null, [Validators.required]),
    customer: new FormControl(null, [Validators.required])
  })
  sending: boolean;
  messages: string[];
  filteredOptions: Observable<string[]>;
  constructor(public http: HttpClient, private state: StateService) {
    http.get(environment.base_url + '/tag')
    .subscribe(data => {
      this.tags = <Array<any>>data;
    });

    http.get(environment.base_url + '/customerSms')
    .subscribe(data => {
      this.customerSms = <Array<any>>data;
      this.filterCustomerSms();
    });

    http.get(environment.base_url + '/messageTemplate')
    .subscribe(data => {
      this.messages = (<Array<any>>data).map(x => x.text);
    });

   }

  filterCustomerSms() {
    this.filteredCustomerSms = this.customerSms;
    // this.filteredCustomerSms = deepcopy(this.customerSms);
    // console.log(this.filterCustomerSms);
    // this.filteredCustomerSms.forEach(customer => {
    //   customer.all_sms = customer.all_sms.filter(x => {
    //     if (this.selected === 1) {
    //       return x.type === 'outgoing';
    //     } else if (this.selected === 2) {
    //       return x.type === 'incoming';
    //     }
    //     return true;
    // });
  // });
  // this.filteredCustomerSms = this.filteredCustomerSms.filter(x => {
    // return x.all_sms.length > 0;
  // });
  // console.log(this.filteredCustomerSms);

  }

  ngOnInit() {
    this.filteredOptions = this.sendMessage.get('message').valueChanges
    .pipe(
      map(value => {
        this.sending = false;
        if ( typeof(value) === 'string' || value instanceof String) {
          return this._filter(value.toString());
        } else {
          return this.messages;
        }
      })
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.messages.filter(option => option.toLowerCase().includes(filterValue));
  }

  selectTag(tag, user) {

    this.saving = user;
    this.http.patch(environment.base_url + '/customer/' + user.id + '/', {
      'tag': tag.id
    }).subscribe(data => {
      console.log("Saved");
      this.saving = user;
      user.tag = tag.id;
      this.saving = null;
      this.saved = user;
    });
  }

  expand(customer) {
    this.expandCustomer = customer;
    this.http.get(environment.base_url + '/customerSms/' + customer.id.toString() + '/')
      .subscribe(data => {
        this.expandCustomer.all_sms = data['all_sms'];
        console.log(this.expandCustomer);
      });
  }

  submitForm() {
    this.sending = true;
    const customerId = this.sendMessage.value['customer'];
    this.http.post(environment.base_url + '/send_message/', this.sendMessage.value, {
      headers: {
        Authorization: "Token " + this.state.getToken()
      }
    })
      .subscribe(data => {
        console.log("MESSAGE SENT");
        this.sending = false;

        // Add this message
        const customer = this.customerSms.find(x => x.id == customerId);

        customer.all_sms.unshift(data);

        this.sendMessage.reset();
      });
  
  }
}
