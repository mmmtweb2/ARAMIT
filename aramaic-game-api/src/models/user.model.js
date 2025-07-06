const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, // ודא שכל שם משתמש הוא ייחודי
        trim: true, // מנקה רווחים לבנים מההתחלה והסוף
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    currentTitle: { type: String, default: null },

    titleProgress: { type: Number, default: 0 },

    correctAnswersCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
});

// "Middleware" שירוץ אוטומטית *לפני* כל שמירה של משתמש
userSchema.pre('save', async function (next) {
    // הפעל את ההצפנה רק אם הסיסמה חדשה או השתנתה
    if (!this.isModified('password')) {
        return next();
    }
    // "Salt" הוא תוספת אקראית שהופכת את ההצפנה לחזקה יותר
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;