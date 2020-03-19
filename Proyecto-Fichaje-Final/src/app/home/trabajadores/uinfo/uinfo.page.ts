import { Component, OnInit, Input } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { switchMap } from "rxjs/operators";
import { Horario } from "src/app/models/horario.model";
import { User } from "src/app/models/user.model";
import { Empresa } from "src/app/models/empresa.model";

@Component({
  selector: "app-uinfo",
  templateUrl: "./uinfo.page.html",
  styleUrls: ["./uinfo.page.scss"]
})
export class UinfoPage implements OnInit {
  horario: Observable<Horario>;
  empresa: Observable<Empresa>;
  user: Observable<User>;

  @Input() uid;
  @Input() nombre;
  @Input() empresaCode;
  @Input() horarioCode;
  @Input() dni;
  @Input() telefono;
  @Input() photoURL;

  constructor(
    public mdlCtrl: ModalController,
    public navParams: NavParams,
    public authService: AuthService,
    public afs: AngularFirestore
  ) {}

  public closeModal() {
    this.mdlCtrl.dismiss();
  }

  ngOnInit() {
    this.horario = this.afs
      .doc<Horario>(`empresas/${this.empresaCode}/horarios/${this.horarioCode}`)
      .valueChanges();
    this.empresa = this.afs
      .doc<Empresa>(`empresas/${this.empresaCode}`)
      .valueChanges();
  }

  editWorker() {}
}
