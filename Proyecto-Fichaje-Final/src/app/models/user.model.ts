export interface User {
    uid: string;
    nombre: string;
    DNI: string;
    empresa: string;
    admin: boolean;
    superadmin: boolean;
    telefono: string;
    countryCode: string;
    horasDiarias: number;
    localizacionCasa: {lat: any, lon: any}
}
// un usuario no necesita mas campos pero hay que relacionarle un horario
// o al menos las horas a las que entra
