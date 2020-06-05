import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { MapaModalComponent } from '../../shared/mapaModal/mapaModal.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-radiofaros',
  templateUrl: './radiofaros.page.html',
  styleUrls: ['./radiofaros.page.scss'],
})
export class RadiofarosPage implements OnInit {
  NombreFaro: String;
  direccionFaro:String;
  latFaro: String;
  lonFaro: String;
  intensidad: String;
  carga: String;
  ocupacion: String;
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
      codigo:['', Validators.required],
      id: ['', Validators.required],
      tipo: ['', Validators.required],
      latFaro: ['', Validators.required],
      lonFaro: ['', Validators.required],
      intensidad: ['', Validators.required],
      carga: ['', Validators.required],
      ocupacion: ['', Validators.required],
    });
  }

  get coords1_() {
    return this.faroForm.get('latFaro');
  }
  get coords2_() {
    return this.faroForm.get('lonFaro');
  }

  async idplus1() {
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

  async openMap() {
    let latLon;
    if(this.coords1_.invalid && this.coords2_.invalid){
      latLon = [40.4183083, -3.70275];
    } else {
      latLon = [this.coords1_.value, this.coords2_.value];
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
    let id = await this.idplus1();
    this.authService.addMapa(this.faroForm.value, id);
    this.alertService.presentToastSinError("Faro " + id + " añadido con éxito","Faro " + id + " correctamente añadido con las coordenadas: " + this.coords1_.value + ", " + this.coords2_.value, "daigual");
    this.faroForm.reset();
  }
}
