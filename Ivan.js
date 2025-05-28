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
            printQRInTerminal: false, // Se desactiva el QR
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
                const formattedCode = pairingCode.match(/.{1,4}/g).join('-'); // Formatea el código en bloques de 4 dígitos
                console.log(chalk.bold.green(`Código de vinculación generado: ${formattedCode}`));

                // Mostrar carta de felicitación cuando esté vinculado
                console.log(chalk.bgMagenta.white(`
    ╭───────────────────────────────╮
    │ ✨ ¡Felicidades! 🎉           │
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

        // Solicitar el código de vinculación
        await requestPairingCode();

        console.log(chalk.bold.green('Bot iniciado correctamente.'));
    } catch (error) {
        console.error(chalk.bold.red('Error al iniciar el bot:'), error);
    }
})();