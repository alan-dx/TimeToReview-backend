const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json')

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 43200
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

            user.password = undefined
            user.email = undefined;

            return res.status(201).json({ user: user})
        } catch (error) {
            return res.status(500).json({ error: `SignUp failed, ${error}`})
        }
    },
    async signIn(req,res) {
        const {email, password} = req.body;

        try {
            const user = await User.findOne({ email: email }).select('+password')//here select is necessary beacause bcrypt need it to compare the password
            
            if (!user) {
                return res.status(401).json({ error: "User not found "})
            }

            
            if (!await bcrypt.compare(password, user.password)) {
                return res.status(401).json({ error: "Invalid Password"})
            }
            
            user.password = undefined
            
            return res.status(200).json({ user, token: generateToken({ id: user.id }) })
        } catch (error) {
            return res.status(500).json({ error: `SignIn failed, ${error}`})
        }
    }
}