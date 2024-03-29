const mongoose = require('../../database/index')

mongoose.set('useFindAndModify', false)

const ReviewSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user: {//security: when trying to delete a review, if it does not belong to the user who sent the request the request is blocked
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    routine_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Routine',
        required: true
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    currentSequenceReview: {
        //AQ SERÁ ONDE SERÁ ENVIADO O NÚMERO DA ATUAL SEQUÊNCIA DA REVISÃO
        //ISSO IRÁ OCORRER QUANDO O USÁRIO CONCLUIR A REVISÃO
        //CRIAR UMA ROTA QUE FARA A VERIFICAÇÃO DE TODAS AS REVISÕES DO DIA
        type: Number,
        default: 0,//INCREMENTAR QUANDO ACESSAR A ROTA DE CONCLUSÃO. CONTEM O INDÍCE DO NÚMERO DA SEQUÊNCIA ATUAL
    },
    dateNextSequenceReview: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    track: {
        type: Object
    },
    notes: {
        type: Object
    },
    image: {
        type: Array
    }
})


    //ATENÇÃO => AO CRIAR A REVISÃO PELA PRIMEIRA VEZ, A DATA DA PRIMEIRA REVISÃO TEM QUE SER INSERIDA PELO FRONTEND

const Review = mongoose.model('Review', ReviewSchema)

module.exports = Review;