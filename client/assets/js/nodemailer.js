const key = require('../../config/key.json');
const nodemailer = require("nodemailer");

const email = JSON.parse(fs.readFileSync(path.join(__dirname, '/config/mail.config.json')),
    'email');
const pass = parser.parseData(fs.readFileSync(path.join(__dirname, '/config/mail.config.json')),
    'password'), ;
const recipients = ['gabriel.low@captracks.com', 'ben.shor@captracks.com'];

var textBody = `FROM: ${request.body.name} EMAIL: ${request.body.email} MESSAGE: ${request.body.message}`;
var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${request.body.name} <a href="mailto:${request.body.email}">${request.body.email}</a></p><p>${request.body.message}</p>`;

async function send() {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            serviceClient: key.client_id,
            privateKey: key.private_key
        }
    });
    try {
        await transporter.verify();
        recipients.forEach((to, i, array) => {
            var msg = {
                from: email,
                to: to,
                subject: "CapTracks Contact Form Mail",
                text: textBody,
                html: htmlBody
            };

            await transporter.sendMail(msg, (err, info) => {
                if (err) {
                    console.log(err);
                    response.json({ message: "message not sent: an error occured; check the server's console log" });
                }
                else {
                    response.json({ message: `message sent: ${info.messageId}` });
                }
            });
        });
    }
    catch (err) {
        console.log(err);
    }
}

send();