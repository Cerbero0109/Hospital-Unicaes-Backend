const db = require('../database/conexion');
const bcrypt = require('bcrypt');
const Usuario = {};

    // Login 
    // Usuario.loginUsuario = (email, password, callback) => {
    //     const sql = `CALL sp_loginUsuario(?, ?)`;
    //     db.query(sql, [email, password], (err, result) => {
    //         if (err) {
    //             return callback(err, null);
    //         }
          
    //         const data = result[0];
    //         callback(null, data);
    //     });
    // }

//LOGIN CON ENCRIPTACION

Usuario.loginUsuario = (email, callback) => {
    const sql = `CALL sp_loginUsuarioV02(?)`; 
    db.query(sql, [email], (err, result) => {
        if (err) {
            return callback(err, null);
        }

        const data = result[0];
        callback(null, data);
    });
};



    // Listar usuarios
Usuario.listarUsuarios = (callback) => {
    const sql = `SELECT u.id_usuario, u.nombre, u.apellido,u.dui, u.direccion, u.email,u.telefono,u.fecha_nacimiento, u.sexo, u.numero_seguro_social, r.nombre_rol, e.nombre_especialidad, a.nombre_area, u.estado FROM usuario u JOIN rol r ON u.id_rol = r.id_rol join area a on u.id_area = a.id_area LEFT JOIN especialidad e ON u.id_especialidad = e.id_especialidad where u.estado = 'activo' `;


    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al listar los usuarios:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};


//listar usuarios en base al id

Usuario.ListarUsuarioById = (id, callback) => {

    const sql = `CALL sp_ListarUsuarios(?)`;
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error al listar el usuario:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });

}

Usuario.insertarUsuario= (usuarioData, callback) => {
    const sql = `CALL sp_InsertarUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const {
        nombre,
        apellido,
        dui,
        telefono,
        email,
        password,
        direccion,
        fecha_nacimiento,
        sexo,
        numero_seguro_social,
        id_rol,
        id_especialidad,
        id_area
    } = usuarioData;

    db.query(sql, [
        nombre,
        apellido,
        dui,
        telefono,
        email,
        password,
        direccion,
        fecha_nacimiento,
        sexo,
        numero_seguro_social,
        id_rol,
        id_especialidad,
        id_area
    ], (err, result) => {
        if (err) {
            console.error("Error al insertar el usuario:", err);
            return callback(err, null);
        }

        return callback(null, result);
    });
};





Usuario.actualizarUsuario = (id, usuarioData, callback) => {
    const sql = `CALL sp_ActualizarUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const {
        nombre,
        apellido,
        dui,
        telefono,
        email,
        password,
        direccion,
        fecha_nacimiento,
        sexo,
        numero_seguro_social,
        id_rol,
        id_especialidad,
        id_area
    } = usuarioData;

    db.query(sql, [
        id,
        nombre,
        apellido,
        dui,
        telefono,
        email,
        password,
        direccion,
        fecha_nacimiento,
        sexo,
        numero_seguro_social,
        id_rol,
        id_especialidad,
        id_area
    ], (err, result) => {
        if (err) {
            console.error("Error al actualizar el usuario:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

// Cambiar estado de un usuario, metodo DELETE pero solo cambio de estado,  no elimina registros (no es recomendado)
Usuario.cambiarEstadoUsuario = (id, callback) => {
    const sql = `UPDATE usuario SET estado = 'inactivo' WHERE id_usuario = ?`;
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.error("Error al cambiar el estado del usuario:", error);
            callback(error, null);
        } else {
            callback(null, result);
        }
    });
};





module.exports = Usuario;
