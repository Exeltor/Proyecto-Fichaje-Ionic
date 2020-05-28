import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";
import { Observable, of } from "rxjs";
import { switchMap, take } from "rxjs/operators";
import { Empresa } from "../models/empresa.model";
import { User } from "../models/user.model";
import { auth } from "firebase/app";
import { LoggingService } from "../logging/logging.service";
import { SendPushService } from "../services/send-push.service";
import { AlertService } from "../services/alert.service";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
declare var google: any;
@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: Observable<User>;
  empresa: Observable<Empresa>;
  Nombre: string;
  userUid;
  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient,
    private loadingController: LoadingController,
    private logger: LoggingService,
    private sendPush: SendPushService,
    private alertService: AlertService
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.userUid = user.uid;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );

    this.empresa = this.user.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .doc<Empresa>(`empresas/${user.empresa}`)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  getUserEmail() {
    return this.afAuth.auth.currentUser.email;
  }

  registerUser(datos) {
    this.loadingController
      .create({
        keyboardClose: true,
        message: "Creando usuario",
      })
      .then((loadingEl) => {
        loadingEl.present();
        const tel = `+${datos.country}${datos.telefono}`;
        const email = datos.email;
        const password = datos.password;
        this.http
          .post("https://us-central1-fichaje-uni.cloudfunctions.net/register", {
            email,
            password,
            tel,
          })
          .subscribe(
            (response) => {
              const jsonResponse = JSON.parse(JSON.stringify(response));

              this.setDoc(
                jsonResponse.uid,
                datos.nombre,
                datos.DNI,
                datos.country,
                '',
                datos.telefono,
                datos.horasTrabajo,
                false,
                false,
                datos.latPersona,
                datos.lonPersona,
                datos.horarioCF
              );
              
              this.alertService.presentToastSinError(
                "Creado",
                `Se ha añadido al trabajador ${datos.nombre} a tu empresa.`,
                "modal"
              );
              loadingEl.dismiss();
            },
            (err) => {
              const jsonError = JSON.parse(JSON.stringify(err));
              const error = jsonError.error.text;
              let errorMessage;
              if (
                error ===
                "Error: Error: The email address is already in use by another account."
              ) {
                errorMessage = "Email en uso";
              } else if (
                error ===
                "Error: Error: The user with the provided phone number already exists."
              ) {
                errorMessage = "Telefono en uso";
              } else {
                errorMessage = "Intentelo de nuevo";
              }

              loadingEl.dismiss();
              this.logger.logEvent(errorMessage, 5, "authService registerUser");
              this.alertService.presentAlertError(errorMessage, "modal");
            }
          );
      });

  }

  registerAdmin(datos, cifEmpresa) {
    this.loadingController
      .create({
        keyboardClose: true,
        message: "Creando administrador",
      })
      .then((loadingEl) => {
        loadingEl.present();
        const tel = `+${datos.country}${datos.telefono}`;
        const email = datos.email;
        const password = datos.password;
        this.http
          .post("https://us-central1-fichaje-uni.cloudfunctions.net/register", {
            email,
            password,
            tel,
          })
          .subscribe(
            (response) => {
              const jsonResponse = JSON.parse(JSON.stringify(response));
              this.setDoc(
                jsonResponse.uid,
                datos.nombre,
                datos.DNI,
                datos.country,
                cifEmpresa,
                datos.telefono,
                datos.horasTrabajo,
                true,
                false,
                datos.latPersona,
                datos.lonPersona,
                datos.horarioCF
              );
              loadingEl.dismiss();
              this.alertService.presentToastSinError(
                "Admin Registrado",
                `El administrador ${datos.nombre} ha sido creado`,
                "registrarEmpresa"
              );
              this.router.navigateByUrl("/auth");
            },
            (err) => {
              const jsonError = JSON.parse(JSON.stringify(err));
              const error = jsonError.error.text;
              let errorMessage;
              if (
                error ===
                "Error: Error: The email address is already in use by another account."
              ) {
                errorMessage = "Email en uso";
              } else if (
                error ===
                "Error: Error: The user with the provided phone number already exists."
              ) {
                errorMessage = "Telefono en uso";
              } else {
                errorMessage = "Intentelo de nuevo";
              }

              loadingEl.dismiss();
              //this.presentAlertError(errorMessage);
            }
          );
      });
  }

  private setDoc(
    uid,
    nameSurname,
    DNI,
    country,
    empresa,
    telefono,
    hours,
    admin,
    superadmin,
    lat,
    lon,
    horarioCF
  ) {
    //TODO: change every uid to DNI, hay que pensarlo mejor bruh
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}`
    );

    this.user.pipe(take(1)).subscribe((data) => {
      if (admin == false) {
        empresa = data.empresa;
      }
      const userDoc: User = {
        uid,
        nombre: nameSurname,
        DNI,
        admin,
        superadmin,
        countryCode: country.toString(),
        telefono,
        empresa,
        horario: horarioCF,
        horasDiarias: hours,
        localizacionCasa: { lat, lon },
      };
      
      if (admin == false) {
        this.afs
          .collection("users")
          .ref.where("empresa", "==", data.empresa)
          .where("admin", "==", true)
          .get()
          .then((docs) => {
            let uids: Array<string> = [];
            docs.forEach((doc) => {
              uids.push(doc.data().uid);
            });
            this.sendPush.sendPush(
              `Se ha creado un trabajador en la empresa ${data.empresa}`,
              `El administrador ${data.nombre} ha añadido a ${nameSurname} a la empresa`,
              uids
            );
          });
        userRef.set(userDoc);
        this.getStepsWorkUser(lat,lon,empresa,uid);
        this.logger.logEvent(`User created: ${DNI}`, 3, "authService setDoc");
      } else {
        userRef.set(userDoc);
        this.logger.logEvent(`Admin created: ${DNI}`, 3, "authService setDoc");
      }
    });
  }

  crearEmpresa(data) {
    this.afs
      .collection(`empresas`)
      .doc(data.cif)
      .set({
        Nombre: data.nombreEmpresa,
        id: data.cif,
        loc: [Number(data.latEmpresa), Number(data.lonEmpresa)],
        distancia: data.distancia,
      })
      .then(() => {
        this.afs.doc(`empresasPendientes/${data.cif}`).delete();
      })
      .catch((error) => {});
  }

  validateBusiness(data) {
    console.log(data.CIF);
    console.log(data.DNI);

    this.afs
      .collection(`empresasPendientes`)
      .doc(data.CIF)
      .set({
        cif: data.CIF,
        dni: data.DNI,
      })
      .catch((error) => {});
  }

  login(email: string, password: string) {
    this.loadingController
      .create({
        keyboardClose: true,
        message: "Iniciando Sesion...",
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.afAuth.auth
          .signInWithEmailAndPassword(email, password)
          .then((val) => {
            this.logger.logEvent(
              `User logged in: ${val.user.uid}`,
              3,
              "authService login"
            );
            loadingEl.dismiss();
            this.router.navigateByUrl("/home");
          })
          .catch((err) => {
            let error;

            if (
              err.code === "auth/invalid-email" ||
              err.code === "auth/wrong-password" ||
              err.code === "auth/user-not-found"
            ) {
              error = "Usuario o contraseña no validos";
            } else {
              error = err.code;
            }

            loadingEl.dismiss();
            this.logger.logEvent(
              `Failed to log in: ${err.code}`,
              4,
              "authService login"
            );
            this.alertService.loginError(error);
          });
      });
  }

  recuperarpass(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email)
      .then(function(){
        alert('Se ha enviado un correo al email introducido con los pasos a seguir para restablecer tu contraseña.');
      }, function (error) {
        console.log(error);
        alert('Este email no se encuentra registrado. Intentelo de nuevo con uno que sí lo esté.')
    })
  }
  newpass(actionCode: string, newpassword: string, repeatpassword: string) {
    this.afAuth.auth.verifyPasswordResetCode(actionCode)
    .then(()=>{
      if (newpassword == repeatpassword){
    
        this.afAuth.auth.confirmPasswordReset(actionCode, newpassword)
          .then(()=>{
            alert('Contraseña cambiada con exito.')
          },  error =>{
            console.log(error);
            alert('Algo ha salido mal. Por favor intentelo de nuevo.')
        })
      }else{
        alert('Las contraseñas no coinciden');
      }
    })
  }


  linkWithFacebook() {
    const provider = new auth.FacebookAuthProvider();
    this.afAuth.auth.currentUser.linkWithPopup(provider);
  }

  linkWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.currentUser.linkWithPopup(provider);
  }

  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then((val) => {
      if (val.additionalUserInfo.isNewUser) {
        val.user.delete();
        this.alertController
          .create({
            header: "No se ha podido iniciar sesion",
            message: "No tiene una cuenta",
            buttons: [
              {
                text: "Aceptar",
                role: "cancel",
              },
            ],
          })
          .then((alert) => {
            alert.present();
            this.logger.logEvent(
              `Sign in with Google failed, no account linked`,
              4,
              "authService signInWithGoogle"
            );
          });
      } else {
        this.logger.logEvent(
          `Signed in with Google: ${val.user.uid}`,
          3,
          "authService signInWithGoogle"
        );
        this.router.navigateByUrl("/home");
      }
    });
  }

  signInWithFacebook() {
    const provider = new auth.FacebookAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then((val) => {
      if (val.additionalUserInfo.isNewUser) {
        val.user.delete();
        this.alertController
          .create({
            header: "No se ha podido iniciar sesion",
            message: "No tiene una cuenta",
            buttons: [
              {
                text: "Aceptar",
                role: "cancel",
              },
            ],
          })
          .then((alert) => {
            alert.present();
            this.logger.logEvent(
              `Sign in with Facebook failed, no account linked`,
              4,
              "authService signInWithFacebook"
            );
          });
      } else {
        this.logger.logEvent(
          `Signed in with Facebook: ${val.user.uid}`,
          3,
          "authService signInWithFacebook"
        );
        this.router.navigateByUrl("/home");
      }
    });
  }

  getSignInMethods() {
    return this.afAuth.auth.currentUser.providerData;
  }

  async updateProfile(newData) {
    // idFecha viejo -> nuevo
    const reauthentication = await this.alertService.reauthenticateAlert();
    if (!reauthentication) {
      this.alertService.loginError("Contraseña incorrecta");
      return;
    }

    const user = await this.afs
      .doc<User>(`users/${this.userUid}`)
      .valueChanges()
      .pipe(take(1))
      .toPromise();

    this.afs.doc(`users/${this.userUid}`).update({
      DNI: newData.DNI,
      nombre: newData.nombre,
      countryCode: newData.country,
      horario: newData.horarioCF,
      localizacionCasa: { lat: newData.latPersona, lon: newData.lonPersona },
    });
    this.getStepsWorkUser(newData.latPersona, newData.lonPersona, user.empresa, this.userUid);

    const phoneStatus = await this.changePhone(
      newData.telefono,
      newData.country
    ).catch((err) => {
      if (err.error.text === "Done") {
        this.afs.doc(`users/${this.userUid}`).update({
          telefono: newData.telefono,
          countryCode: newData.country,
        });

        return "success";
      } else if (
        err.error.text ===
        "Error: Error: The user with the provided phone number already exists."
      ) {
        this.alertService.presentAlertError("Telefono en uso", "modal");
        return "error";
      }
    });
    if (phoneStatus === "error") return;

    const emailStatus = await this.changeEmail(newData.email).catch((err) => {
      if (err.error.text === "Done") {
        this.afs.doc(`users/${this.userUid}`).update({
          telefono: newData.telefono,
          countryCode: newData.country,
        });

        return "success";
      } else if (err.error.code === "auth/email-already-exists") {
        this.alertService.presentAlertError("Correo en uso", "modal");
        return "error";
      }
    });
    if (emailStatus === "error") return;

    if (newData.password) {
      this.changePassword(newData.password);
    }

    this.alertService.presentToastSinError(
      "Perfil editado",
      `El perfil de ${newData.nombre} ha sido correctamente editado`,
      "modal"
    );

    this.updateHistory(newData, user);
    this.logger.logEvent(
      `User ${user.uid} updated profile`,
      3,
      "authService updateProfile"
    );
  }

  updateBusiness(newData) {
    try {
      this.afs
        .doc<Empresa>(`empresas/${newData.CIF}`)
        .valueChanges()
        .pipe(take(1))
        .subscribe((empresa) => {
          console.log(newData);
          this.afs.doc(`empresas/${newData.CIF}`).update({
            Nombre: newData.Nombre,
            id: newData.CIF,
            loc: [Number(newData.latEmpresa), Number(newData.lonEmpresa)],
            distancia: newData.distancia,
          });

          //this.afs.collection(`users/${this.userUid}/historicoDatos`).add(previousDoc);
          // this.updateHistory(newData, user);
          // this.logger.logEvent(`User ${user.uid} updated profile`, 3, 'authService updateProfile')
        });
      this.getStepsWorkEmpresa(
        newData.latEmpresa,
        newData.lonEmpresa,
        newData.CIF
      );
      this.alertService.presentToastSinError(
        "Empresa actualizada",
        "Empresa actualizada con exito",
        "modal"
      );
    } catch (error) {
      console.log(error);
      // this.logger.logEvent(`${this.userUid}: ${error}`, 4, 'authService updateProfile')
    }
  }

  private updateHistory(newData, previousData) {
    let changes = {};
    if (newData.DNI !== previousData.DNI) {
      changes = { ...changes, "-DNI": previousData.DNI, "+DNI": newData.DNI };
    }

    if (newData.nombre !== previousData.nombre) {
      changes = {
        ...changes,
        "-nombre": previousData.nombre,
        "+nombre": newData.nombre,
      };
    }

    if (newData.country !== previousData.countryCode) {
      changes = {
        ...changes,
        "-country": previousData.countryCode,
        "+country": newData.country,
      };
    }

    if (newData.telefono !== previousData.telefono) {
      changes = {
        ...changes,
        "-telefono": previousData.telefono,
        "+telefono": newData.telefono,
      };
    }

    if (newData.DNI !== previousData.DNI) {
      changes = { ...changes, "-DNI": previousData.DNI, "+DNI": newData.DNI };
    }

    const currentDate = new Date().toString();
    this.afs
      .collection(`users/${this.userUid}/historicoDatos`)
      .doc(currentDate)
      .set(changes);
  }

  private changePassword(newPassword: string) {
    this.afAuth.auth.currentUser.updatePassword(newPassword);
  }

  private changeEmail(newEmail: string) {
    return this.afAuth.auth.currentUser.updateEmail(newEmail);
  }

  private changePhone(newPhone: string, newCountry: string) {
    return this.http
      .post("https://us-central1-fichaje-uni.cloudfunctions.net/updatePhone", {
        tel: newPhone,
        country: newCountry,
        uid: this.afAuth.auth.currentUser.uid,
      })
      .toPromise();
  }
  crearHorario(dataHorario, cif) {
    dataHorario.forEach((horario) => {
      let stringId =
        horario.horaEntrada.replace(":", "") +
        "_" +
        horario.horaSalida.replace(":", "") +
        "_" +
        horario.numPausas +
        "_" +
        horario.timePausa;
      this.afs.doc(`empresas/${cif}/horarios/${stringId}`).set({
        horaEntrada: horario.horaEntrada,
        horaSalida: horario.horaSalida,
        pausas: {
          num: horario.numPausas,
          tiempo: horario.timePausa,
        },
        code: stringId,
      });
    });
  }
  createHorario(data) {
    let stringId =
      data.horaEntrada.replace(":", "") +
      "_" +
      data.horaSalida.replace(":", "") +
      "_" +
      data.numPausas +
      "_" +
      data.timePausa;

    this.user.pipe(take(1)).subscribe((user) => {
      this.afs.doc(`empresas/${user.empresa}/horarios/${stringId}`).set({
        horaEntrada: data.horaEntrada,
        horaSalida: data.horaSalida,
        pausas: {
          num: data.numPausas,
          tiempo: data.timePausa,
        },
        code: stringId,
      });
    });
  }

  logout() {
    this.afAuth.auth
      .signOut()
      .then((val) => {
        this.router.navigateByUrl("auth");
        this.logger.logEvent(
          `User ${this.userUid} logged out`,
          3,
          "authService logout"
        );
      })
      .catch((err) => {
        this.logger.logEvent(err, 4, "authService logout");
      });
  }
  getStepsWorkUser(latInicio, lonInicio, CIF, uid) {
    const directionsService = new google.maps.DirectionsService();
    this.afs
      .doc<Empresa>(`empresas/${CIF}`)
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .then((empresa) => {
        
        directionsService.route(
          {
            origin: { lat: latInicio, lng: lonInicio },
            destination: { lat: Number(empresa.loc[0]), lng: Number(empresa.loc[1]) },
            waypoints: [],
            optimizeWaypoints: true,
            travelMode: "DRIVING",
          },
          (response, status) => {
            if (status === "OK") {
              var docSteps: Array<any> = [];
              var steps = response["routes"][0]["legs"][0]["steps"];
              for (var i = 0; i < steps.length; i++) {
                var doc = {};
                doc["duracion"] = steps[i]["duration"]["value"];
                doc["inicio"] = {
                  lat: steps[i]["start_location"].lat(),
                  lon: steps[i]["start_location"].lng(),
                };
                doc["final"] = {
                  lat: steps[i]["end_location"].lat(),
                  lon: steps[i]["end_location"].lng(),
                };
                docSteps.push(doc);
              }

              this.afs.doc(`users/${uid}`).update({
                stepsToWork: docSteps,
              });
            } else {
              console.log("Directions request failed due to " + status);
            }
          }
        );
      });
  }
  getStepsWorkEmpresa(latLlegada, lonLlegada, CIF) {
    const directionsService = new google.maps.DirectionsService();
    this.afs
      .collection<User>(`users`, (ref) => ref.where("empresa", "==", CIF))
      .valueChanges()
      .pipe()
      .toPromise()
      .then((users) => {
        users.forEach((user) => {
          directionsService.route(
            {
              origin: {
                lat: user.localizacionCasa.lat,
                lng: user.localizacionCasa.lon,
              },
              destination: { lat: Number(latLlegada), lng: Number(lonLlegada) },
              waypoints: [],
              optimizeWaypoints: true,
              travelMode: "DRIVING",
            },
            (response, status) => {
              if (status === "OK") {
                var docSteps: Array<any> = [];
                var steps = response["routes"][0]["legs"][0]["steps"];
                for (var i = 0; i < steps.length; i++) {
                  var doc = {};
                  doc["duracion"] = steps[i]["duration"]["value"];
                  doc["inicio"] = {
                    lat: steps[i]["start_location"].lat(),
                    lon: steps[i]["start_location"].lng(),
                  };
                  doc["final"] = {
                    lat: steps[i]["end_location"].lat(),
                    lon: steps[i]["end_location"].lng(),
                  };
                  docSteps.push(doc);
                }

                this.afs.doc(`users/${user.uid}`).update({
                  stepsToWork: docSteps,
                });
              } else {
                console.log("Directions request failed due to " + status);
              }
            }
          );
        });
      });
  }
}
