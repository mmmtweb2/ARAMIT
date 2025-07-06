export interface ScoreEntry {
    rank: number;
    name: string;
    score: number;
}

export const mockLeaderboard: ScoreEntry[] = [
    { rank: 1, name: "רבי עקיבא", score: 120 },
    { rank: 2, name: "רשב\"י", score: 115 },
    { rank: 3, name: "האר\"י הקדוש", score: 108 },
    { rank: 4, name: "משה רבנו", score: 95 },
    { rank: 5, name: "דוד המלך", score: 87 },
    { rank: 6, name: "שלמה המלך", score: 82 },
    { rank: 7, name: "אברהם אבינו", score: 70 },
];