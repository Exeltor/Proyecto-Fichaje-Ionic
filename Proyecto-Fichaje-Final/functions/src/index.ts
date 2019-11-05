import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
const corsHandler = cors({origin: '*'});
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

exports.calculateHours = functions.firestore.document('users/{userid}/asistenciaTrabajo/{fecha}').onWrite((change, context) => {
  
});
