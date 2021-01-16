const mongoose = require('mongoose');
require('dotenv').config()

// PROD: mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.usnmf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority
// DEV: mongodb://${process.env.DB_HOST_DEV}

mongoose.connect(`mongodb://${process.env.DB_HOST_DEV}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.Promise = global.Promise;

module.exports = mongoose;