import { GoogleGenAI, Type } from "@google/genai";
import { AVAILABLE_NOTES } from "./constants.js";

// Initialize Gemini Client
// The API key is injected into the window object by the server in config.js
const apiKey = window.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const scentNoteSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        percentage: { type: Type.NUMBER, description: "Percentage of this note in the formula (0-100)" }
    },
    required: ["name", "percentage"]
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        personalitySummary: {
            type: Type.STRING,
            description: "A 2-sentence summary of the user's personality based on answers in Vietnamese.",
        },
        scentProfile: {
            type: Type.OBJECT,
            properties: {
                top: { type: Type.ARRAY, items: scentNoteSchema },
                heart: { type: Type.ARRAY, items: scentNoteSchema },
                base: { type: Type.ARRAY, items: scentNoteSchema },
            },
            description: "Recommended scent notes with percentages based on personality. Total percentage should sum to 100%.",
        },
        reasoning: {
            type: Type.STRING,
            description: "Explanation of why these notes fit the personality in Vietnamese.",
        },
    },
    required: ["personalitySummary", "scentProfile", "reasoning"],
};

// Helper for Fisher-Yates shuffle (better randomness)
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const MOCK_SUMMARIES = [
    "Bạn là người có cá tính mạnh mẽ, quyết đoán nhưng cũng đầy tinh tế.",
    "Tâm hồn bạn lãng mạn, bay bổng và yêu thích sự tự do.",
    "Bạn mang vẻ đẹp bí ẩn, sâu sắc và nội tâm phong phú.",
    "Sự năng động, trẻ trung và lạc quan là điểm nổi bật của bạn.",
    "Bạn là người điềm tĩnh, vững chãi và đáng tin cậy.",
    "Bạn sở hữu trực giác nhạy bén và gu thẩm mỹ tinh tế.",
    "Một tâm hồn cổ điển, yêu thích những giá trị trường tồn."
];

const MOCK_REASONINGS = [
    "Sự kết hợp này cân bằng giữa năng lượng và sự ổn định, phản ánh đúng con người bạn.",
    "Các nốt hương này tôn lên vẻ đẹp nội tâm và khí chất riêng biệt của bạn.",
    "Cấu trúc mùi hương này phóng khoáng như chính cách bạn nhìn nhận cuộc sống.",
    "Sự pha trộn táo bạo này dành riêng cho cá tính không trộn lẫn của bạn.",
    "Một bản giao hưởng mùi hương nhẹ nhàng nhưng để lại ấn tượng sâu sắc.",
    "Công thức này được thiết kế để khơi gợi những ký ức đẹp nhất của bạn."
];

// Dynamic mock response to prevent "always Bergamot" if API fails
const getMockResponse = () => {
    // Shuffle all notes to ensure uniqueness across layers
    const shuffledNotes = shuffleArray(AVAILABLE_NOTES);
    let noteIndex = 0;

    const getLayerNotes = (minCount, maxCount, totalPercent) => {
        const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
        const selectedNotes = [];

        // Distribute percentage roughly
        const avgPercent = Math.floor(totalPercent / count);
        let remainingPercent = totalPercent;

        for (let i = 0; i < count; i++) {
            const name = shuffledNotes[noteIndex % shuffledNotes.length];
            noteIndex++;

            let percent;
            if (i === count - 1) {
                percent = remainingPercent; // Last note gets the rest
            } else {
                // Randomize slightly around average
                const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
                // Ensure percent is at least 5 and leaves enough for remaining notes (at least 5 each)
                const maxPossible = remainingPercent - (count - 1 - i) * 5;
                percent = Math.max(5, Math.min(avgPercent + variation, maxPossible));

                remainingPercent -= percent;
            }

            selectedNotes.push({ name, percentage: percent });
        }
        return selectedNotes;
    };

    return {
        personalitySummary: MOCK_SUMMARIES[Math.floor(Math.random() * MOCK_SUMMARIES.length)],
        scentProfile: {
            top: getLayerNotes(2, 3, 20),   // 2-3 notes, ~20% total
            heart: getLayerNotes(2, 3, 30), // 2-3 notes, ~30% total
            base: getLayerNotes(2, 4, 50)   // 2-4 notes, ~50% total
        },
        reasoning: MOCK_REASONINGS[Math.floor(Math.random() * MOCK_REASONINGS.length)]
    };
};

export const analyzePersonalityAndRecommend = async (answers) => {
    console.log("AI Analysis skipped. Using mock data for instant results.");

    // Simulate a short processing delay for better UX (1.5 seconds)
    // This is much faster than the real API (5-10s) but feels natural
    await new Promise(resolve => setTimeout(resolve, 1500));

    return getMockResponse();
};
