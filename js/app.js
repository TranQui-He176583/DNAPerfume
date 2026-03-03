import { MOCK_QUESTIONS, QUESTIONS_PER_STAGE, TOTAL_QUESTIONS, MOCK_PERFUMES } from './constants.js';
import { analyzePersonalityAndRecommend } from './geminiService.js';
import { findBestMatchPerfumes, saveSurveyResult, loginUser, registerUser, deleteSurveyResult } from './mockBackend.js';

// State
const state = {
    currentView: 'HOME',
    user: null,
    survey: {
        currentStage: 0,
        answers: [],
        isLoadingAI: false,
        lastAnalysis: null,
        bestMatches: [],
    },
    formulaToDelete: null // Track which formula is being deleted
};

// DOM Elements
const views = {
    HOME: document.getElementById('view-home'),
    AUTH: document.getElementById('view-auth'),
    REGISTER: document.getElementById('view-register'),
    SURVEY: document.getElementById('view-survey'),
    RESULTS: document.getElementById('view-results'),
    COLLECTION: document.getElementById('view-collection')
};

const userSection = document.getElementById('user-section');
const questionsContainer = document.getElementById('questions-container');
const surveyProgressBar = document.getElementById('survey-progress-bar');
const surveyProgressText = document.getElementById('survey-progress-text');
const btnFinishStage = document.getElementById('btn-finish-stage');
const loadingAi = document.getElementById('loading-ai');
const collectionContainer = document.getElementById('collection-container');
const emptyCollectionMsg = document.getElementById('empty-collection');
const confirmModal = document.getElementById('confirm-modal'); // Modal element

// Toast Notification System
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Icon based on type
    let icon = 'check-circle';
    let bgColor = 'bg-green-500';
    
    if (type === 'error') {
        icon = 'alert-circle';
        bgColor = 'bg-red-500';
    } else if (type === 'info') {
        icon = 'info';
        bgColor = 'bg-blue-500';
    }

    toast.className = `${bgColor} text-white px-6 py-4 rounded shadow-lg flex items-center gap-3 transform transition-all duration-300 translate-x-full pointer-events-auto min-w-[300px]`;
    toast.innerHTML = `
        <i data-lucide="${icon}" class="w-5 h-5"></i>
        <span class="font-medium text-sm">${message}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Navigation
function navigateTo(viewName) {
    state.currentView = viewName;
    
    // Hide all views
    Object.values(views).forEach(el => {
        if (el) {
            el.classList.remove('active');
            el.classList.add('hidden'); // Ensure hidden class is applied
        }
    });
    
    // Show target view
    const target = views[viewName];
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // Refresh icons
    lucide.createIcons();
    
    // Specific view logic
    if (viewName === 'SURVEY') {
        renderSurvey();
    } else if (viewName === 'COLLECTION') {
        renderCollection();
    }

    // Google Analytics Tracking
    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            page_title: viewName,
            page_path: '/' + viewName.toLowerCase()
        });
    }
}

// User Logic
function updateUserUI() {
    if (state.user) {
        userSection.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-brand-900">${state.user.name}</span>
                <button id="btn-logout" class="text-xs text-gray-500 hover:text-red-500">Đăng xuất</button>
            </div>
        `;
        document.getElementById('btn-logout').addEventListener('click', () => {
            state.user = null;
            updateUserUI();
            navigateTo('HOME');
        });
    } else {
        userSection.innerHTML = `
            <button id="btn-login" class="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-brand-500 transition-colors">
                <i data-lucide="user" class="w-4 h-4"></i>
                Đăng Nhập
            </button>
        `;
        document.getElementById('btn-login').addEventListener('click', () => navigateTo('AUTH'));
    }
    lucide.createIcons();
}

