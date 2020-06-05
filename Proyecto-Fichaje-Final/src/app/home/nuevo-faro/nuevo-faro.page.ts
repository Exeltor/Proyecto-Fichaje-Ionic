import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MapaModalComponent } from '../../shared/mapaModal/mapaModal.component';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { MatStepper } from '@angular/material/stepper';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-nuevo-faro',
  templateUrl: './nuevo-faro.page.html',
  styleUrls: ['./nuevo-faro.page.scss'],
})
export class NuevoFaroPage implements OnInit {
  registroIDFaro: FormGroup;
  nombreTipoFaro: FormGroup;
  datosFaro: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private modalCtrl: ModalController, private afs: AngularFirestore, private alertService: AlertService) { }

  ngOnInit() {
    this.registroIDFaro = this.fb.group({
      cod_cent: ["", Validators.required],
      id_radio: [null, Validators.required],
      latitud: [null, Validators.required],
      longitud: [null, Validators.required]
    });
    this.nombreTipoFaro = this.fb.group({
      nombre: ["", Validators.required],
      tipo_elem: [null, Validators.required],
    });
    this.datosFaro = this.fb.group({
      intensidad: ["", Validators.required],
      carga: [null, Validators.required],
      ocupacion: [null, Validators.required],
    });
  }

  async openMap() {
    let jsonQ = await this.http.get(`https://nominatim.openstreetmap.org/search/Madrid?format=json`).toPromise()

    const latLon = [jsonQ[0].lat, jsonQ[0].lon]

    let modal = await this.modalCtrl.create({
      component: MapaModalComponent,
      componentProps: { latLon, modalTitle: 'Encuentra tu empresa' }
    })

    modal.onDidDismiss().then((callback) => {
      if (callback.data === undefined) return;
      this.registroIDFaro.controls.latitud.setValue(callback.data.lat)
      this.registroIDFaro.controls.longitud.setValue(callback.data.lng)
    })

    await modal.present();

  }

  stepForward(stepper: MatStepper) {
    stepper.next();
  }

  stepBackward(stepper: MatStepper) {
    stepper.previous();
  }

  async submit(stepper: MatStepper) {
    this.loading = true;
    let generatedId = await this.generateNewId();
    await this.afs.collection('mapas').doc(generatedId.toString()).set({...this.registroIDFaro.value, ...this.nombreTipoFaro.value})
    await this.afs.collection('medias_tramos').doc(generatedId.toString()).set({...this.datosFaro.value})
    this.loading = false;

    //Reset stepper
    this.registroIDFaro.reset();
    this.nombreTipoFaro.reset();
    this.datosFaro.reset();
    stepper.reset()
    this.alertService.presentToastSinError(`RadioFaro ${generatedId} Creado`, 'RadioFaro creado con exito', 'none');
  }

  async generateNewId() {
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

}
