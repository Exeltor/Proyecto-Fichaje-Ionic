export interface User {
    nombre: string;
    apellidos: string;
    dni: string;
    fechaNacimiento: Date;
    empresa: string;
    admin: boolean;
}
// un usuario no necesita mas campos pero hay que relacionarle un horario
// o al menos las horas a las que entra