// Survey Logic
function renderSurvey() {
    const startQuestionIndex = state.survey.currentStage * QUESTIONS_PER_STAGE;
    const currentQuestions = MOCK_QUESTIONS.slice(startQuestionIndex, startQuestionIndex + QUESTIONS_PER_STAGE);
    
    // Update Progress
    const progress = Math.round((startQuestionIndex / TOTAL_QUESTIONS) * 100);
    surveyProgressBar.style.width = `${progress}%`;
    surveyProgressText.innerText = `${progress}%`;

    // Render Questions
    questionsContainer.innerHTML = currentQuestions.map(q => {
        const existingAnswer = state.survey.answers.find(a => a.questionId === q.id);
        return `
            <div class="animate-fade-in-up">
                <h3 class="font-serif text-xl md:text-2xl mb-6 text-brand-900">${q.text}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="q-options-${q.id}">
                    ${q.options.map(opt => `
                        <button 
                            class="question-option p-4 text-left border transition-all duration-300 hover:border-brand-500 hover:bg-brand-50 ${existingAnswer?.selectedOption === opt ? 'border-brand-900 bg-brand-100 ring-1 ring-brand-900' : 'border-gray-200'}"
                            data-qid="${q.id}"
                            data-opt="${opt}"
                            data-text="${q.text}"
                            data-weight="${q.weight}"
                        >
                            <span class="text-sm text-gray-700">${opt}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    // Attach Event Listeners to Options
    document.querySelectorAll('.question-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btn = e.currentTarget;
            const qid = parseInt(btn.dataset.qid);
            const opt = btn.dataset.opt;
            const text = btn.dataset.text;
            const weight = parseFloat(btn.dataset.weight);

            handleAnswer(qid, text, opt, weight);
        });
    });

    // Initial check in case returning to a partially completed stage
    checkStageCompletion(currentQuestions);
}

function handleAnswer(questionId, questionText, selectedOption, weight) {
    // Remove old answer for this question
    state.survey.answers = state.survey.answers.filter(a => a.questionId !== questionId);
    
    // Add new answer
    state.survey.answers.push({
        questionId,
        questionText,
        selectedOption,
        weight
    });

    // Update UI without re-rendering everything (prevents flickering)
    const optionsContainer = document.getElementById(`q-options-${questionId}`);
    if (optionsContainer) {
        const buttons = optionsContainer.querySelectorAll('.question-option');
        buttons.forEach(btn => {
            const isSelected = btn.dataset.opt === selectedOption;
            if (isSelected) {
                btn.classList.remove('border-gray-200');
                btn.classList.add('border-brand-900', 'bg-brand-100', 'ring-1', 'ring-brand-900');
            } else {
                btn.classList.add('border-gray-200');
                btn.classList.remove('border-brand-900', 'bg-brand-100', 'ring-1', 'ring-brand-900');
            }
        });
    }

    // Check completion
    const startQuestionIndex = state.survey.currentStage * QUESTIONS_PER_STAGE;
    const currentQuestions = MOCK_QUESTIONS.slice(startQuestionIndex, startQuestionIndex + QUESTIONS_PER_STAGE);
    checkStageCompletion(currentQuestions);
}

function checkStageCompletion(currentQuestions) {
    // Get all answered Question IDs
    const answeredIds = new Set(state.survey.answers.map(a => a.questionId));
    
    // Check if every current question ID is in the answered set
    const isStageComplete = currentQuestions.length > 0 && currentQuestions.every(q => answeredIds.has(q.id));
    
    const btn = document.getElementById('btn-finish-stage');
    if (btn) {
        if (isStageComplete) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    }
}

async function finishStage() {
    console.log("Starting finishStage...");
    btnFinishStage.classList.add('hidden');
    
    // Show loading briefly to indicate processing is happening
    loadingAi.classList.remove('hidden');
    state.survey.isLoadingAI = true;

    // Small delay to allow UI to update and prevent "instant" feel which might look like a glitch
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        console.log("Analyzing answers...");
        // Call Gemini (or Mock if no key/error)
        const analysis = await analyzePersonalityAndRecommend(state.survey.answers);
        console.log("Analysis result:", analysis);
        
        // Call Mock Match
        const bestMatches = findBestMatchPerfumes(analysis.scentProfile);
        console.log("Best matches:", bestMatches);

        state.survey.lastAnalysis = analysis;
        state.survey.bestMatches = bestMatches;
        
        renderResults();
        navigateTo('RESULTS');
    } catch (error) {
        console.error("Error in finishStage:", error);
        showToast("Đã xảy ra lỗi phân tích. Vui lòng thử lại.", "error");
        btnFinishStage.classList.remove('hidden'); 
    } finally {
        // Always ensure loading is hidden
        state.survey.isLoadingAI = false;
        loadingAi.classList.add('hidden');
        console.log("Finished finishStage.");
    }
}

