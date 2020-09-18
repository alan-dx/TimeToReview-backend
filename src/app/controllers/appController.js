const Review = require("../models/review");
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
        const user = await User.findById(req.userId).populate("subjects")

        return res.status(200).json({user: user})
    },
    async indexReview(req,res) {
        try {
            const Reviews = await User.findById(req.userId).populate({
                path: "reviews",//populate in User model
                populate: { //deep populate in reviews to populate subject_id
                    path: 'subject_id',
                }
            })//If you want to see password or email, put the .select("+passowrd or +email") method
            return res.status(200).json(Reviews.reviews)
        } catch (error) {
            return res.status(500).json({error: `Error on delete Review, ${error}`})
        }

    },
    async createReview(req,res) {

        const { title, date, hour, fullDateTime, routine, routine_id, subject_id } = req.body;
        const user = await User.findById(req.userId)
        const subject = await Subject.findById(subject_id)

        try {

            const review = await Review.create({
                title,
                user: req.userId,
                date,
                hour,
                fullDateTime,
                routine,
                routine_id,
                subject_id
            })
            subject.associatedReviews.push(review)
            user.reviews.push(review)

            subject.save()
            user.save()

            return res.status(200).json({ user })
        } catch (error) {
            return res.status(500).json({ error: `Error on create review, ${error}`})
        }
    },
    async deleteReview(req,res) {

        const user = await User.findById(req.userId)
        const review = await Review.findById(req.query.id)
        const subject = await Subject.findById(review.subject_id)

        try {
            if (review.user == req.userId) {//Security

                await Review.findByIdAndDelete(req.query.id)
    
                const newReviews = user.reviews.filter(item => item._id != req.query.id)
                const newSubjects = subject.associatedReviews.filter(item => item._id != req.query.id)
                user.reviews = newReviews
                subject.associatedReviews = newSubjects

                subject.save()
                user.save()
    
                return res.status(200).json({message: "Delete review sucessfuly", user})
            } else {
                return res.status(500).json({error: "You are not the owner of this review!"})
            }
        } catch (error) {
            return res.status(500).json({error: `Error on delete review, ${error}`})
        }
    },
    async editReview(req,res) {
        try {

            const review = await Review.findOne({ _id: req.query.id})
            
            review.title = req.body.title || "Not defined"
            review.date = req.body.date || "Not defined"
            review.hour = req.body.hour || "Not defined"
            review.fullDateTime = req.body.fullDateTime || 1598051730000
            review.routine = req.body.routine || "Not defined"
            review.routine_id = req.body.routine_id || "Not defined"
            review.subject = req.body.subject || "Not defined"
            review.subject_id = req.body.subject_id || "Not defined"
            
            review.save()

            res.status(200).json({message: 'Edit review sucessfuly'})

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

        const {title, marker, info } = req.body
        const user = await User.findById(req.userId)

        try {
            
            const subject = await Subject.create({
                label: title,
                value: title,
                marker,
                info,
                user: req.userId
            })

            user.subjects.push(subject)

            user.save()

            return res.status(200).json({ subject })
        } catch (error) {
            return res.status(500).json({ error: `Error on create subject, ${error}`})
        }

    }
}

