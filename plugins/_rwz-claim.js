import sistemaArchivos from 'fs';
import cargarEntorno from 'dotenv';
cargarEntorno.config();

const CLAVE_SECRETA = process.env.SECRET_KEY;
const rastreadorTiempos = {};

const guardarDatos = (datos) => {
    sistemaArchivos.writeFileSync('base_de_datos.json', JSON.stringify(datos, null, 2));
};

const validarEntorno = () => {
    try {
        const informacionPaquete = JSON.parse(sistemaArchivos.readFileSync('./metadata.json', 'utf-8'));
        return (
            informacionPaquete.name === "Goku-Black-Bot-MD" &&
            informacionPaquete.repository.url === 'https://github.com/Eliasivan/Goku-Black-Bot-MD.git' &&
            CLAVE_SECRETA === "ir83884kkc82k393i48"
        );
    } catch (error) {
        console.error("Error al leer metadata.json:", error);
        return false;
    }
};

const manejador = async (mensaje, { conexion }) => {
    if (!mensaje.citado) return;

    if (!validarEntorno()) {
        await conexion.responder(
            mensaje.chat,
            "🚫 Este comando está restringido para los usuarios del Goku-Black-Bot-MD.\n🔗 Visita: https://github.com/Eliasivan/Goku-Black-Bot-MD",
            mensaje
        );
        return;
    }

    const idUsuario = mensaje.remitente;
    const idExtraido = mensaje.citado.texto.match(/<id:(.*)>/)?.[1];
    let baseDeDatos = sistemaArchivos.existsSync('base_de_datos.json')
        ? JSON.parse(sistemaArchivos.readFileSync('base_de_datos.json', 'utf-8'))
        : { usuarios: {}, personajesReservados: [] };

    if (!idExtraido) return;

    const personajeObjetivo = baseDeDatos.personajesReservados.find((item) => item.id === idExtraido);
    const tiempoActual = Date.now();
    const ultimoUso = rastreadorTiempos[idUsuario] || 0;

    if (tiempoActual - ultimoUso < 600000) {
        const tiempoRestante = 600000 - (tiempoActual - ultimoUso);
        const minutos = Math.floor(tiempoRestante / 60000);
        const segundos = Math.floor((tiempoRestante % 60000) / 1000);
        await conexion.responder(
            mensaje.chat,
            `⏳ Por favor espera antes de usar este comando nuevamente.\nTiempo restante: ${minutos} minutos y ${segundos} segundos.`,
            mensaje
        );
        return;
    }

    if (!personajeObjetivo) {
        await conexion.responder(
            mensaje.chat,
            "❌ Lo siento, este personaje no está disponible en este momento.",
            mensaje,
            { menciones: [idUsuario] }
        );
        return;
    }

    const esPropiedadDeAlguien = baseDeDatos.usuarios[personajeObjetivo.userId]?.personajes?.some(
        (personaje) => personaje.url === personajeObjetivo.url
    );

    if (esPropiedadDeAlguien) {
        await conexion.responder(
            mensaje.chat,
            `❌ El personaje ${personajeObjetivo.nombre} ya pertenece a otro usuario. ¡Intenta con otro comando!`,
            mensaje,
            { menciones: [idUsuario] }
        );
        rastreadorTiempos[idUsuario] = tiempoActual;
        return;
    }

    if (personajeObjetivo.userId !== idUsuario) {
        setTimeout(async () => {
            const exito = Math.random() < 0.5;

            if (exito) {
                if (!baseDeDatos.usuarios[idUsuario]) {
                    baseDeDatos.usuarios[idUsuario] = { personajes: [], conteo: 0, puntosTotales: 0 };
                }

                baseDeDatos.usuarios[idUsuario].personajes.push({
                    nombre: personajeObjetivo.nombre,
                    url: personajeObjetivo.url,
                    valor: personajeObjetivo.valor,
                });

                if (baseDeDatos.usuarios[personajeObjetivo.userId]) {
                    baseDeDatos.usuarios[personajeObjetivo.userId].personajes = baseDeDatos.usuarios[
                        personajeObjetivo.userId
                    ].personajes.filter((personaje) => personaje.url !== personajeObjetivo.url);
                }

                baseDeDatos.personajesReservados = baseDeDatos.personajesReservados.filter(
                    (item) => item.id !== idExtraido
                );

                guardarDatos(baseDeDatos);

                const propietarioAnterior = personajeObjetivo.userId;
                await conexion.responder(
                    mensaje.chat,
                    `🎉 Felicidades @${idUsuario.split('@')[0]}, ¡has robado exitosamente a ${personajeObjetivo.nombre} de @${propietarioAnterior.split('@')[0]}!`,
                    mensaje,
                    { menciones: [idUsuario, propietarioAnterior] }
                );
            } else {
                const propietarioActual = personajeObjetivo.userId;
                await conexion.responder(
                    mensaje.chat,
                    `❌ No lograste robar el personaje ${personajeObjetivo.nombre} de @${propietarioActual.split('@')[0]}.`,
                    mensaje,
                    { menciones: [idUsuario, propietarioActual] }
                );
            }

            rastreadorTiempos[idUsuario] = tiempoActual;
        });
        return;
    }

    if (!baseDeDatos.usuarios[idUsuario]) {
        baseDeDatos.usuarios[idUsuario] = { personajes: [], conteo: 0, puntosTotales: 0 };
    }

    const personajesUsuario = baseDeDatos.usuarios[idUsuario];
    const yaPosee = personajesUsuario.personajes.some(
        (personaje) => personaje.url === personajeObjetivo.url
    );

    if (yaPosee) {
        await conexion.responder(
            mensaje.chat,
            `🎉 ¡Ya posees al personaje ${personajeObjetivo.nombre}!`,
            mensaje,
            { menciones: [idUsuario] }
        );
        return;
    }

    personajesUsuario.personajes.push({
        nombre: personajeObjetivo.nombre,
        url: personajeObjetivo.url,
        valor: personajeObjetivo.valor,
    });
    personajesUsuario.conteo++;
    personajesUsuario.puntosTotales += personajeObjetivo.valor;

    baseDeDatos.usuarios[idUsuario] = personajesUsuario;
    baseDeDatos.personajesReservados = baseDeDatos.personajesReservados.filter(
        (item) => item.id !== idExtraido
    );

    guardarDatos(baseDeDatos);

    await conexion.responder(
        mensaje.chat,
        `🎉 Felicidades @${idUsuario.split('@')[0]}, ¡has reclamado exitosamente a ${personajeObjetivo.nombre}!`,
        mensaje,
        { menciones: [idUsuario] }
    );

    rastreadorTiempos[idUsuario] = tiempoActual;
};

manejador.ayuda = ['confirmar'];
manejador.etiquetas = ['diversión'];
manejador.comando = ['cz', 'confirmar'];
manejador.grupo = true;

export default manejador;