import { Component, OnInit, Input } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Horario } from "src/app/models/horario.model";
import { User } from "src/app/models/user.model";
import { Empresa } from "src/app/models/empresa.model";
import { FormGroup, FormBuilder } from '@angular/forms';

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
  @Input() uid;
  @Input() nombre;
  @Input() empresaCode;
  @Input() horarioCode;
  @Input() dni;
  @Input() telefono;
  @Input() photoURL;

  nombreEdit;
  horarioEdit;
  photoEdit;

  editBool:Boolean;
  editWorker: FormGroup;
  constructor(
    public mdlCtrl: ModalController,
    public navParams: NavParams,
    public authService: AuthService,
    public afs: AngularFirestore,
    private fb: FormBuilder,
  ) {}

  public closeModal() {
    this.mdlCtrl.dismiss();
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
    this.editWorker = this.fb.group({

    });

    // Listado de horarios de la empresa a la que pertenece el usuario logeado
    this.horariosEmpresas = this.afs
      .collection<Horario>(`empresas/${this.empresaCode}/horarios/`)
      .valueChanges();
  }

  edit() {
    this.editBool = true;
  }
  submit(){
    
    if(this.nombreEdit !== this.nombre){
      this.editNombre();
    } 
    if(this.horarioEdit !== this.horario){
      this.editHorario();
    }
    this.editBool = false;
  }

  private editNombre(){
    this.afs.doc(`users/${this.uid}`).update({
      nombre: this.nombreEdit,
    });
    this.nombre = this.nombreEdit;
  }
  private editHorario(){
    this.afs.doc(`users/${this.uid}`).update({
      horario: this.horarioEdit,
    });
    this.horarioCode = this.horarioEdit;
    this.refreshHorario();
  }
  private refreshHorario(){
    this.horario = this.afs
      .doc<Horario>(`empresas/${this.empresaCode}/horarios/${this.horarioCode}`)
      .valueChanges();
  }
}
