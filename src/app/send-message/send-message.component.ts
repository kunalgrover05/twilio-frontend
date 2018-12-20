import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StateService } from '../state.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {
  filteredOptions: Observable<any[]>;
  users = [];
  messageTemplates = [];
  lists = [];
  selectedUsers = [];

  sent = null;
  message = null;
  selectedListName = 'ALL';
  messageTemplateControl = new FormControl();
  messageInputControl = new FormControl();

  userControl = new FormControl();
  sendMessage = new FormGroup({
    'customer': new FormControl('', Validators.required),
    'customerName': this.userControl,
    'message': new FormControl('', Validators.required),
  });
  constructor(public http: HttpClient, public state: StateService) {
    http.get(environment.base_url + '/customer')
      .subscribe(data => {
        this.users = <Array<any>>data;
        this.selectedList('ALL');
        console.log(this.users);
      });
    http.get(environment.base_url + '/messageTemplate')
      .subscribe(data => {
        this.messageTemplates = <Array<any>>data;
        console.log(this.users);
      });
      http.get(environment.base_url + '/contactList')
      .subscribe(data => {
        this.lists = <Array<any>>data;
      });

    }

  ngOnInit() {
    this.filteredOptions = this.userControl.valueChanges
      .pipe(
        map(value => {
          console.log(value);
          this.sent = false;
          if ( typeof(value) === 'string' || value instanceof String) {
            return this._filter(value.toString());
          } else {
            return this.users;
          }
        })
      );
    }

    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.users.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    submitForm() {
      console.log(this.sendMessage.value);
      console.log("Submitting");
      this.http.post(environment.base_url + '/send_message/', this.sendMessage.value, {
        headers: {
          Authorization: "Token " + this.state.getToken()
        }
      })
        .subscribe(data => {
          console.log("MESSAGE SENT");
          this.sent = true;
          this.sendMessage.markAsPristine();
        });
    }

    sendMessageFn(user) {
      this.http.post(environment.base_url + '/send_message/', {
        customer: user.id,
        message: this.message,
      }, {
        headers: {
          Authorization: "Token " + this.state.getToken()
        }
      })
        .subscribe(data => {
          console.log("MESSAGE SENT");
          this.sent = user;
        });
    }

    displayFn(x) {
      return x ? x.name : x;
    }

    update(user) {
      console.log("Setting user");
      console.log(user.option.value.id);
      this.sendMessage.get('customer').setValue(user.option.value.id);
    }

    selectedMessage(type, event) {
      console.log(type);
      console.log(event);
      if (type === 0) {
        this.message = this.messageTemplates.find(x => x.id === event.value).text;
        this.messageInputControl.setValue(null);
      } else {
        this.message = event.target.value;
        this.messageTemplateControl.setValue(null);
      }

    }

    selectedList(contactList) {
      this.selectedListName = contactList;
      if (contactList === 'ALL') {
        this.selectedUsers = this.users;
      } else {
        this.selectedUsers = this.users.filter(x => x.contact_list === contactList)
      }
    }
}
