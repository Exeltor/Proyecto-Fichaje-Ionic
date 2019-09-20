import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-second-page',
  templateUrl: './second-page.page.html',
  styleUrls: ['./second-page.page.scss'],
})
export class SecondPagePage implements OnInit {
  username: string;
  arrayPrueba: string[] = ['Que', 'Pasa', 'Gente', '?', 'Estoy', 'Doramion'];
  trueOrFalse: boolean = false;

  constructor(private userService: UserServiceService, private router: Router, private actionSheetCtrl: ActionSheetController) { }

  
  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUserFromService();
  }

  getUserFromService() {
    this.username = this.userService.getUser();
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }

  openActionShit() {
    this.actionSheetCtrl.create({
      header: 'Que pasa gente?',
      buttons:[{
        text:'Estoy'
      },{
        text:'Doramion'
      },{
        text:'Mis huevos mágicos grandes'
      },{
        text:'Cancelame esta',
        role:'cancel'
      }
    ]
    }).then(mostro => {
      mostro.present();
    });
  }
//Comparacion de async(abajo) con sin async ezpz
  async openActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Albums',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


}
