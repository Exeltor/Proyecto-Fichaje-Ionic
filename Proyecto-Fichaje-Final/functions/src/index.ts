import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import { Timestamp } from "@google-cloud/firestore";
const corsHandler = cors({ origin: "*" });
admin.initializeApp(functions.config().firebase);

exports.register = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    if (request.method !== "POST") {
      response.status(400).send("400");
      return 0;
    }

    const email = request.body.email;
    const pass = request.body.password;
    const tel = request.body.tel;

    admin
      .auth()
      .createUser({
        email: email,
        emailVerified: true,
        password: pass,
        phoneNumber: tel
      })
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        response.send({ uid: userRecord.uid });
        return 1;
      })
      .catch(function(error) {
        response.send("Error: " + error);
        console.log("Error creating new user:", error);
        return 1;
      });

    return 1;
  });
});

exports.calculateHours = functions.firestore
  .document("users/{userid}/asistenciaTrabajo/{fecha}")
  .onWrite((change, context) => {
    const user = context.params.userid;
    const horaInicio: Timestamp = change.after.get("horaInicio");
    const horasPause: Array<Timestamp> = change.after.get("horasPausa");
    const horasResume: Array<Timestamp> = change.after.get("horasResume");
    const horaFin: Timestamp = change.after.get("horaFin");
    let pauseReminder
    clearTimeout(pauseReminder);
    let horaTotal = 0;
    if (horasResume.length === 0) {
      if (horasPause.length === 0) {
        if (horaFin) {
          horaTotal += horaFin.seconds - horaInicio.seconds;
        }
      } else {
        horaTotal += horasPause[0].seconds - horaInicio.seconds;
      }
    } else {
      if (horasPause.length > horasResume.length) {
        pauseReminder = setTimeout(() => {
          admin.firestore().collection('devices').where('userId', '==', user).get().then(snapshot => {
            if (snapshot.empty) return;
            let deviceIds: Array<string> = []
            snapshot.forEach(doc => {
              deviceIds.push(doc.data().token);
            });
            const pauseMessage = {
              notification: {title: 'Sigues en descanso', body: 'Ya llevas 15 minutos descansando'},
              tokens: deviceIds
            }
            admin.messaging().sendMulticast(pauseMessage)
          })
        }, 900000)
        for (let i = 0; i < horasPause.length; i++) {
          if (i === 0) {
            horaTotal += horasPause[i].seconds - horaInicio.seconds;
          } else {
            horaTotal += horasPause[i].seconds - horasResume[i - 1].seconds;
          }
        }
      }
      if ((horasPause.length === horasResume.length) && horaFin) {
        for (let i = 0; i <= horasPause.length; i++) {
          if (i === 0) {
            horaTotal += horasPause[i].seconds - horaInicio.seconds;
          } else if (i === horasPause.length) {
            horaTotal += horaFin.seconds - horasResume[i - 1].seconds;
          } else {
            horaTotal += horasPause[i].seconds - horasResume[i - 1].seconds;
          }
        }
      }
      if((horasPause.length === horasResume.length) && !horaFin){
        for (let i = 0; i < horasPause.length; i++) {
          if (i === 0) {
            horaTotal += horasPause[i].seconds - horaInicio.seconds;
          } else {
            horaTotal += horasPause[i].seconds - horasResume[i - 1].seconds;
          }
        }
      }
    }
    const horaTotalDate = new Date("1970-01-01 00:00:00");
    horaTotalDate.setSeconds(horaTotalDate.getSeconds() + horaTotal);
    const data = {
      horaTotal: horaTotalDate
    };

    console.log("Horas totales", data.horaTotal);

    change.after.ref
      .update(data)
      .then(onfulfilled => {
        console.log("Horas totales actualizadas", onfulfilled);
        return 1;
      })
      .catch(onrejected => {
        console.log("No actualizado", onrejected);
        return 0;
      });
  });

  exports.updatePhone = functions.https.onRequest((request, response) => {
    corsHandler(request, response, () => {
      if (request.method !== "POST") {
        response.status(400).send("400");
        return 0;
      }
      const tel = request.body.tel;
      const country = request.body.country;
      const uid = request.body.uid;
  
      admin
        .auth()
        .updateUser(uid, {
          phoneNumber: `+${country}${tel}`
        })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          response.send('Done');
          return 1;
        })
        .catch(function(error) {
          response.send("Error: " + error);
          console.log("Error updating phone:", error);
          return 1;
        });
  
      return 1;
    });
  });
