const Mailjet = require('node-mailjet');

module.exports.sendPasswordResetMail = async (req, res) => {
    const mailjet = new Mailjet({
        apiKey: process.env.MJ_APIKEY_PUBLIC,
        apiSecret: process.env.MJ_APIKEY_PRIVATE
    });

    const request = mailjet.post("send", {'version': 'v3.1'}).request({
        "Messages" : [
            {
                "From": {
                    "Email": process.env.MAIL_FROM,
                    "Name": "Server Manager"
                },
                "To": [
                    {
                        "Email": process.env.MAIL_TO,
                        "Name": "Administrator"
                    }
                ],
                "Subject": "Password Reset Request",
                "TextPart": "A password reset has been requested for your Server Manager account.",
                "HTMLPart": "<h3>Password Reset Request</h3><p>A password reset has been requested for your Server Manager account.</p>"
            }
        ]
    });

    try {
        await request;
        res.json({ ok: true });
    } catch (err) {
        console.error('Mail send error:', err);
        res.status(500).json({ error: 'Failed to send email' });
    }
}