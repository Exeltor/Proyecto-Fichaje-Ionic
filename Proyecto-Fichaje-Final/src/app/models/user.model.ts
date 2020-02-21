export interface User {
    uid: string;
    nombre: string;
    DNI: string;
    empresa: string;
    admin: boolean;
    telefono: string;
    countryCode: string;
    horasDiarias: number;
    countryCode: string;
}
// un usuario no necesita mas campos pero hay que relacionarle un horario
// o al menos las horas a las que entra
