import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import deepcopy from 'deepcopy';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StateService } from '../state.service';

export class PagingInformation {
  current: number;
  pagesLength: number;
}
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
  customerSms = [];

  page = 1;
  loading = false;

  filter = {
    message: 'all',
    order: 'new',
    tag: "ALL"
  }

  updateFilter(type: string, event) {
    console.log("Update", type);
    console.log(event);

    this.page = 1;
    this.filter[type] = event;
    this.loadSms();
  }

  sendMessage = new FormGroup({
    message: new FormControl(null, [Validators.required]),
    customer: new FormControl(null, [Validators.required])
  })
  sending: boolean;
  messages: string[];
  filteredOptions: Observable<string[]>;
  pageInformation: PagingInformation = <PagingInformation> {};
  constructor(public http: HttpClient, private state: StateService) {
    http.get(environment.base_url + '/tag')
      .subscribe(data => {
        this.tags = <Array<any>>data;
      });


    http.get(environment.base_url + '/messageTemplate')
      .subscribe(data => {
        this.messages = (<Array<any>>data).map(x => x.text);
      });

    this.loadSms();
  }

  loadSms() {
    this.loading = true;
    const params = {}

    switch (this.filter.message) {
      case 'sent':
        params['latest_sms__type'] = 'outgoing';
        break;
      case 'replied':
        params['latest_sms__type'] = 'incoming';
        break;
      case 'no':
        params['no_message'] = '1';
        break;
    }

    switch (this.filter.order) {
      case 'old':
        params['ordering'] = 'latest_sms__created';
        break;
      case 'new':
        params['ordering'] = '-latest_sms__created';
        break;
    }

    if (this.filter.tag !== "ALL") {
      params['tag'] = this.filter.tag;
    }

    params['page'] = this.page;
    this.http.get(environment.base_url + '/customerSms', {
      params: params
    })
      .subscribe(data => {
        this.loading = false;
        this.customerSms = <Array<any>>data['results'];
        this.pageInformation = {
          pagesLength: data['total_pages'],
          current: data['current']
        }
      });
  }

  ngOnInit() {
    this.filteredOptions = this.sendMessage.get('message').valueChanges
      .pipe(
        map(value => {
          this.sending = false;
          if (typeof (value) === 'string' || value instanceof String) {
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
    var tagId;
    if (tag.id === user.tag) {
      tagId = null;
    } else {
      tagId = tag.id
    }
    this.saving = user;
    this.http.patch(environment.base_url + '/customer/' + user.id + '/', {
      'tag': tagId
    }).subscribe(data => {
      console.log("Saved");
      this.saving = user;
      user.tag = tagId;
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

    var preferred_number = null;
    // Get the last SMS ID as the preferred sender phone number to send
    if (this.expandCustomer.all_sms && this.expandCustomer.all_sms.length > 0) {
      preferred_number = this.expandCustomer.all_sms[0].sender_number;
    }

    console.log("PREFERRED NUMBER", preferred_number);

    this.http.post(environment.base_url + '/send_message/', {
      'preferred_number': preferred_number,
      'customer': customerId,
      'message': this.sendMessage.value['message']
    }, {
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
