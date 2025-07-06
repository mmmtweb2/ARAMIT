const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
});

const questionSchema = new Schema({
    word: { type: String, required: true, unique: true },
    answers: [answerSchema],
    // ודא שהשדה הזה קיים
    audioUrl: { type: String, required: false }
}, {
    timestamps: true,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;