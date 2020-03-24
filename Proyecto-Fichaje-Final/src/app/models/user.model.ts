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
    horario?:string;
    localizacionCasa: {lat: any, lon: any}
    photoUrl?: string;
}
