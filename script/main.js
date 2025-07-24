// ========== CONTROLE DE NAVEGAÇÃO ENTRE MODOS ==========
let multiplayerQuiz = null;

// Seletor de modo
document.getElementById('singlePlayerBtn').addEventListener('click', () => {
    document.getElementById('modeSelector').classList.add('d-none');
    document.getElementById('singlePlayerMode').classList.remove('d-none');
});

document.getElementById('multiPlayerBtn').addEventListener('click', () => {
    document.getElementById('modeSelector').classList.add('d-none');
    document.getElementById('multiPlayerMode').classList.remove('d-none');

    if (!multiplayerQuiz) {
        multiplayerQuiz = new MultiplayerQuiz();
    }
});

// Função para voltar ao seletor de modo
function backToModeSelector() {
    document.getElementById('modeSelector').classList.remove('d-none');
    document.getElementById('singlePlayerMode').classList.add('d-none');
    document.getElementById('multiPlayerMode').classList.add('d-none');

    // Reset do modo individual
    document.getElementById('uploadArea').classList.remove('d-none');
    document.getElementById('gameArea').classList.add('d-none');
    document.getElementById('playButton').disabled = true;
    document.getElementById('questionsFile').value = '';

    // Reset variáveis do modo individual
    questions = [];
    currentQuestionIndex = 0;
    usedQuestions = [];

    const audioTimer = document.getElementById('audioTimer');
    audioTimer.pause();
    audioTimer.currentTime = 0;

}

// Função para voltar às configurações do multiplayer
function backToMultiSetup() {
    document.getElementById('multiGame').classList.add('d-none');
    document.getElementById('multiResults').classList.add('d-none');
    document.getElementById('multiSetup').classList.remove('d-none');

    if (multiplayerQuiz) {
        clearInterval(multiplayerQuiz.timer);
        multiplayerQuiz.gameActive = false;
    }

    const audioTimer = document.getElementById('audioTimer');
    audioTimer.pause();
    audioTimer.currentTime = 0;

}