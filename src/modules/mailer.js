const mailjet = require('node-mailjet')
.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

module.exports = mailjet

// const path = require('path')
// const nodemailer = require('nodemailer')
// const hbs = require('nodemailer-express-handlebars')

// const { host, port, user, pass } = require('../app/config/mail.json')

// var transport = nodemailer.createTransport({
//     host,
//     port,
//     auth: {
//       user,
//       pass
//     }
// })

// transport.use('compile', hbs({
//     viewEngine: {
//       defaultLayout: undefined,
//       partialsDir: path.resolve('./src/resources/mail/')
//     },
//     viewPath: path.resolve('./src/resources/mail/'),
//     extName: '.html'
// }))

// module.exports = transport