"use strict"

// --- Importar módulos ---
// Paquete
const express = require("express");

// --- Crear router ---
const RouterPrototipo = express.Router();

// Obtener pool
function routerConfig(conPro) {
    console.log("Hola Router");

    // // --- Peticiones GET ---
    // // Inicio
    // RouterPrototipo.get("/inicio", mesController.unreadMessages, useController.adminIndex);

    // // Configuración
    // RouterPrototipo.get("/configuracion", mesController.unreadMessages, uniController.adminSettings);

    // // Usuarios
    // RouterPrototipo.get("/usuarios",  mesController.unreadMessages, useController.users);

    // // Instalaciones
    // RouterPrototipo.get("/instalaciones", mesController.unreadMessages, facController.facilities);

    // // Reservas
    // RouterPrototipo.get("/reservas", mesController.unreadMessages, resController.reservations);

    // // --- Peticiones POST ---
    // // Cambiar configuración
    // RouterPrototipo.post(
    //   "/cambiarConfiguracion",
    //   multerFactory.single("settingsPic"),       
    //   // Ninguno de los campos vacíos 
    //   check("settingsName", "1").notEmpty(),
    //   check("settingsAddress", "1").notEmpty(),
    //   check("settingsWeb", "1").notEmpty(),
    //   // Regex web correcto
    //   check("settingsWeb", "13").isURL(),
    //   mesController.unreadMessages,  
    //   uniController.changeSettings  
    // );
    
    // // Filtrar reservas
    // RouterPrototipo.post("/filtrarReservas", mesController.unreadMessages, resController.filter);

    // // Validar usuario
    // RouterPrototipo.post(
    //   "/validar",
    //   // ID no vacío 
    //   check("idUser", "1").notEmpty(),
    //   // ID es un número
    //   check("idUser", "-5").isNumeric(),
    //   useController.validate
    // );

    // // Hacer admin
    // RouterPrototipo.post(
    //   "/hacerAdmin",
    //   // ID no vacío 
    //   check("idUser", "1").notEmpty(),
    //   // ID es un número
    //   check("idUser", "-5").isNumeric(),
    //   useController.makeAdmin
    // );

    // // Banear
    // RouterPrototipo.post(
    //   "/expulsar",
    //   // ID no vacío 
    //   check("idUser", "1").notEmpty(),
    //   // ID es un número
    //   check("idUser", "-5").isNumeric(),
    //   useController.ban
    // );

    // // Crear instalación
    // RouterPrototipo.post(
    //   "/crearInstalacion",
    //   multerFactory.single("facilityPic"),
    //   // Campos no vacios
    //   check("name","1").notEmpty(),
    //   check("startHour","1").notEmpty(),
    //   check("endHour","1").notEmpty(),
    //   check("reservationType","1").notEmpty(),
    //   check("capacity","1").notEmpty(),
    //   check("facilityType","1").notEmpty(),
    //   // Tipo no es "newType"
    //   check("facilityType","42").custom((type) => {
    //     return type !== "newType";
    //   }),
    //   // Horas exactas
    //   check("startHour", "27").custom((startHour) => {
    //      let min = (startHour.split(":"))[1];
    //      return min === "00";
    //   }),
    //   check("endHour", "27").custom((startHour) => {
    //     let min = (startHour.split(":"))[1];
    //     return min === "00";
    //  }),
    //  // Tipo de reserva válido
    //  check("reservationType","32").custom((resType) => {
    //     return (resType === "Individual" || resType === "Colectiva")
    //  }),
    //  // Aforo es un número
    //  check("capacity", "28").isNumeric(),
    //  // Aforo > 0
    //  check("capacity", "28").custom((capacity) => {
    //     return capacity > 0;
    //  }),
    //   facController.newFacility
    // );

    // // Editar instalación
    // RouterPrototipo.post(
    //   "/editarInstalacion",
    //   multerFactory.single("facilityPic"),
    //   // Campos no vacios
    //   check("name","1").notEmpty(),
    //   check("idFacility", "1").notEmpty(),
    //   check("idFacilityType", "1").notEmpty(),
    //   // ID es un número
    //   check("idFacility", "-5").isNumeric(),
    //   check("idFacilityType", "-5").isNumeric(),
    //   facController.editFacility
    // );

    // // Crear tipo de instalación
    // RouterPrototipo.post(
    //   "/crearTipo",
    //   multerFactory.single("facilityTypePic"),
    //   // Campos no vacios
    //   check("name","1").notEmpty(),
    //   facController.newType
    // );

}

module.exports = {
    RouterPrototipo: RouterPrototipo,
    routerConfig: routerConfig
};