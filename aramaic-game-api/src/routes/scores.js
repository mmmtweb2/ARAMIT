const router = require('express').Router();
let Score = require('../models/score.model');
let User = require('../models/user.model');
const { titles } = require('../utils/titles.js'); // ייבוא מערך התארים

// GET /scores - קבלת רשימת השיאים
router.route('/').get((req, res) => {
    Score.find().sort({ score: -1 }).limit(10)
        .then(scores => res.json(scores))
        .catch(err => res.status(400).json('Error: ' + err));
});

// POST /scores/add - הלוגיקה המעודכנת
router.route('/add').post(async (req, res) => {
    const { userId, username, score } = req.body;
    if (score === undefined || !userId || !username) {
        return res.status(400).json('Error: Missing required fields.');
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json('User not found');

        // --- לוגיקת התארים ---
        if (!user.currentTitle && score > 0) {
            user.currentTitle = titles[0].name; // מעניק את התואר הראשון
        } else if (user.currentTitle) {
            const newProgress = user.titleProgress + score;
            user.titleProgress = newProgress % 20;
            const titlesEarned = Math.floor(newProgress / 20);

            if (titlesEarned > 0) {
                const currentTitleIndex = titles.findIndex(t => t.name === user.currentTitle);
                const newTitleIndex = Math.min(currentTitleIndex + titlesEarned, titles.length - 1);
                user.currentTitle = titles[newTitleIndex].name;
            }
        }
        await user.save();
        // --------------------

        // --- לוגיקת שמירת שיא ---
        const existingScore = await Score.findOne({ user: userId });
        if (!existingScore) {
            const newScore = new Score({ score, user: userId, username, title: user.currentTitle });
            await newScore.save();
        } else if (score > existingScore.score) {
            existingScore.score = score;
            existingScore.title = user.currentTitle;
            await existingScore.save();
        }

        res.json({ message: 'Score processed', user: { id: user._id, username: user.username, currentTitle: user.currentTitle } });
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

module.exports = router;