// Results Logic
function renderResults() {
    const { lastAnalysis, bestMatches } = state.survey;
    if (!lastAnalysis || !bestMatches || bestMatches.length === 0) return;

    // Date
    document.getElementById('result-date').innerText = `DATE: ${new Date().toLocaleDateString('vi-VN')}`;

    // Personality
    document.getElementById('result-personality').innerText = lastAnalysis.personalitySummary;

    // Reasoning
    document.getElementById('result-reasoning').innerText = lastAnalysis.reasoning;

    // Notes Charts
    const notesContainer = document.getElementById('result-notes');
    notesContainer.innerHTML = '';
    
    ['top', 'heart', 'base'].forEach(layer => {
        const layerNotes = lastAnalysis.scentProfile[layer];
        if (layerNotes && layerNotes.length > 0) {
            const layerHtml = `
                <div>
                    <h4 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-1">${layer} Notes</h4>
                    ${layerNotes.map(note => `
                        <div class="chart-bar-container">
                            <div class="chart-label text-gray-600">${note.name}</div>
                            <div class="chart-bar-bg">
                                <div class="chart-bar-fill" style="width: ${note.percentage}%"></div>
                            </div>
                            <div class="chart-value text-brand-900">${note.percentage}%</div>
                        </div>
                    `).join('')}
                </div>
            `;
            notesContainer.innerHTML += layerHtml;
        }
    });

    // Render Best Matches (Top 3)
    const matchesContainer = document.getElementById('matches-container');
    matchesContainer.innerHTML = bestMatches.map((match, index) => `
        <div class="bg-white group flex items-start gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <div class="relative w-24 h-32 flex-shrink-0 overflow-hidden bg-gray-100 rounded-sm">
                <img 
                    src="${match.imageUrl}" 
                    alt="${match.name}" 
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-1">
                    <h3 class="font-serif text-lg font-bold text-brand-900 leading-tight truncate pr-2">${match.name}</h3>
                    <span class="font-serif text-md font-medium whitespace-nowrap">$${match.price}</span>
                </div>
                <p class="text-xs text-gray-500 uppercase tracking-widest mb-2">Match Score: ${match.matchScore || 'High'}</p>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2 leading-snug">
                    ${match.description}
                </p>
                <div class="flex gap-2">
                    <button class="btn-order bg-brand-900 text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-brand-800 transition-colors flex items-center gap-1 rounded-sm" data-url="${match.productUrl || match.imageUrl}">
                        <i data-lucide="shopping-bag" class="w-3 h-3"></i>
                        Đặt Hàng
                    </button>
                    <button class="btn-save-result border border-black px-4 py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center gap-1 rounded-sm" data-id="${match.id}">
                        <i data-lucide="save" class="w-3 h-3"></i>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Attach listeners for order buttons
    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
             const url = e.currentTarget.dataset.url;
             window.open(url, '_blank');
        });
    });

    // Attach listeners for save buttons
    document.querySelectorAll('.btn-save-result').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const perfumeId = e.currentTarget.dataset.id;
            const match = bestMatches.find(m => m.id === perfumeId);
            handleSaveResult(match);
        });
    });

    // Continue Button Visibility
    const startQuestionIndex = state.survey.currentStage * QUESTIONS_PER_STAGE;
    const hasMoreStages = startQuestionIndex + QUESTIONS_PER_STAGE < TOTAL_QUESTIONS;
    const continueContainer = document.getElementById('continue-survey-container');
    if (hasMoreStages) {
        continueContainer.classList.remove('hidden');
    } else {
        continueContainer.classList.add('hidden');
    }
    
    lucide.createIcons();
}

function renderCollection() {
    if (!state.user || !state.user.savedFormulas || state.user.savedFormulas.length === 0) {
        collectionContainer.innerHTML = '';
        emptyCollectionMsg.classList.remove('hidden');
        return;
    }

    emptyCollectionMsg.classList.add('hidden');
    collectionContainer.innerHTML = state.user.savedFormulas.map(formula => {
        // Find the full perfume details to get the image
        const perfume = MOCK_PERFUMES.find(p => p.id === formula.bestMatchId);
        const imageUrl = perfume ? perfume.imageUrl : 'https://picsum.photos/seed/perfume/200/200'; // Fallback

        return `
        <div class="bg-white border border-brand-100 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col">
            <button class="btn-delete-formula absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-2 z-10 bg-white/80 rounded-full" data-id="${formula.id}" title="Xóa khỏi bộ sưu tập">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
            
            <div class="flex flex-row h-full">
                <!-- Image Section -->
                <div class="w-1/3 min-w-[100px] bg-gray-50 relative overflow-hidden">
                    <img src="${imageUrl}" alt="${formula.bestMatchName}" class="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                </div>

                <!-- Content Section -->
                <div class="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                        <div class="mb-2 border-b border-gray-100 pb-2">
                            <span class="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">${formula.date}</span>
                            <h3 class="font-serif text-lg font-bold text-brand-900 leading-tight">${formula.bestMatchName}</h3>
                        </div>
                        
                        <div class="mb-3">
                            <div class="flex flex-wrap gap-1 mb-2">
                                ${formula.analysis.scentProfile.top.slice(0, 1).map(n => `<span class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">${n.name}</span>`).join('')}
                                ${formula.analysis.scentProfile.heart.slice(0, 1).map(n => `<span class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">${n.name}</span>`).join('')}
                                ${formula.analysis.scentProfile.base.slice(0, 1).map(n => `<span class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">${n.name}</span>`).join('')}
                            </div>
                        </div>
                    </div>

                    <button class="btn-view-detail w-full border border-brand-900 text-brand-900 py-1.5 text-[10px] uppercase tracking-widest hover:bg-brand-900 hover:text-white transition-colors rounded-sm" data-id="${formula.id}">
                        Xem Chi Tiết
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
    
    // Attach listeners for view detail buttons
    document.querySelectorAll('.btn-view-detail').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const formulaId = e.currentTarget.dataset.id;
            handleViewDetail(formulaId);
        });
    });

    // Attach listeners for delete buttons
    document.querySelectorAll('.btn-delete-formula').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling
            const formulaId = e.currentTarget.dataset.id;
            console.log("Delete clicked for:", formulaId);
            handleDeleteFormula(formulaId);
        });
    });

    lucide.createIcons();
}

