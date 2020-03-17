import { Component, OnInit} from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-hora',
  templateUrl: './hora.page.html',
  styleUrls: ['./hora.page.scss'],
})
export class HoraPage implements OnInit {
  dateMulti: string[];
  type: 'string';
  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi',
    weekStart: 1,
    weekdays:  ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthPickerFormat: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEPT', 'OCT', 'NOV', 'DIC'],
    showToggleButtons: true,
    from: new Date(1),
    to: new Date(Date.now())
  };

  onSelect($event) {
    console.log('onSelect', $event);
  }

  constructor(public authService: AuthService, public afs: AngularFirestore) {
  }

  ngOnInit() {
  }

}
