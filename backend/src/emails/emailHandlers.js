import { resendClient, sender } from "../lib/resend.js";
import { welcomeEmail } from "./emailTemplates.js";

export const sendWelcomeEmail = async (to, { fullName, appName, clientUrl } = {}) => {
	try {
		const { subject, textBody, htmlBody } = welcomeEmail({ fullName, appName, clientUrl });
		const response = await resendClient.emails.send({
			from: sender.email,
			to,
			subject,
			text: textBody,
			html: htmlBody
		});
		return response;
	} catch (error) {
		throw error;
	}
};