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
					"Email": "developersandaru@gmail.com",
					"Name": "Server Manager"
			    },
				"To": [
					{
						"Email": "sandarusbandara110@gmail.com",
						"Name": "Sandaruwan Bandara"
					}
				],
				"Subject": "Your email flight plan!",
				"TextPart": "Dear Sandaruwan Bandara, welcome to Mailjet! May the delivery force be with you!",
				"HTMLPart": "<h3>Dear Sandaruwan Bandara, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
            }
        ]
    });

    request.then((result) => {
        console.log(result.body);
    }).catch(err => {
        console.log(err.statusCode);
    });
}