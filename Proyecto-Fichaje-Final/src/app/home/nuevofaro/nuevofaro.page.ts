import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { MapaModalComponent } from '../../shared/mapaModal/mapaModal.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-nuevofaro',
  templateUrl: './nuevofaro.page.html',
  styleUrls: ['./nuevofaro.page.scss'],
})
export class NuevofaroPage implements OnInit {
  NombreFaro: String;
  direccionFaro:String;
  latFaro: Number;
  lonFaro: Number;
  intensidad: Number;
  carga: Number;
  ocupacion: Number;
  faroForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private fb: FormBuilder,
    public alertController: AlertController,
    public afs: AngularFirestore,
    private alertService:AlertService
    ) { }

  ngOnInit() {
    this.faroForm = this.fb.group({
      NombreFaro: ['', Validators.required],
      code:['', Validators.required],
      id: ['', Validators.required],
      tipo: ['', Validators.required],
      latFaro: ['', Validators.required],
      lonFaro: ['', Validators.required],
      intensidad: ['', Validators.required],
      carga: ['', Validators.required],
      ocupacion: ['', Validators.required],
    });
  }

  async id_add() {
    let mapas = await this.afs.collection('mapas').get().pipe(take(1)).toPromise();
    let max = 0;

    mapas.forEach(doc => {
      let numDoc = parseInt(doc.id);
      if(numDoc > max) {
        max = numDoc;
      }
    });
    return max + 1;
  }

  get latFaro_() {
    return this.faroForm.get('latFaro');
  }

  get lonFaro_() {
    return this.faroForm.get('lonFaro');
  }

  async openMap() {
    let latLon;
    if(this.latFaro_.invalid && this.lonFaro_.invalid){
      latLon = [40.4183083, -3.70275];
    } else {
      latLon = [this.latFaro_.value, this.lonFaro_.value];
    }
    
    let modal = await this.modalController.create({
      component: MapaModalComponent,
      componentProps: { latLon, modalTitle: 'Marca la localizacion' }
    });

    modal.onDidDismiss().then(callback => {
      if (callback.data === undefined) return;
      this.latFaro = callback.data.lat;
      this.lonFaro = callback.data.lng;
    });

    await modal.present();
  }
  async onSubmit() {
    let id = await this.id_add();
    this.authService.crearFaro(this.faroForm.value, id);
    this.alertService.presentToastSinError("Faro creado","El faro se ha creado correctamente","");
    this.faroForm.reset();
  }
}