function handleViewDetail(formulaId) {
    const formula = state.user.savedFormulas.find(f => f.id === formulaId);
    if (!formula) return;

    // Restore analysis state
    state.survey.lastAnalysis = formula.analysis;
    
    // Find the saved product details
    const savedProduct = MOCK_PERFUMES.find(p => p.id === formula.bestMatchId);
    
    // Set bestMatches to just the saved product (or empty array if not found)
    state.survey.bestMatches = savedProduct ? [savedProduct] : [];

    // Render results view
    renderResults();
    
    // Update UI to show this is a saved result (optional: hide "Save" button or change title)
    // For now, we just navigate
    navigateTo('RESULTS');
}

function handleDeleteFormula(formulaId) {
    console.log("handleDeleteFormula called with ID:", formulaId);
    state.formulaToDelete = formulaId;
    confirmModal.classList.remove('hidden');
}

async function executeDeleteFormula() {
    const formulaId = state.formulaToDelete;
    if (!formulaId) return;

    // Hide modal immediately
    confirmModal.classList.add('hidden');
    state.formulaToDelete = null;

    console.log("Proceeding to delete:", formulaId);
    
    try {
        const result = await deleteSurveyResult(state.user.id, formulaId);
        console.log("API Response:", result);

        if (result && result.success) {
            console.log("Delete successful, updating UI...");
            state.user.savedFormulas = state.user.savedFormulas.filter(f => f.id !== formulaId);
            renderCollection();
            showToast("Đã xóa công thức khỏi bộ sưu tập.", "info");
        } else {
            console.error("Delete failed");
            showToast("Không thể xóa công thức. Vui lòng thử lại.", "error");
        }
    } catch (err) {
        console.error("Execute delete error:", err);
        showToast("Lỗi hệ thống khi xóa.", "error");
    }
}

async function handleSaveResult(match) {
    if (!state.user) {
        showToast("Vui lòng đăng nhập để lưu công thức.", "info");
        navigateTo('AUTH');
        return;
    }
    
    if (!state.survey.lastAnalysis || !match) return;

    // Check for duplicates
    // We consider it a duplicate if the same user saves the same perfume match from the same analysis session
    // Since we don't have a session ID, we can compare the analysis object content or just check if this perfume is already saved recently with same notes.
    // A simple check: Does the user already have this perfume saved with the exact same personality summary?
    const isDuplicate = state.user.savedFormulas.some(f => 
        f.bestMatchId === match.id && 
        f.analysis.personalitySummary === state.survey.lastAnalysis.personalitySummary
    );

    if (isDuplicate) {
        showToast("Bạn đã lưu công thức này rồi!", "info");
        return;
    }

    const newFormula = {
        id: `f-${Date.now()}`,
        date: new Date().toLocaleDateString('vi-VN'),
        stageReached: state.survey.currentStage + 1,
        analysis: state.survey.lastAnalysis,
        bestMatchId: match.id,
        bestMatchName: match.name
    };

    await saveSurveyResult(state.user.id, newFormula);
    state.user.savedFormulas.unshift(newFormula);
    showToast(`Đã lưu "${match.name}" vào Bộ Sưu Tập!`);
}

