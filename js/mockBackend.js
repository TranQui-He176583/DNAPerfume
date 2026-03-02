import { MOCK_PERFUMES } from "./constants.js";

// --- LocalStorage Helper ---
const DB_KEY = 'perfume_app_db';

const getDb = () => {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
        const initialData = { users: [] };
        localStorage.setItem(DB_KEY, JSON.stringify(initialData));
        return initialData;
    }
    return JSON.parse(data);
};

const saveDb = (data) => {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// --- Logic ---

export const findBestMatchPerfumes = (aiProfile) => {
  // Flatten the AI formula into a set of note names for matching
  const aiNotes = new Set([
    ...aiProfile.top.map(n => n.name.toLowerCase()), 
    ...aiProfile.heart.map(n => n.name.toLowerCase()), 
    ...aiProfile.base.map(n => n.name.toLowerCase())
  ]);

  const scoredPerfumes = MOCK_PERFUMES.map(perfume => {
    let score = 0;
    const pNotes = [
      ...perfume.notes.top, 
      ...perfume.notes.heart, 
      ...perfume.notes.base
    ];

    pNotes.forEach(note => {
      if (aiNotes.has(note.toLowerCase())) {
        score += 1;
      }
    });
    
    return { ...perfume, matchScore: score };
  });

  // Sort by score descending
  scoredPerfumes.sort((a, b) => b.matchScore - a.matchScore);

  // Return top 3
  return scoredPerfumes.slice(0, 3);
};

export const saveSurveyResult = async (userId, result) => {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const db = getDb();
        const userIndex = db.users.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
            db.users[userIndex].savedFormulas.unshift(result);
            saveDb(db);
            return { success: true, formula: result };
        }
        throw new Error("User not found");
    } catch (error) {
        console.error("Save Error:", error);
        return null;
    }
};

export const deleteSurveyResult = async (userId, formulaId) => {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const db = getDb();
        const userIndex = db.users.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
            const user = db.users[userIndex];
            const initialLength = user.savedFormulas.length;
            user.savedFormulas = user.savedFormulas.filter(f => f.id !== formulaId);
            
            if (user.savedFormulas.length < initialLength) {
                saveDb(db);
                return { success: true };
            }
            throw new Error("Formula not found");
        }
        throw new Error("User not found");
    } catch (error) {
        console.error("Delete Error:", error);
        return null;
    }
};

export const loginUser = async (email, password) => {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const db = getDb();
        const user = db.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null; // Login failed
    } catch (error) {
        console.error("Login Error:", error);
        return null;
    }
};

export const registerUser = async (name, email, password) => {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const db = getDb();
        
        if (db.users.find(u => u.email === email)) {
            throw new Error("Email này đã được đăng ký");
        }
        
        const newUser = {
            id: `u-${Date.now()}`,
            name,
            email,
            password,
            savedFormulas: []
        };
        
        db.users.push(newUser);
        saveDb(db);
        
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    } catch (error) {
        console.error("Registration Error:", error);
        throw error;
    }
};
