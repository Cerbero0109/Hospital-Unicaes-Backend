const Usuario = require('../models/UsuarioModel');
const bcrypt = require('bcrypt');


// Metodo Read: Listar usuarios (activos)
exports.listarUsuarios = (req, res) => {
    Usuario.listarUsuarios((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los usuarios", error: err });
        }

        res.status(200).json(results);
    });
};


//listar usuarios by id
exports.listarUsuarioById = (req, res) => {
    const id = req.params.id;

    Usuario.ListarUsuarioById(id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar el usuario, seleccionado", error: err });
        }
        res.status(200).json(result);
    });
};



//METODO INSERT CON ENCRIPTACION:

exports.insertarUsuario = async (req, res) => {
    const usuarioData = req.body;

    try {
        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(usuarioData.password, saltRounds);

        // Reemplazar la contraseña con la encriptada
        usuarioData.password = hashedPassword;

        // Llamar al método de inserción
        Usuario.insertarUsuario(usuarioData, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error al registrar el usuario", error: err });
            }

            res.status(200).json({ message: "Usuario registrado" });
        });
    } catch (error) {
        res.status(500).json({ message: "Error al encriptar la contraseña", error });
    }
};


//Metodo Update
// exports.actualizarUsuario = (req, res) => {
//     const usuarioData = req.body;
//     const id = req.params.id;

//     Usuario.actualizarUsuario(id, usuarioData, (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: "Error al actualizar el usuario", error: err });
//         }
//         res.status(200).json({ message: "Usuario actualizado" });
//     });
// };


exports.actualizarUsuario = async (req, res) => {
    const usuarioData = req.body;
    const id = req.params.id;
  
    try {

        if (usuarioData.fecha_nacimiento) {
            usuarioData.fecha_nacimiento = usuarioData.fecha_nacimiento.split("T")[0];
          }
          
      // Encriptar la contraseña si se proporciona una nueva
      if (usuarioData.password) {
        const saltRounds = 10;
        usuarioData.password = await bcrypt.hash(usuarioData.password, saltRounds);
      }
  
      Usuario.actualizarUsuario(id, usuarioData, (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error al actualizar el usuario", error: err });
        }
        res.status(200).json({ message: "Usuario actualizado" });
      });
    } catch (error) {
      res.status(500).json({ message: "Error al encriptar la contraseña", error });
    }
  };


// Cambiar estado del usuario, metodo DELETE
exports.cambiarEstadoUsuario = (req, res) => {
    const id = req.params.id;  // Extrayendo el id de la URL

    // Realiza la actualización del estado del usuario
    Usuario.cambiarEstadoUsuario(id, (error, result) => {
        if (error) {
            return res.status(500).json({ message: "Error al cambiar el estado del usuario", error });
        }
        res.status(200).json({ message: "Estado cambiado a inactivo correctamente" });
    });
};


