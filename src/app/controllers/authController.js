const User = require('../models/user')
const Routine = require('../models/routine')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const authConfig = require('../config/auth.json')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')
const path = require('path')

function generateToken(params = {}) {
    return jwt.sign(params,process.env.SECRET_KEY, {
        expiresIn: 78000
    });
}

module.exports = {
    async signUp(req,res) {
        const { email, password, name } = req.body

        try {

            //Verify email
            if (await User.findOne({email})) {
                return res.status(400).json({
                    error: "Email already in use!"
                })
            }

            //Verify Password - not do yet

            const hashedPasword = await bcrypt.hash(password, 12)
            
            const user = await User.create({//select:false don't work here beacause is not a query method. Then user.atributte = undefinde is necessary
                name,
                password: hashedPasword,
                email
            })

            const routine = await Routine.create({
                sequence: ["0","3","7","14","21","30"],
                user: user._id,
                label: '0-3-7-14-21-30',
                value: '0-3-7-14-21-30'
            })

            user.routines.push(routine)

            await user.save()

            user.password = undefined
            user.email = undefined;

            return res.status(201).json({ user: user})
        } catch (error) {
            return res.status(500).json({ error: `SignUp failed, ${error}`})
        }
    },
    async signIn(req,res) {
        const {email, password } = req.body;

        try {
            const user = await User.findOne({ email: email }).select('+password').select('+email')//here select is necessary beacause bcrypt need it to compare the password

            if (!user) {
                return res.status(404).json({ error: "User not found"})
            }

            if (user.disable) {
                return res.status(406).json({ error: "User disable"})
            }
            
            if (!await bcrypt.compare(password, user.password)) {
                return res.status(401).json({ error: "Invalid Password"})
            }
            
            user.password = undefined
            user.reviews = undefined
            user.filterReviews = undefined
            user.subjects = undefined
            user.routines = undefined
            user.resetCharts = undefined
            user.performance = undefined

            return res.status(200).json({ user, token: generateToken({ id: user.id }) })
        } catch (error) {
            return res.status(500).json({ error: `SignIn failed, ${error}`})
        }
    },
    async forgotPassword(req,res) {
        const { email } = req.body

        try {
            
            const user = await User.findOne({email})

            
            if (!user) {
                return res.status(404).json({error: 'User not found'})
            }
            
            const token = crypto.randomBytes(20).toString('hex')//generate reset token
            
            const request = mailer
                .post("send", {'version': 'v3.1'})
                .request({
                "Messages":[
                    {
                    "From": {
                        "Email": "contato.almeidadev@gmail.com",
                        "Name": "TimeToReview"
                    },
                    "To": [
                        {
                        "Email": email,
                        "Name": user.name
                        }
                    ],
                    "Subject": "TimeToReview - Recuperação de Senha",
                    "TextPart": "",
                    "HTMLPart": `<h2>Você esqueceu sua senha? Sem problemas, vamos criar outra!</h2><h3>Copie e cole o token abaixo no campo indicado do aplicativo</h3><br />TOKEN: <strong>${token}</strong>`
                    +`<br /><h3>Caso não tenha sido você quem solicitou essa modificação entre em contato com nossa equipe.</h3>`,
                    "CustomID": "TTRForgotPassword"
                    }
                ]
                })

            const now = new Date()
            now.setHours(now.getHours() + 1)

            user.passwordResetToken = token
            user.passwordResetExpires = now

            user.save()

            return res.status(200).json({ message: 'Email successfully sent'})
        } catch (error) {
            
            res.status(400).json({ error: 'Error on forgot password, try again'})
        }
    },
    async resetPassword(req,res) {
        const { email, token, password } = req.body

        try {
            const user = await User.findOne({ email })
                .select('+passwordResetToken passwordResetExpires')
            
            if (!user) {
                return res.status(404).json({error: 'User not found'})
            }

            if (token != user.passwordResetToken) {
                return res.status(409).json({ error: 'Token invalid'})
            }

            const now = new Date()

            if (now > user.passwordResetExpires) {
                return res.status(401).json({ error: 'Token expired, generate a new one'})
            }

            const hashedPasword = await bcrypt.hash(password, 12)

            user.password = hashedPasword

            await user.save()

            res.status(200).json({ message: "Password reseted"})

        } catch (error) {
            res.status(400).json({ error: "Error on reset password, try again"})
        }
    },
    async privacyPolicy(req, res) {
        try {
            res.sendFile(path.join(__dirname + '../../../files/ttr_privacy_policy_ptbr.html'))
        } catch (error) {
          return res.status(400).json({error: "Error on privacy policy, try again"})  
        }
    }
}