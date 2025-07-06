const titles = [
    { score: 20, name: "מתחיל בלימוד גמרא" },
    { score: 40, name: "תלמיד חיידר" },
    { score: 60, name: "בחור בישיבה קטנה" },
    { score: 80, name: "בחור בישיבה גדולה" },
    { score: 100, name: "אברך חשוב" },
    { score: 120, name: "רב בית כנסת" },
    { score: 140, name: "רב שכונה" },
    { score: 160, name: "ר\"מ בישיבה קטנה" },
    { score: 180, name: "ר\"מ בישיבה גדולה" },
    { score: 200, name: "ראש ישיבה קטנה" },
    { score: 220, name: "ראש ישיבה גדולה" },
    { score: 240, name: "ראש כולל" },
    { score: 260, name: "דיין חשוב" },
    { score: 280, name: "רב עיר" },
    { score: 300, name: "גאון גדול" },
    { score: 320, name: "תלמיד חכם חשוב" },
    { score: 340, name: "למדן מופלג" },
    { score: 360, name: "מגדולי הדור" },
    { score: 380, name: "מגדולי ישראל" },
    { score: 400, name: "רבן של כל בני הגולה" }
];

const getTitleForScore = (score) => {
    let highestTitle = null;
    for (const title of titles) {
        if (score >= title.score) {
            highestTitle = title.name;
        } else {
            break;
        }
    }
    return highestTitle;
};

module.exports = { titles, getTitleForScore };
