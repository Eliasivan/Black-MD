import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import chalk from 'chalk';
import readline from 'readline';

// Función principal
(async () => {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');

        // Crear socket de WhatsApp
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: true, // Activar QR
        });

        // Interfaz de entrada para solicitar el número
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const question = (texto) => new Promise((resolve) => rl.question(texto, resolve));

        const requestPairingCode = async () => {
            try {
                // Solicitar el número de WhatsApp
                const addNumber = await question(chalk.bold.cyan('Ingrese el número de WhatsApp (+57321XXXXXXX): '));
                const pairingCode = await sock.requestPairingCode(addNumber.replace(/\D/g, ''));
                const formattedCode = pairingCode.match(/.{1,4}/g).join('-'); // Formatear el código en bloques de 4 dígitos
                console.log(chalk.bold.green(`Código de vinculación generado: ${formattedCode}`));

                // Mostrar mensaje de conexión al poner el código
                console.log(chalk.bgMagenta.white(`
    ╭───────────────────────────────╮
    │ ✨ ¡Conectado! 🎉             │
    │ Tu bot está vinculado con    │
    │ éxito a WhatsApp.            │
    │ ¡Gracias por usar Goku-Black │
    │ Bot-MD-Lite!                 │
    │ 🥂 ¡Disfrútalo al máximo!     │
    ╰───────────────────────────────╯
                `));
            } catch (error) {
                console.error(chalk.bold.red('Error al generar el código de vinculación:'), error.message);

                if (error.isBoom && error.output?.statusCode === 428) {
                    console.log(chalk.bold.yellow('Conexión cerrada, intentando reconectar...'));
                    startSocket(); // Reconexión automática
                }
            } finally {
                rl.close();
            }
        };

        // Manejo de eventos de conexión
        sock.ev.on('connection.update', (update) => {
            const { connection, qr } = update;

            if (connection === 'open') {
                console.log(chalk.bgGreen.white(`
    ╭───────────────────────────────╮
    │ ✨ ¡Conectado! 🎉             │
    │ Tu bot está vinculado con    │
    │ éxito a WhatsApp.            │
    │ ¡Gracias por usar Goku-Black │
    │ Bot-MD-Lite!                 │
    │ 🥂 ¡Disfrútalo al máximo!     │
    ╰───────────────────────────────╯
                `));
            }

            if (qr) {
                console.log(chalk.bold.yellow('Escanea el código QR para vincular tu bot.'));
            }
        });

        // Solicitar el código de vinculación o escaneo de QR
        const methodChoice = await question(chalk.bold.cyan('Seleccione el método de vinculación:\n1. Escanear QR\n2. Código de 8 dígitos\n--> '));

        if (methodChoice === '2') {
            await requestPairingCode();
        } else if (methodChoice === '1') {
            console.log(chalk.bold.green('Generando código QR, escanéalo desde tu dispositivo.'));
        } else {
            console.log(chalk.bold.red('Opción inválida. Por favor, seleccione 1 o 2.'));
            rl.close();
        }
    } catch (error) {
        console.error(chalk.bold.red('Error al iniciar el bot:'), error);
    }
})();