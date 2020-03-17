import { Component, OnInit} from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar';


@Component({
  selector: 'app-hora',
  templateUrl: './hora.page.html',
  styleUrls: ['./hora.page.scss'],
})
export class HoraPage implements OnInit {
  dateMulti: string[];
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi',
    weekStart: 1,
    weekdays:  ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthPickerFormat: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEPT', 'OCT', 'NOV', 'DIC'],
    showToggleButtons: true,
    from: new Date(1),
    to: new Date(Date.now())
  };

  constructor() {
  }

  ngOnInit() {
  }

}
