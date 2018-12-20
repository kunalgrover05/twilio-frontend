import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-list-message',
  templateUrl: './list-message.component.html',
  styleUrls: ['./list-message.component.scss']
})
export class ListMessageComponent implements OnInit {
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
    this.filteredCustomerSms = this.customerSms.filter(x => {
      if (this.selected === 1) {
        return x.all_sms.find(sms => sms.type === 'outgoing') != null;
      } else if (this.selected === 2) {
        return x.all_sms.find(sms => sms.type === 'incoming') != null;
      }
      return true;
    });

  }

  ngOnInit() {
  }

  selectTag(tag, sms) {

    this.saving = sms;
    this.http.patch(environment.base_url + '/sms/' + sms.id + '/', {
      'tag': tag.id
    }).subscribe(data => {
      console.log("Saved");
      this.saving = sms;
      sms.tag = tag.id;
      this.saving = null;
      this.saved = sms;
    });
  }
}
