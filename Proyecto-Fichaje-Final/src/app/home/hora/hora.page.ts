import { Component, OnInit} from '@angular/core';
import { CalendarComponent, CalendarComponentOptions } from 'ion2-calendar';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-hora',
  templateUrl: './hora.page.html',
  styleUrls: ['./hora.page.scss'],
})
export class HoraPage implements OnInit {
  calendarRef: CalendarComponent;
  dateMulti: string[];
  type: 'string';
  optionsMulti: CalendarComponentOptions = {
    pickMode: 'single',
    weekStart: 1,
    weekdays:  ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthPickerFormat: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'],
    showToggleButtons: true,
    from: new Date(1),
    to: new Date(Date.now())
  };

  onSelect($event) {
    console.log($event['_d']);
  }

  constructor(public authService: AuthService, public afs: AngularFirestore) {
  }

  ngOnInit() {
  }

}
