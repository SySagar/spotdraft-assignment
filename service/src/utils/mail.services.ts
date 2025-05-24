import { resend } from "@config/resend"
import { FROM_MAIL, MAIL_SUBJECT } from "./const";

type SendEmailOptions = {
    to: string | string[];
    shareUrl: string;
};

export async function sendEmailToUser({ to, shareUrl }: SendEmailOptions) {

    const mailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px;">
    <p><strong>Hello! 👋</strong></p>
    
    <p>This is your shareable link: <a href="${shareUrl}" style="color: #2563c2;">${shareUrl}</a></p>
    
    <p>Thanks</p>
</body>
</html>`

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_MAIL,
            to,
            subject: MAIL_SUBJECT,
            html: mailContent,
        });

        if (error) {
            console.error('Email sending error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Unexpected error while sending email:', err);
        return { success: false, error: err };
    }
}