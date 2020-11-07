const mongoose = require('../../database/index');
// const bcrypt = require('bcryptjs');

mongoose.set('useFindAndModify', false);

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        select: false
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    filterReviews: {
        type: Array,
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    routines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Routine'
    }],
    resetCharts: {
        type: Boolean,
        default: false
    },
    performance: {
        type: Array,
        default: [
            {//Dom
                reviews: 0,
                time: 0
            },
            {//Seg
                reviews: 0,
                time: 0
            },
            {
                reviews: 0,
                time: 0
            },
            {
                reviews: 0,
                time: 0
            },
            {
                reviews: 0,
                time: 0
            },
            {
                reviews: 0,
                time: 0
            },
            {//Sáb
                reviews: 0,
                time: 0
            },
        ]
    }

})

// UserSchema.pre('save', async function(next) {
//     const hash = await bcrypt.hash(this.password, 12)
//     this.password = hash
//     next()
// })

const User = mongoose.model('User', UserSchema)

module.exports = User;