import nodemailer from "nodemailer";
const { RUN_MODE, API_URL, MAILER_HOST, MAILER_PORT, MAILER_SECURE, MAILER_USER, MAILER_PASS } = process.env;

let baseURL = "http://localhost:3000"

if (RUN_MODE === 'PROD') {
    baseURL = API_URL;
}

const transporter = nodemailer.createTransport({
    host: MAILER_HOST,
    // 465
    port: MAILER_PORT,
    // true (if port 465 only)
    secure: MAILER_SECURE,
    auth: {
        user: MAILER_USER,
        pass: MAILER_PASS,
    },
});

async function sendMail(emailData) {
    return await transporter.sendMail(emailData);
}

async function sendVerificationEmail(email, verificationToken) {
    return await transporter.sendMail( {
        from: "verification@epowhost.com",
        to: email,
        subject: "Please verify your email",
        text: `Please click to this link to confirm your email: ${baseURL}/auth/verify/${verificationToken}`,
        html: `<a target="_blank" href="${baseURL}/auth/verify/${verificationToken}">Please click here to confirm your email</a>`
    });
}

export default {
    sendMail,
    sendVerificationEmail
}