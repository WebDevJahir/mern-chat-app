const escapeHtml = (value = "") =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

export const welcomeEmail = ({ fullName = "there", appName = "Chat App", clientUrl = "" } = {}) => {
	const safeName = escapeHtml(fullName.trim() || "there");
	const safeAppName = escapeHtml(appName.trim() || "Chat App");
	const safeClientUrl = escapeHtml(clientUrl.trim());

	const subject = `Welcome to ${safeAppName}!`;

	const textBody = [
		`Hi ${safeName},`,
		`Welcome to ${safeAppName}! We are excited to have you on board.`,
		safeClientUrl ? `You can sign in anytime at ${safeClientUrl}.` : "",
		"If you have any questions, please reply to this email and we will be happy to help.",
		"See you inside!",
		`The ${safeAppName} Team`
	]
		.filter(Boolean)
		.join("\n\n");

	const introCta = safeClientUrl
		? '<p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;">Tap the button below to jump back in anytime.</p>'
		: "";

	const buttonRow = safeClientUrl
		? `<tr>
						<td style="padding:0 32px 32px 32px;">
							<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
								<tr>
									<td style="border-radius:999px;background-color:#2563eb;padding:14px 32px;text-align:center;">
										<a href="${safeClientUrl}" style="display:inline-block;font-size:16px;color:#ffffff;text-decoration:none;font-weight:600;">Open ${safeAppName}</a>
									</td>
								</tr>
							</table>
						</td>
					</tr>`
		: "";

	const htmlBody = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>${subject}</title>
		<style>
			@media (prefers-reduced-motion: reduce) {
				*,
				::before,
				::after {
					animation-duration: 0.01ms !important;
					animation-iteration-count: 1 !important;
					transition-duration: 0.01ms !important;
					scroll-behavior: auto !important;
				}
			}
		</style>
	</head>
	<body style="margin:0;padding:0;background-color:#f4f5fb;font-family:Arial,'Helvetica Neue',sans-serif;color:#1f2933;">
		<span style="display:none!important;font-size:1px;color:#f4f5fb;max-height:0;max-width:0;opacity:0;overflow:hidden;">
			We are thrilled to have you join ${safeAppName}.
		</span>
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f5fb;">
			<tr>
				<td align="center" style="padding:32px 16px;">
					<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,42,0.08);">
						<tr>
							<td style="padding:32px 32px 24px 32px;text-align:center;background:linear-gradient(135deg,#2563eb,#6366f1);">
								<h1 style="margin:0;font-size:28px;line-height:1.2;color:#ffffff;font-weight:700;">${safeAppName}</h1>
							</td>
						</tr>
						<tr>
							<td style="padding:32px 32px 8px 32px;">
								<h2 style="margin:0 0 16px 0;font-size:22px;font-weight:600;">Welcome aboard, ${safeName}!</h2>
								<p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;">
									We are thrilled you joined <strong>${safeAppName}</strong>. Your account is ready, and you are just a click away from your first conversation.
								</p>
								${introCta}
							</td>
						</tr>
						${buttonRow}
						<tr>
							<td style="padding:0 32px 32px 32px;">
								<p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;">
									Need a hand? Just reply to this email and we will assist right away.
								</p>
								<p style="margin:0;font-size:16px;line-height:1.6;">
									Cheers,<br />The ${safeAppName} Team
								</p>
							</td>
						</tr>
						<tr>
							<td style="padding:24px 32px;background-color:#f8fafc;font-size:12px;color:#64748b;text-align:center;">
								<p style="margin:0 0 8px 0;">You are receiving this email because you created an account with ${safeAppName}.</p>
								<p style="margin:0;">123 Anywhere St, Suite 100 · San Francisco, CA 94105</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>`;

	return {
		subject,
		htmlBody,
		textBody
	};
};
