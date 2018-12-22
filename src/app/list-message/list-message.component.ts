import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import deepcopy from 'deepcopy';

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

  constructor(public http: HttpClient) {
    http.get(environment.base_url + '/tag')
    .subscribe(data => {
      this.tags = <Array<any>>data;
    });

    http.get(environment.base_url + '/customerSms')
    .subscribe(data => {
      this.customerSms = <Array<any>>data;
      this.filterCustomerSms();
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
}
