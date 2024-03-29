const mongoose = require('../../database/index');
// const bcrypt = require('bcryptjs');

mongoose.set('useFindAndModify', false);

const UserSchema = new mongoose.Schema({//like table on SQL. This is the Model
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
    verifiedAccount: {
        type: Boolean,
        default: false
    },
    reminderTime: {
        type: Date,
        default: new Date("1899-12-31T13:01:00.000Z")
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
        ref: 'Routine',
    }],
    resetCharts: {
        type: Boolean,
        default: false
    },
    resetChartsMondayDate: {
        type: Date,
    },
    performance: {
        type: Array,
        default: [
            {//Dom
                reviews: 0,
                cycles: [{
                        init: '00:00:00', 
                        finish: '00:00:00', 
                        reviews: 0, 
                        chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                        do: false
                    }]
            },
            {//Seg
                reviews: 0,
                cycles: [{
                    init: '00:00:00', 
                    finish: '00:00:00', 
                    reviews: 0, 
                    chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                    do: false
                }]
            },
            {
                reviews: 0,
                cycles: [{
                    init: '00:00:00', 
                    finish: '00:00:00', 
                    reviews: 0, 
                    chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                    do: false
                }]
            },
            {
                reviews: 0,
                cycles: [{
                    init: '00:00:00', 
                    finish: '00:00:00', 
                    reviews: 0, 
                    chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                    do: false
                }]
            },
            {
                reviews: 0,
                cycles: [{
                    init: '00:00:00', 
                    finish: '00:00:00', 
                    reviews: 0, 
                    chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                    do: false
                }]
            },
            {
                reviews: 0,
                cycles: [{
                    init: '00:00:00', 
                    finish: '00:00:00', 
                    reviews: 0, 
                    chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                    do: false
                }]
            },
            {//Sáb
                reviews: 0,
                cycles: [{
                    init: '00:00:00', 
                    finish: '00:00:00', 
                    reviews: 0, 
                    chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                    do: false
                }]
            },
        ]
    },
    lastWeekPerformance: {
        type: Array,
        default: [
            {//Dom
                reviews: 0,
                cycles: [{
                        init: '00:00:00', 
                        finish: '00:00:00', 
                        reviews: 0, 
                        chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                        do: false
                    }]
            },
            {//Seg
                reviews: 0,
                cycles: [{
                    init: '00:00:00', 
                    finish: '00:00:00', 
                    reviews: 0, 
                    chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                    do: false
                }]
            },
            {
                reviews: 0,
                cycles: [{
                    init: '00:00:00', 
                    finish: '00:00:00', 
                    reviews: 0, 
                    chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                    do: false
                }]
            },
            {
                reviews: 0,
                cycles: [{
                    init: '00:00:00', 
                    finish: '00:00:00', 
                    reviews: 0, 
                    chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                    do: false
                }]
            },
            {
                reviews: 0,
                cycles: [{
                    init: '00:00:00', 
                    finish: '00:00:00', 
                    reviews: 0, 
                    chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                    do: false
                }]
            },
            {
                reviews: 0,
                cycles: [{
                    init: '00:00:00', 
                    finish: '00:00:00', 
                    reviews: 0, 
                    chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                    do: false
                }]
            },
            {//Sáb
                reviews: 0,
                cycles: [{
                    init: '00:00:00', 
                    finish: '00:00:00', 
                    reviews: 0, 
                    chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                    do: false
                }]
            },
        ]
    },
    change: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false,
        default: Date.now
    },
    mailConfirmToken: {
        type: String,
        select: false
    },
    mailResetExpires: {
        type: Date,
        select: false,
        default: Date.now
    },
    lastDateUseApp: {
        type: Date,
    },
    premium: {
        type: Boolean,
        default: false
    },
    deviceId: {
        type: String
    },
    disable: {
        type: Boolean,
        default: false
    }

})

// UserSchema.pre('save', async function(next) {
//     const hash = await bcrypt.hash(this.password, 12)
//     this.password = hash
//     next()
// })

const User = mongoose.model('User', UserSchema)

module.exports = User;