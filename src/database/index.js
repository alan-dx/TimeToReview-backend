const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(`mongodb://${process.env.DB_HOST}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.Promise = global.Promise;

module.exports = mongoose;