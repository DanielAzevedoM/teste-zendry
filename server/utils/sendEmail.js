import nodemailer from 'nodemailer';

// Configura o "transportador" de e-mail usando as credenciais do .env
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Porta para SSL
    secure: true, // `true` para porta 465, `false` para outras como a 587
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const sendEmail = async ({ to, subject, html }) => {
    try {
        console.log(`[EMAIL] Tentando enviar e-mail para: ${to}`);
        const info = await transporter.sendMail({
            from: `"Seu E-commerce" <${process.env.GMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html,
        });

        console.log("✅ E-mail real enviado com sucesso! Message ID:", info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error("❌ Erro CRÍTICO ao enviar e-mail real:", error);
        // Em um ambiente de produção, você poderia logar isso em um serviço de monitoramento.
        return { success: false, error: error.message };
    }
};