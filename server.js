const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes")
const rolRoutes = require("./routes/rolRoutes");
const areaRoutes = require("./routes/areaRoutes");
const especialidadRoutes = require("./routes/especialidadRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const tipoConsultaRoutes = require("./routes/tipoConsultaRoutes");
const estadoConsultaRoutes = require("./routes/estadoConsultaRoutes");
const consultaRoutes = require("./routes/consultaRoutes");
const detalleConsultaRoutes = require("./routes/detalleConsultaRoutes");
const historialMedicoRoutes = require("./routes/historialMedicoRoutes");
const examenRoutes = require("./routes/examenesRoutes");

// Middlewares
const { verificarNotificaciones } = require("./middlewares/notificacionesMiddleware");
 
// Rutas Modulo Farmacia
const categoriaMedicamentoRoutes = require("./routes/categoriaMedicamentoRoutes");
const presentacionMedicamentoRoutes = require("./routes/presentacionMedicamentoRoutes");
const proveedorRoutes = require("./routes/proveedorRoutes");
const medicamentoRoutes = require("./routes/medicamentoRoutes");
const stockRoutes = require("./routes/stockRoutes");
const notificacionesRoutes = require("./routes/notificacionesRoutes");
const despachoRoutes = require("./routes/despachoRoutes");
const inventarioMovimientosRoutes = require("./routes/inventarioMovimientosRoutes");


const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 día
    }
}));

// Rutas
app.use("/auth", authRoutes);
app.use("/pacientes", pacienteRoutes);
app.use("/roles", rolRoutes);
app.use("/areas", areaRoutes);
app.use("/especialidades", especialidadRoutes);
app.use("/usuarios", usuarioRoutes)
app.use("/tipos-consulta", tipoConsultaRoutes)
app.use("/estados-consulta", estadoConsultaRoutes)
app.use("/consultas", consultaRoutes);
app.use("/detalles-consultas", detalleConsultaRoutes);
app.use("/historiales-medicos", historialMedicoRoutes);
app.use("/examenes", examenRoutes);

// Rutas Modulo Farmacia 
app.use("/categorias-medicamento", categoriaMedicamentoRoutes);
app.use("/presentaciones-medicamento", presentacionMedicamentoRoutes);
app.use("/proveedores", proveedorRoutes);
app.use("/medicamentos", medicamentoRoutes);
app.use("/stock", stockRoutes);
app.use("/notificaciones", notificacionesRoutes);
app.use("/despacho", despachoRoutes);
app.use("/inventario-movimientos", inventarioMovimientosRoutes);


// Iniciar servidor
app.listen(8081, () => {
    console.log("Conexión exitosa en el puerto 8081");
});
