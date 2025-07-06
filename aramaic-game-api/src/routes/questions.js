const router = require('express').Router();
const multer = require('multer');
const path = require('path');
let Question = require('../models/question.model');

// --- הגדרות של Multer (נשאר ללא שינוי) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// --- נקודות הקצה (API Endpoints) ---

// GET /questions/ - קבלת כל השאלות (ללא שינוי)
router.route('/').get((req, res) => {
    Question.find()
        .then(questions => res.json(questions))
        .catch(err => res.status(400).json('Error: ' + err));
});

// POST /questions/add - הוספת שאלה חדשה (ללא שינוי)
router.route('/add').post(upload.single('audioFile'), (req, res) => {
    const { word } = req.body;
    const answers = JSON.parse(req.body.answers);
    const audioUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const newQuestion = new Question({ word, answers, audioUrl });

    newQuestion.save()
        .then(() => res.json('Question added successfully!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// --- נקודות קצה חדשות ---

// GET /questions/:id - קבלת נתונים של שאלה ספציפית
router.route('/:id').get((req, res) => {
    Question.findById(req.params.id) // חיפוש לפי המזהה (ID) שהועבר בכתובת
        .then(question => res.json(question))
        .catch(err => res.status(400).json('Error: ' + err));
});

// POST /questions/update/:id - עדכון שאלה קיימת
router.route('/update/:id').post(upload.single('audioFile'), async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json('Error: Question not found.');
        }

        question.word = req.body.word;
        question.answers = JSON.parse(req.body.answers);

        // אם הועלה קובץ שמע חדש, עדכן את הנתיב
        if (req.file) {
            question.audioUrl = `/uploads/${req.file.filename}`;
        }

        await question.save();
        res.json('Question updated!');

    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});
// -------------------------

module.exports = router;