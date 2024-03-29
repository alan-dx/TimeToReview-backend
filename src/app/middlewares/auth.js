//Authentication Middleware

const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req,res,next) => {
    const authHeader = req.headers.authorization;//sended via the front end application

    if (!authHeader) {
        return res.status(401).json({ error: "No token provided"})
    }

    const parts = authHeader.split(' ');

    if (!parts.length === 2) {
        return res.status(403).json({ error: "Token error"})
    }

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(406).json({error: "Token malformated"})
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) {
            return res.status(407).send({ error: `Token invalid, error: ${err}`})
        }

        req.userId = decoded.id;

        return next();
    })
}