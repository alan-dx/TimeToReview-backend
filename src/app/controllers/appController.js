const Review = require("../models/review");
const Routine = require("../models/routine");
const Subject = require("../models/subject");
const User = require("../models/user");

module.exports = {

    async verifyToken(req,res) {
        return res.status(200).json({message: "Verifing token"})
    },
    async deleteUser(req, res) {
        const user = await User.findByIdAndRemove(req.userId)

        return res.status(200).json({ message: "User deleted"})
    },
    async listUser(req,res) {
        try {

            const user = await User.findById(req.userId).populate(['subjects', 'routines',{
                //deep populate
                path: 'reviews',
                populate: [
                    {path: 'subject_id'},
                    {path: 'routine_id'}
                ]
            }]).select("+email")

            const { date } = req.body
            const currentDate = new Date(date)
            console.log(currentDate)

            //FAZER UM GRÀFICO LAST WEEK, QUE CONTÉM TODAS AS ESTATÍSTICAS DA SEMANA PASSADA

            if (currentDate.getDay() != 1) { //Allows the chart to be restarted next week
                user.resetCharts = false
                user.markModified('resetCharts')
                user.save()
            }

            if (currentDate.getDay() == 1 && !user.resetCharts) {//It's moonday and chart has not yet been reset?
                console.log('Reseted Charts')
                user.performance.map(item => {
                    item.reviews = 0
                    item.cycles = [{
                        init: '00:00:00', 
                        finish: '00:00:00', 
                        reviews: 0, 
                        chronometer: new Date(new Date().setUTCHours(0,0,0,0)),
                        do: false
                    }]
                })
                user.markModified('performance')
                user.resetCharts = true
                user.markModified('resetCharts')
                user.save()
            }
            
            return res.status(200).json(user)
        } catch (error) {
            console.log(error)
            return res.status(500).json({error: `Error on list user, ${error}`})
        }

    },
    async indexReview(req,res) {
        try {
            const Reviews = await User.findById(req.userId).populate({
                path: "reviews",//populate in User model
                populate: [ //deep populate in reviews to populate subject_id
                    {path: 'subject_id'},
                    {path: 'routine_id'},
                ],
            })//If you want to see password or email, put the .select("+passowrd or +email") method
            const currentDate = new Date()
            currentDate.setHours(0,0,0,0)
            //LISTAR AS QUE ESTÃO ATRASADAS TB
            const indexReviews = Reviews.reviews.filter( item => {
                item.dateNextSequenceReview.setHours(0,0,0,0)
                return item.dateNextSequenceReview <= currentDate
            })

            return res.status(200).json(indexReviews)//Verificar a vulnerabilidade
        } catch (error) {
            return res.status(500).json({error: `Error on index Review, ${error}`})
        }

    },
    async indexAllReviews(req,res) {
        try {
            const Reviews = await User.findById(req.userId)

            return res.status(200).json(Reviews)//Verificar a vulnerabilidade
        } catch (error) {
            
        }
    },
    async createReview(req,res) {

        const { title, timer, routine_id, subject_id, dateNextSequenceReview } = req.body;
        const user = await User.findById(req.userId)
        const subject = await Subject.findById(subject_id)//TROCAR, FAZENDO A PESQUISA NO USER MODEL PARA FACILITAR A QUERY
        const routine = await Routine.findById(routine_id)

        try {

            const review = await Review.create({
                title,
                user: req.userId,
                timer,
                routine_id,
                subject_id,
                dateNextSequenceReview
            })

            subject.associatedReviews.push(review)
            routine.associatedReviews.push(review)
            user.reviews.push(review)
            
            
            subject.save()
            routine.save()
            user.save()
            const reviewPop = await Review.populate(review, ['subject_id', 'routine_id'])
            
            return res.status(200).json(reviewPop)
        } catch (error) {
            return res.status(500).json({ error: `Error on create review, ${error}`})
        }
    },
    async deleteReview(req,res) {

        const user = await User.findById(req.userId)
        const review = await Review.findById(req.query.id)
        const subject = await Subject.findById(review.subject_id)
        const routine = await Routine.findById(review.routine_id)

        try {
            if (review.user == req.userId) {//Security

                await Review.findByIdAndDelete(req.query.id)//Fazer apenas uma requisição, remover a que esta acima
    
                const newReviews = user.reviews.filter(item => item._id != req.query.id)
                const newSubjects = subject.associatedReviews.filter(item => item._id != req.query.id)
                const newRoutines = routine.associatedReviews.filter(item => item._id != req.query.id) 
                user.reviews = newReviews
                subject.associatedReviews = newSubjects
                routine.associatedReviews = newRoutines

                subject.save()
                user.save()
                routine.save()
    
                return res.status(200).json({message: "Delete review sucessfuly", user})
            } else {
                return res.status(401).json({error: "NTO"})
            }
        } catch (error) {
            return res.status(500).json({error: `Error on delete review, ${error}`})
        }
    },
    async concludeReview(req,res) {

        try {
            const review = await Review.findById(req.query.id).populate(['routine_id', 'subject_id'])
            const user = await User.findById(req.userId)

            if (review.currentSequenceReview > (review.routine_id.sequence.length - 1)) {//PODE OCORRER QUANDO O USUÁRIO TROCA A SEQUENCIA DE REVISÃO POR UMA MENOR
                //OLHAR SE OCORRER ALGUM BUG => POSSÍVEL CAUSA
                review.currentSequenceReview = review.routine_id.sequence.length - 1
            }

            if (review.currentSequenceReview < review.routine_id.sequence.length - 1) {
                console.log('if')
                
                const currentDate = new Date(req.query.date)
                const nextDate = review.dateNextSequenceReview.getDate() + Number(review.routine_id.sequence[review.currentSequenceReview + 1])//review.currentSequenceReview + 1 to take the next

                ++review.currentSequenceReview
                review.dateNextSequenceReview = new Date(review.dateNextSequenceReview.getFullYear(), review.dateNextSequenceReview.getMonth(), nextDate)//review.dateNextSequenceReview.setDate(nextDate) doesn't worked for some reason

                ++user.performance[currentDate.getDay()].reviews//Increment the reviews count on the day

                user.markModified('performance')
                user.save()
                review.save()
                
                return res.status(200).json(review)
            } else { //When the currentSequenceReview is on the last sequence of the array
                console.log('else')

                const currentDate = new Date(req.query.date)
                const nextDate = review.dateNextSequenceReview.getDate() + Number(review.routine_id.sequence[review.currentSequenceReview])

                review.dateNextSequenceReview = new Date(review.dateNextSequenceReview.getFullYear(), review.dateNextSequenceReview.getMonth(), nextDate)//review.dateNextSequenceReview.setDate(nextDate) doesn't worked for some reason

                ++user.performance[currentDate.getDay()].reviews

                user.markModified('performance')
                user.save()
                review.save()

                return res.status(200).json(review)
            }

        } catch (error) {
            return res.status(500).json({error: `Error on conclude review, ${error}`})
        }

    },
    async editReview(req,res) {
        try {
            const review = await Review.findOne({ _id: req.query.id})

            if (req.body.title) {
                review.title = req.body.title
            }

            if (req.body.timer) {
                review.timer = req.body.timer || "Not define"
            }

            if (req.body.routine_id) {
                console.log('rotina')
                const routine = await Routine.findById(req.body.routine_id)
                const oldRoutine = await Routine.findById(review.routine_id)

                if (review.currentSequenceReview > (routine.sequence.length - 1)) {
                    review.currentSequenceReview = routine.sequence.length - 1
                }

                const newRoutines = oldRoutine.associatedReviews.filter(item => {
                    return JSON.stringify(item) != JSON.stringify(review._id)
                })

                oldRoutine.associatedReviews = newRoutines

                if (routine.associatedReviews.indexOf(review._id) === -1) {
                    routine.associatedReviews.push(review)//FAZ O FILRO P N POR REPETIDO
                }

                review.routine_id = req.body.routine_id
                routine.save()
                oldRoutine.save()

            }

            if (req.body.subject_id) {
                const subject = await Subject.findById(req.body.subject_id)
                const oldSubject = await Subject.findById(review.subject_id)

                const newSubject = oldSubject.associatedReviews.filter(item => {
                    return JSON.stringify(item) != JSON.stringify(review._id)
                }) 
                oldSubject.associatedReviews = newSubject

                if (subject.associatedReviews.indexOf(review._id) === -1) {
                    subject.associatedReviews.push(review)
                }

                review.subject_id = req.body.subject_id
                subject.save()
                oldSubject.save()

            }
            
            review.save()

            const reviewPop = await Review.populate(review, ['subject_id', 'routine_id'])

            res.status(200).json({message: 'Edit review sucessfuly', review: reviewPop})

        } catch (error) {
            res.status(500).json({error: `Update failed, ${error}`})
        }
    },
    async indexSubjects(req,res) {
        try {
            const UserAndSubjects = await User.findById(req.userId).populate('subjects')
            
            return res.status(200).json(UserAndSubjects.subjects)
        } catch (error) {
            return res.status(500).json({error: `Error on index subjects, ${error}`})
        }
    },
    async createSubject(req,res) {

        const {title, marker } = req.body
        const user = await User.findById(req.userId)

        try {
            
            const subject = await Subject.create({
                label: title,
                value: title,
                marker,
                user: req.userId
            })

            user.subjects.push(subject)

            user.save()

            return res.status(200).json({ subject })
        } catch (error) {
            return res.status(500).json({ error: `Error on create subject, ${error}`})
        }

    },
    async editSubject(req,res) {
        const { title, marker } = req.body
        const subject = await Subject.findById(req.query.id)//TENTAR FAZER A BUSCA NO MODEL USER
        try {
            subject.label = title
            subject.value = title
            subject.marker = marker,

            subject.save()

            return res.status(200).json({message: `Edit subject sucessfuly`, subject: subject})

        } catch (error) {
            return res.status(500).json({error: `Error on edit subject, ${error}`})
        }
    },
    async deleteSubject(req,res) {
        const user = await User.findById(req.userId)
        const subject = await Subject.findById(req.query.id)
        try {
            console.log(subject.user == req.userId, subject.associatedReviews.length)
            if ((subject.user == req.userId) && (subject.associatedReviews.length == 0)) {
                subject.deleteOne()

                const newSubjects = user.subjects.filter(item => item._id != req.query.id)
                user.subjects = newSubjects

                user.save()

                return res.status(200).json({message: "Delete subject sucessfuly"})
            } else {
                return res.status(401).json({error: "NTO"})
            }
        } catch (error) {
            return res.status(500).json({error: `Error on delete subject, ${error}`})
        }
    },
    async indexRoutines(req,res) {
        try {
            const Routines = await User.findById(req.userId).populate('routines')
    
            return res.status(200).json(Routines.routines)
        } catch (error) {
            return res.status(500).json({error: `Error on index routines, ${error}`})
        }

    },
    async createRoutine(req,res) {
        const { sequence } = req.body;
        const user = await User.findById(req.userId)

        try {

            sequenceArray = sequence.split('-')

            const routine = await Routine.create({
                sequence: sequenceArray,
                user: req.userId,
                label: sequence,
                value: sequence
            })

            user.routines.push(routine)
            user.save()

            return res.status(200).json({ routine })

        } catch (error) {
            return res.status(500).json({error: `Error on create routine, ${error}`})            
        }
    },
    async editRoutine(req,res) {

        const { sequence } = req.body
        const routine = await Routine.findById(req.query.id)//TENTAR FAZER A BUSCA NO MODEL USER

        try {

            sequenceArray = sequence.split('-')
            routine.label = sequence
            routine.value = sequence
            routine.sequence = sequenceArray
            routine.save()

            return res.status(200).json({message: `Edit routine sucessfuly`, routine: routine})
        } catch (error) {
            return res.status(500).json({error: `Error on edit routine, ${error}`})
        }
    },
    async deleteRoutine(req,res) {
        const user = await User.findById(req.userId)
        const routine = await Routine.findById(req.query.id)
        try {
            if ((routine.user == req.userId) && (routine.associatedReviews.length == 0)) {
                routine.deleteOne()

                const newSubjects = user.routines.filter(item => item._id != req.query.id)
                user.routines = newSubjects

                user.save()

                return res.status(200).json({message: "Delete routine sucessfuly"})
            } else {
                return res.status(401).json({error: "NTO"})
            }
        } catch (error) {
            return res.status(500).json({error: `Error on delete routine, ${error}`})
        }
    },
    async concludeCycle(req,res) {
        const user = await User.findById(req.userId)
        try {
            const {day, cycles} = req.body

            user.performance[day].cycles = cycles;
            
            user.markModified('performance')
            await user.save()

            return res.status(200).json(user.performance[day])
        } catch (error) {
            res.status(500).json({error: `Error on conclude cycle, ${error}`})
        }
    },
    async setTimeReminder(req,res) {
        const user = await User.findById(req.userId).select(['-reviews', '-subjects', '-routines', '-performance'])
        try {
            const {date} = req.body
            console.log(date)
            user.reminderTime = date

            user.save()

            return res.status(200).json(user)
        } catch (error) {
            return res.status(500).json({message: `Error on setTimeReminder, ${error}`})
        }
    }
}

