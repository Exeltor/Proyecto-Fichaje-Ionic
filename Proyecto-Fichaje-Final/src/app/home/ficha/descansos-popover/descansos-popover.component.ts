import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-descansos-popover',
  templateUrl: './descansos-popover.component.html',
  styleUrls: ['./descansos-popover.component.scss'],
})
export class DescansosPopoverComponent implements OnInit {
  @Input() dayDocument;
  startTimes: Array<any>;
  endTimes: Array<any>;
  content: Array<{startTime: string, endTime: string}>

  constructor() { }

  ngOnInit() {
    this.startTimes = this.dayDocument.horasPausa;
    this.endTimes = this.dayDocument.horasResume;
    this.content = this.getContent();
  }

  getContent(): Array<{startTime: string, endTime: string}> {
    let content = []
    for(let i = 0; i < this.startTimes.length; i++) {
      try {
        content.push({startTime: this.startTimes[i].toDate(), endTime: this.endTimes[i].toDate()})
      } catch (e) {
        content.push({startTime: this.startTimes[i].toDate(), endTime: null})
      }
    }
    return content;
  }

}
