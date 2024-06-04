const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const rateLimit = require("express-rate-limit");

const config = require('./config');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5 
});

app.use(limiter);

app.use(cors({
    origin: ['https://portfolio.local.jack-sanders.uk', 'https://portfolio.jack-sanders.uk']
}));

app.post('/send_email', limiter, (req, res) => {
    let { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'sandersjack141@gmail.com',
            pass: config.emailPassword
        }
    });

    message += " From Email: " + email;

    const mailOptions = {
        from: email,
        to: 'sandersjack141@gmail.com',
        subject: `New Contact Form Submission from ${name}`,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Email could not be sent.');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully!');
        }
    });
});

app.listen(3333, () => {
    console.log('Server is running on port 3333');
});
