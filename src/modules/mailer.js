const nodemailer = require('nodemailer')

const { host, port, user, pass } = require('../app/config/mail.json')

var transport = nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass
    }
});