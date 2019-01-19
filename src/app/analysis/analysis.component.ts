import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { environment } from 'src/environments/environment.prod';
import { StateService } from '../state.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  startDate: Date = moment().subtract(20, 'days').toDate();
  endDate: Date = new Date();
  chart;
  filter = {
    time: 7
  }
  loadPercentDataSubscription: Subscription;

  updateFilter(type: string, value: any) {
    if (type === 'time') {
      this.filter.time = value;
      this.startDate = moment().subtract(value, 'days').toDate();
      this.loadPercentData();
    }
  }

  constructor(private http: HttpClient, private state: StateService) {
  }

  ngOnInit() {
    this.loadPercentData();
  }

  loadPercentData() {
    if (this.loadPercentDataSubscription) {
      this.loadPercentDataSubscription.unsubscribe();
    }

    this.loadPercentDataSubscription = this.http.get(environment.base_url + "/smsAnalytics", {
      headers: {
        'Authorization': "Token " + this.state.getToken()
      },
      params: {
        startDate: this.startDate.toISOString(),
        endDate: this.endDate.toISOString()
      }
    }).subscribe(resp => {
      var dataArr = (resp as Array<any>);
      dataArr = dataArr.map(x => {
        x.date = moment(x.date).toDate();
        return x;
      });
      dataArr = dataArr.sort((a, b) => {
        return a.date - b.date;
      })
      console.log(dataArr);

      this.chart = new Chart('myChart', {
        type: 'line',
        data: {
          datasets: [{
            label: 'Number of people responded',
            data: dataArr.map(x => {
              return {
                t: x.date,
                y: x.responded
              }
            }),
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'rgba(255, 0, 0, 0.5)',
            fill: false
          },
          {
            label: 'Number of people messaged',
            data: dataArr.map(x => {
              return {
                t: moment(x.date).toDate(),
                y: x.total
              }
            }),
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            borderColor: 'rgba(0, 255, 0, 0.5)',
            fill: false
          }]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'day',
                unitStepSize: 1,
                displayFormats: {
                  'day': 'MMM DD'
                }

              }
            }]
          }
        }
      });
    });
  }
}
