const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001; // חזרנו לפורט 5001, אתה יכול לשנות אם תרצה

app.use(cors());
app.use(express.json());
// הפיכת תיקיית ההעלאות לסטטית וציבורית
app.use('/uploads', express.static('uploads'));

// --- התחברות למסד הנתונים ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => console.log("Successfully connected to MongoDB!"))
    .catch(err => console.error("MongoDB connection error:", err));
// -----------------------------

// --- הגדרת נקודות קצה (API Endpoints) ---

// נקודת קצה ראשית לבדיקה
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Aramaic Game API!' });
});


// חיבור נתב השאלות לשרת
const questionsRouter = require('./routes/questions');
app.use('/questions', questionsRouter);

// --- חיבור נתב המשתמשים לשרת ---
const usersRouter = require('./routes/users.js');
app.use('/users', usersRouter);

// ----------------------------------------

const scoresRouter = require('./routes/scores.js');
app.use('/scores', scoresRouter);

// ----------------------------------------
// הפעלת השרת - פעם אחת בלבד, בסוף הקובץ
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});