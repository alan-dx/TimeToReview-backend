const Review = require("../models/review");
const User = require("../models/user");

module.exports = {
    async verifyToken(req,res) {
        return res.status(200).json({message: "Verifing token"})
    },
    async indexReview(req,res) {

        const UserAndReviews = await User.findById(req.userId).populate('reviews')//If you want to see passowrd or email, put the .select("+passowrd or +email") method

        return res.status(200).json(UserAndReviews.reviews)
    },
    async createReview(req,res) {

        const { title, date, hour, fullDateTime, routine, routine_id, subject, subject_id } = req.body;
        const user = await User.findById(req.userId)

        try {

            const review = await Review.create({
                title,
                user: req.userId,
                date,
                hour,
                fullDateTime,
                routine,
                routine_id,
                subject,
                subject_id
            })

            user.reviews.push(review)

            user.save()

            return res.status(200).json({ user })

        } catch (error) {
            return res.status(500).json({ error: `Error on create review, ${error}`})
        }
    },
    async deleteReview(req,res) {
        try {
            await Review.findByIdAndDelete(req.query.id)

            return res.status(200).json({message: "Delete review sucessfuly"})
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
    }
}

