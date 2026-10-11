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

app.use(cors({
    origin: ['https://portfolio.local.jack-sanders.uk', 'https://portfolio.jack-sanders.uk']
}));

const NAME_MAX = 100;
const MESSAGE_MAX = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact(name, email, message) {
    if (typeof name !== 'string') {
        return { error: 'Invalid name', details: 'Name must be 1-100 characters' };
    }
    const trimmedName = name.trim();
    if (trimmedName.length < 1 || trimmedName.length > NAME_MAX) {
        return { error: 'Invalid name', details: 'Name must be 1-100 characters' };
    }
    if (/[\r\n]/.test(name)) {
        return { error: 'Invalid name', details: 'Name must not contain line breaks' };
    }

    if (typeof email !== 'string') {
        return { error: 'Invalid email', details: 'Email must be a valid email address' };
    }
    const trimmedEmail = email.trim();
    if (/[\r\n]/.test(email) || !EMAIL_PATTERN.test(trimmedEmail)) {
        return { error: 'Invalid email', details: 'Email must be a valid email address' };
    }

    if (typeof message !== 'string') {
        return { error: 'Invalid message', details: 'Message must be 1-5000 characters' };
    }
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 1 || trimmedMessage.length > MESSAGE_MAX) {
        return { error: 'Invalid message', details: 'Message must be 1-5000 characters' };
    }

    return null;
}

app.post('/send_email', limiter, (req, res) => {
    let { name, email, message } = req.body || {};

    const validationError = validateContact(name, email, message);
    if (validationError) {
        console.error('Validation failed:', validationError.error, '-', validationError.details);
        return res.status(400).json(validationError);
    }

    name = name.trim();
    email = email.trim();
    message = message.trim();

    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'sandersjack141@gmail.com',
            pass: config.emailPassword
        }
    });

    message += " From Email: " + email;

    const mailOptions = {
        from: 'sandersjack141@gmail.com',
        replyTo: email,
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
