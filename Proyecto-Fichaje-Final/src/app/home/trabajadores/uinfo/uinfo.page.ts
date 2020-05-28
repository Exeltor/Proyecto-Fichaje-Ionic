import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import {
  ModalController,
  NavParams,
  Platform,
  ActionSheetController
} from "@ionic/angular";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Horario } from "src/app/models/horario.model";
import { User } from "src/app/models/user.model";
import { Empresa } from "src/app/models/empresa.model";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AngularFireStorage } from "@angular/fire/storage";
import { CroppingModalComponent } from "src/app/shared/cropping-modal/cropping-modal.component";
import { Plugins, CameraResultType } from "@capacitor/core";

const { Camera } = Plugins;
@Component({
  selector: "app-uinfo",
  templateUrl: "./uinfo.page.html",
  styleUrls: ["./uinfo.page.scss"]
})
export class UinfoPage implements OnInit {
  horario: Observable<Horario>;
  empresa: Observable<Empresa>;
  user: Observable<User>;
  horariosEmpresas: any = [];
  @Input() uid = "";
  @Input() nombre;
  @Input() empresaCode;
  @Input() horarioCode;
  @Input() dni;
  @Input() telefono;
  photoUrl;

  nombreEdit;
  horarioEdit;
  photoEdit;

  editBool: Boolean;
  editWorker: FormGroup;
  myImage;
  @ViewChild("fileInput") inputRef: ElementRef;
  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public authService: AuthService,
    public afs: AngularFirestore,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private platform: Platform,
    public actionSheetController: ActionSheetController
  ) {}

  public closeModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    this.nombreEdit = this.nombre;
    this.horarioEdit = this.horarioCode;
    this.editBool = false;

    this.horario = this.afs
      .doc<Horario>(`empresas/${this.empresaCode}/horarios/${this.horarioCode}`)
      .valueChanges();

    this.empresa = this.afs
      .doc<Empresa>(`empresas/${this.empresaCode}`)
      .valueChanges();
    this.editWorker = this.fb.group({});

    // Listado de horarios de la empresa a la que pertenece el usuario logeado
    this.horariosEmpresas = this.afs
      .collection<Horario>(`empresas/${this.empresaCode}/horarios/`)
      .valueChanges();
    const ref = this.storage.ref(`profile/${this.uid}`);
    this.photoUrl = ref.getDownloadURL();
  }

  edit() {
    this.editBool = true;
  }
  submit() {
    if (this.nombreEdit !== this.nombre) {
      this.editNombre();
    }
    if (this.horarioEdit !== this.horario) {
      this.editHorario();
    }
    this.editBool = false;
  }

  private editNombre() {
    this.afs.doc(`users/${this.uid}`).update({
      nombre: this.nombreEdit
    });
    this.nombre = this.nombreEdit;
  }
  private editHorario() {
    this.afs.doc(`users/${this.uid}`).update({
      horario: this.horarioEdit
    });
    this.horarioCode = this.horarioEdit;
    this.refreshHorario();
  }
  private refreshHorario() {
    this.horario = this.afs
      .doc<Horario>(`empresas/${this.empresaCode}/horarios/${this.horarioCode}`)
      .valueChanges();
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
          userUid: this.uid
        }
      })
      .then(modalEl => {
        modalEl.present();
        modalEl.onDidDismiss().then(() => {
          const ref = this.storage.ref(`profile/${this.uid}`);
          this.photoUrl = ref.getDownloadURL();
        });
      });
  }
}