// Event Listeners Setup
function setupEventListeners() {
    // Nav
    document.getElementById('nav-logo').addEventListener('click', () => navigateTo('HOME'));
    document.getElementById('nav-home').addEventListener('click', () => navigateTo('HOME'));
    document.getElementById('nav-collection').addEventListener('click', () => {
        if (!state.user) {
            showToast("Vui lòng đăng nhập để xem bộ sưu tập.", "info");
            navigateTo('AUTH');
        } else {
            navigateTo('COLLECTION');
        }
    });
    
    // Home
    document.getElementById('btn-start-survey').addEventListener('click', () => {
        if (!state.user) {
            showToast("Vui lòng đăng nhập để bắt đầu khám phá mùi hương.", "info");
            navigateTo('AUTH');
            return;
        }

        // Reset survey
        state.survey = {
            currentStage: 0,
            answers: [],
            isLoadingAI: false,
            lastAnalysis: null,
            bestMatches: []
        };
        navigateTo('SURVEY');
    });

    // Auth (Login)
    document.getElementById('auth-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = e.target.querySelector('input[type="email"]');
        const passwordInput = e.target.querySelector('input[type="password"]');

        if (emailInput && passwordInput) {
            const user = await loginUser(emailInput.value, passwordInput.value);
            if (user) {
                state.user = user;
                updateUserUI();
                showToast(`Chào mừng trở lại, ${user.name}!`);
                navigateTo('HOME');
            } else {
                showToast("Email hoặc mật khẩu không đúng.", "error");
            }
        }
    });
    document.getElementById('btn-back-home').addEventListener('click', () => navigateTo('HOME'));
    document.getElementById('btn-go-register').addEventListener('click', () => navigateTo('REGISTER'));

    // Register
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = e.target.querySelector('input[type="text"]');
        const emailInput = e.target.querySelector('input[type="email"]');
        const passwordInput = e.target.querySelector('input[type="password"]');

        if (nameInput && emailInput && passwordInput) {
            try {
                const user = await registerUser(nameInput.value, emailInput.value, passwordInput.value);
                if (user) {
                    state.user = user;
                    updateUserUI();
                    showToast("Đăng ký tài khoản thành công!");
                    navigateTo('HOME');
                }
            } catch (error) {
                showToast(error.message || "Đăng ký thất bại.", "error");
            }
        }
    });
    document.getElementById('btn-go-login').addEventListener('click', () => navigateTo('AUTH'));
    document.getElementById('btn-back-home-reg').addEventListener('click', () => navigateTo('HOME'));

    // Collection
    const btnStartCollection = document.getElementById('btn-start-survey-collection');
    if (btnStartCollection) {
        btnStartCollection.addEventListener('click', () => {
            if (!state.user) {
                showToast("Vui lòng đăng nhập để bắt đầu khám phá mùi hương.", "info");
                navigateTo('AUTH');
                return;
            }

            state.survey = {
                currentStage: 0,
                answers: [],
                isLoadingAI: false,
                lastAnalysis: null,
                bestMatches: []
            };
            navigateTo('SURVEY');
        });
    }

    // Survey
    btnFinishStage.addEventListener('click', finishStage);

    // Results
    document.getElementById('btn-continue-survey').addEventListener('click', () => {
        state.survey.currentStage++;
        state.survey.lastAnalysis = null;
        state.survey.bestMatches = [];
        navigateTo('SURVEY');
    });

    // Confirm Modal
    document.getElementById('btn-confirm-cancel').addEventListener('click', () => {
        confirmModal.classList.add('hidden');
        state.formulaToDelete = null;
    });

    document.getElementById('btn-confirm-delete').addEventListener('click', () => {
        executeDeleteFormula();
    });
}

// Initialize
function init() {
    setupEventListeners();
    updateUserUI();
    lucide.createIcons();
    
    // Expose app to window for global access if needed
    window.app = {
        navigateTo
    };
}

init();
