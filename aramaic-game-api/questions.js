const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Question = require('./src/models/question.model.js');

require('dotenv').config();

// --- הגדרות ---
// שימוש בשם הקובץ החדש והפשוט שהורדת
const CSV_FILE_PATH = path.join(__dirname, 'aramit.csv');
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("שגיאה: משתנה הסביבה MONGO_URI לא הוגדר בקובץ .env");
    process.exit(1);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const importQuestions = async () => {
    console.log('מתחיל תהליך יבוא שאלות...');
    try {
        await mongoose.connect(MONGO_URI);
        console.log('התחברות למסד הנתונים הצליחה.');

        const questionsToInsert = [];

        fs.createReadStream(CSV_FILE_PATH)
            .pipe(csv({ headers: false }))
            .on('data', (row) => {
                const word = row[0];
                const option1 = row[1];
                const option2 = row[2];
                const option3 = row[3];
                const option4 = row[4];
                const correctText = row[5];

                if (word && correctText && option1 && option2 && option3 && option4) {
                    const allOptions = [option1, option2, option3, option4];
                    const answers = allOptions.map(optionText => ({
                        text: optionText.trim(),
                        isCorrect: optionText.trim() === correctText.trim()
                    }));

                    const correctAnswersCount = answers.filter(a => a.isCorrect).length;
                    if (correctAnswersCount === 1) {
                        questionsToInsert.push({
                            word: word.trim(),
                            answers: shuffle(answers)
                        });
                    } else {
                        console.warn(`אזהרה: בשורה של המילה "${word}" נמצאו ${correctAnswersCount} תשובות נכונות. מדלג על שורה זו.`);
                    }
                }
            })
            .on('end', async () => {
                console.log(`קריאת קובץ ה-CSV הסתיימה. נמצאו ${questionsToInsert.length} שאלות תקינות לעיבוד.`);
                if (questionsToInsert.length > 0) {
                    try {
                        console.log('מוחק את כל השאלות הקיימות...');
                        await Question.deleteMany({});
                        console.log('כל השאלות הקיימות נמחקו.');
                        console.log('מכניס את השאלות החדשות למסד הנתונים...');
                        await Question.insertMany(questionsToInsert);
                        console.log(`הצלחה! ${questionsToInsert.length} שאלות חדשות הוכנסו למסד הנתונים.`);
                    } catch (error) {
                        console.error('שגיאה במהלך הכנסת השאלות למסד הנתונים:', error);
                    }
                }
                await mongoose.connection.close();
                console.log('החיבור למסד הנתונים נסגר.');
                process.exit(0);
            });
    } catch (error) {
        console.error('שגיאה כללית בתהליך היבוא:', error);
        process.exit(1);
    }
};

importQuestions();