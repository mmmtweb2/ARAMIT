const router = require('express').Router();
let User = require('../models/user.model.js'); // ייבוא מודל המשתמש
const bcrypt = require('bcryptjs'); // נייבא את ספריית ההצפנה

// הגדרת נקודת קצה לרישום משתמש חדש
// POST /users/register
router.route('/register').post(async (req, res) => {
    try {
        const { username, password } = req.body;

        // בדיקות תקינות
        if (!username || !password) {
            return res.status(400).json('Error: Username and password are required.');
        }
        if (password.length < 6) {
            return res.status(400).json('Error: Password must be at least 6 characters long.');
        }

        // בדיקה אם שם המשתמש כבר קיים
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json('Error: Username already exists.');
        }

        const newUser = new User({
            username,
            password,
        });

        await newUser.save();
        res.json('User registered successfully!');

    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});


// הגדרת נקודת קצה לכניסת משתמש
// POST /users/login
router.route('/login').post(async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. מצא את המשתמש לפי שם המשתמש
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json('Error: Invalid credentials'); // הודעה גנרית לאבטחה
        }

        // 2. השווה את הסיסמה שהתקבלה עם הסיסמה המוצפנת במסד הנתונים
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json('Error: Invalid credentials');
        }

        // אם הגענו לכאן - ההתחברות הצליחה
        // בעתיד, כאן נחזיר "טוקן" (JWT) למשתמש
        res.json({
            message: 'Logged in successfully!',
            user: {
                id: user._id,
                username: user.username
            },
            currentTitle: user.currentTitle

        });

    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});


// POST /users/increment-correct-answers
router.route('/increment-correct-answers').post(async (req, res) => {
    try {
        const { userId, correctAnswersIncrement } = req.body;
        if (!userId || typeof correctAnswersIncrement !== 'number') {
            return res.status(400).json('Error: userId and correctAnswersIncrement are required.');
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json('Error: User not found.');
        }
        user.correctAnswersCount += correctAnswersIncrement;
        await user.save();
        res.json({ correctAnswersCount: user.correctAnswersCount });
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});


module.exports = router;