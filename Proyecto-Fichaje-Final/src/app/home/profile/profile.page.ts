import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import {
  ModalController,
  Platform,
  ActionSheetController
} from "@ionic/angular";
import { RegisterUserModalComponent } from "./register-user-modal/register-user-modal.component";
import { EditBusinessModalComponent } from "./edit-business-modal/edit-business-modal.component";
import { EditUserModalComponent } from "./edit-user-modal/edit-user-modal.component";
import { Horario } from "../../models/horario.model";
import { Observable } from "rxjs";
import { take, switchMap, tap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { PushNotificationsService } from "../../services/push-notifications.service";
import { AddHorarioModalComponent } from "./add-horario-modal/add-horario-modal.component";
import { Plugins, CameraResultType } from "@capacitor/core";
import { CroppingModalComponent } from "src/app/shared/cropping-modal/cropping-modal.component";
import { AngularFireStorage } from "@angular/fire/storage";

const { Camera } = Plugins;
@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  horario: Observable<any>;
  photoUrl;
  myImage;
  @ViewChild("fileInput") inputRef: ElementRef;
  constructor(
    public authService: AuthService,
    private modalController: ModalController,
    private pushNotifications: PushNotificationsService,
    private afs: AngularFirestore,
    private platform: Platform,
    public actionSheetController: ActionSheetController,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.pushNotifications.getToken();
    this.horario = this.authService.user.pipe(
      switchMap(user => {
        const ref = this.storage.ref(`profile/${user.uid}`);
        this.photoUrl = ref.getDownloadURL().toPromise();
        return this.afs
          .doc<Horario>(`empresas/${user.empresa}/horarios/${user.horario}`)
          .valueChanges();
      })
    );
  }

  // Apertura modal para introduccion de datos de la persona a registrar
  registerUser() {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.modalController
        .create({
          component: RegisterUserModalComponent,
          componentProps: {
            empresaCode: user.empresa
          }
        })
        .then(modalEl => {
          modalEl.present();
        });
    });
  }

  addHorario() {
    this.modalController
      .create({
        component: AddHorarioModalComponent
      })
      .then(modalEl => {
        modalEl.present();
      });
  }

  editProfile() {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.modalController
        .create({
          component: EditUserModalComponent,
          componentProps: {
            nombre: user.nombre,
            DNI: user.DNI,
            email: this.authService.getUserEmail(),
            telefono: user.telefono,
            country: user.countryCode,
            horarioCode: user.horario,
            empresaCode: user.empresa,
            latPersona: user.localizacionCasa.lat,
            lonPersona: user.localizacionCasa.lon
          }
        })
        .then(modalEl => {
          modalEl.present();
        });
    });
  }

  editBusiness() {
    this.authService.empresa.pipe(take(1)).subscribe(empresa => {
      this.modalController
        .create({
          component: EditBusinessModalComponent,
          componentProps: {
            Nombre: empresa.Nombre,
            CIF: empresa.id,
            latEmpresa: empresa.loc[0],
            lonEmpresa: empresa.loc[1],
            distancia: empresa.distancia
          }
        })
        .then(modalEl => {
          modalEl.present();
        });
    });
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      width: 300
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    // Can be set to the src of an image now
    this.myImage = image.dataUrl;

    this.openCropperModal();
    //this.path = this.getImgContent(image.webPath);
  }

  public addFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.myImage = event.target.result;
        this.openCropperModal();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  getCordovaAvailable() {
    if (this.platform.is("cordova")) {
      this.takePicture();
    } else {
      this.presentActionSheet();
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Albums",
      buttons: [
        {
          text: "Abrir Cámara",
          icon: "camera",
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: "Escoger de la galeria",
          icon: "images",
          handler: () => {
            this.inputRef.nativeElement.click();
          }
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }

  openCropperModal() {
    this.modalController
      .create({
        component: CroppingModalComponent,
        componentProps: {
          myImage: this.myImage,
          userUid: this.authService.userUid
        }
      })
      .then(modalEl => {
        modalEl.present();
        modalEl.onDidDismiss().then(() => {
          const ref = this.storage.ref(`profile/${this.authService.userUid}`);
          this.photoUrl = ref.getDownloadURL();
        });
      });
  }
}
