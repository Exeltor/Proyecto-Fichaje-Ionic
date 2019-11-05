import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
const corsHandler = cors({ origin: '*' });
admin.initializeApp(functions.config().firebase);

exports.register = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    if (request.method !== 'POST') {
      response.status(400).send('400');
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
        response.send('Error: ' + error);
        console.log('Error creating new user:', error);
        return 1;
      });

    return 1;
  });
});

exports.calculateHours = functions.firestore
  .document('users/{userid}/asistenciaTrabajo/{fecha}')
  .onWrite((change, context) => {
    const horaInicio = change.after.get('horaInicio');
    const horasPause = change.after.get('horasPausa');
    const horasResume = change.after.get('horasResume');
    const horaFin = change.after.get('horaFin');
    let horaTotal = 0;
    console.log(horasPause);
    console.log(horasResume);
    if (!horasResume) {
      if (!horasPause) {
        if (horaFin) {
          horaTotal += horaFin - horaInicio;
        }
      } else {
        horaTotal += horasPause[0] - horaInicio;
      }
    } else {
      if (horasPause.length > horasResume.length) {
        for (let i = 0; i < horasPause.length; i++) {
          switch (i) {
            case 0:
              horaTotal += horasPause[i] - horaInicio;
              break;
            default:
              horaTotal += horasPause[i] - horasResume[i - 1];
              break;
          }
        }
      } else {
        for (let i = 0; i < horasPause.length; i++) {
          switch (i) {
            case 0:
              horaTotal += horasPause[i] - horaInicio;
              break;
            case horasPause.length - 1:
              horaTotal += horaFin - horasResume[i];
              break;
            default:
              horaTotal += horasPause[i] - horasResume[i - 1];
              break;
          }
        }
      }
    }

    for (let i = 0; i < horasPause.length; i++) {
      switch (i) {
        case 0:
          break;
        case horasPause.length - 1:
          break;
        default:
          break;
      }
    }

    const data = {
      horaTotal
    };

    change.after.ref
      .update(data)
      .then(onfulfilled => {
        console.log('Horas totales actualizadas', onfulfilled);
        return 1;
      })
      .catch(onrejected => {
        console.log('No actualizado', onrejected);
        return 0;
      });
  });
