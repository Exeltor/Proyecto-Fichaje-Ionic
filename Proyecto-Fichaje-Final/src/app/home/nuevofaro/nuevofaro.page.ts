import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { MapaModalComponent } from 'src/app/shared/mapaModal/mapaModal.component';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nuevofaro',
  templateUrl: './nuevofaro.page.html',
  styleUrls: ['./nuevofaro.page.scss'],
})
export class NuevofaroPage implements OnInit {
  nuevoFaroForm: FormGroup;
  idFaro;
  nombrefaro: string;
  latitudfaro: number;
  longitudfaro: number;
  codcentfaro: string;
  idradiofaro: string;
  tipoelemfaro: string;
  intensidadfaro: number;
  cargafaro: number;
  ocupacionfaro: number;
  confirmacion: boolean;

  constructor(private formBuilder: FormBuilder, public afs: AngularFirestore, public http: HttpClient, public modalCtrl: ModalController) {}

  async obtenerIdFaro() { // Funcion para obtener el id de faro mas alto y sumarle 1 para el nuevo faro
    let maxId = 0;
    let mapas = await this.afs.collection('mapas').get().pipe(take(1)).toPromise();
    mapas.forEach(doc => {
      let docId = parseInt(doc.id);
      if(docId > maxId) {
        maxId = docId;
      }
    });
    this.idFaro = maxId + 1;
  }

  ionViewWillEnter(){
    this.obtenerIdFaro();
  }

  ngOnInit() {
    this.nuevoFaroForm = this.formBuilder.group({
      nombrefaro: '',
      latitudfaro: '',
      longitudfaro: '',
      codcentfaro: '',
      idradiofaro: '',
      tipoelemfaro: '',
      intensidadfaro: '',
      cargafaro: '',
      ocupacionfaro: ''
    });
  }

  registrarFaro(){ // Metodo que sube los datos del form al FireBase
    this.idFaro = this.idFaro.toString();
    this.afs.collection("mapas").doc(this.idFaro).set({
      nombre: this.nuevoFaroForm.value.nombrefaro,
      latitud: this.nuevoFaroForm.value.latitudfaro,
      longitud: this.nuevoFaroForm.value.longitudfaro,
      cod_cent: this.nuevoFaroForm.value.codcentfaro,
      id_radio: this.nuevoFaroForm.value.idradiofaro,
      tipo_elem: this.nuevoFaroForm.value.tipoelemfaro
    })

    this.afs.collection("medias_tramos").doc(this.idFaro).set({
      intensidad: this.nuevoFaroForm.value.intensidadfaro,
      carga: this.nuevoFaroForm.value.cargafaro,
      ocupacion: this.nuevoFaroForm.value.ocupacionfaro
    })
  }


  async abrirMapa() { // Metodo para marcar latitud y longitud en el mapa al registrar el faro
    let jsonQ = await this.http.get("https://nominatim.openstreetmap.org/search/Madrid?format=json").toPromise();

    const latLon = [jsonQ[0].lat, jsonQ[0].lon];

    let modal = await this.modalCtrl.create({
      component: MapaModalComponent,
      componentProps: { latLon, modalTitle: 'Marca el faro' }
    })

    modal.onDidDismiss().then((callback) => {
      if (callback.data === undefined) return;
      this.nuevoFaroForm.controls.latitudfaro.setValue(callback.data.lat);
      this.nuevoFaroForm.controls.longitudfaro.setValue(callback.data.lng);
    })

    await modal.present();

  }

  onSubmit() { // Metodo que se llama al pulsar el boton de crear nuevo Faro y escribe mensaje satisfactorio
    this.registrarFaro();
    setTimeout(() => {
      this.confirmacion = true;
    }, 3000);
    this.nuevoFaroForm.reset();
  }

}
