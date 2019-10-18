export interface User {
    uid: string;
    nombre: string;
    DNI: string;
    fechaNacimiento: Date;
    Nombre_Empresa: string;
    admin: boolean;
    telefono: string;
}
// un usuario no necesita mas campos pero hay que relacionarle un horario
// o al menos las horas a las que entra
