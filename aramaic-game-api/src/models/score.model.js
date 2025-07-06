const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    score: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    audioUrl: { type: String, required: false },
    title: { type: String, required: false }
}, {
    timestamps: true,
});

const Score = mongoose.model('Score', scoreSchema);
module.exports = Score;