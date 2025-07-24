// ========== MODO INDIVIDUAL COM PONTUAÇÃO E TIMER ==========
let questions = [];
let currentQuestionIndex = 0;
let usedQuestions = [];
let score = 0;
let timer = null;
let timeLeft = 30;

document.getElementById('questionsFile').addEventListener('change', handleFileUpload);
document.getElementById('nextButton').addEventListener('click', nextQuestion);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data) && data.length > 0) {
                questions = data;
                document.getElementById('playButton').disabled = false;
                alert(`✅ ${data.length} perguntas carregadas!`);
            } else {
                throw new Error();
            }
        } catch (err) {
            alert('❌ Erro ao carregar perguntas. Verifique o formato JSON.');
        }
    };
    reader.readAsText(file);
}

function startSingleGame() {
    if (questions.length === 0) {
        alert('❌ Nenhuma pergunta carregada.');
        return;
    }

    currentQuestionIndex = 0;
    usedQuestions = [];
    score = 0;

    document.getElementById('uploadArea').classList.add('d-none');
    document.getElementById('gameArea').classList.remove('d-none');

    renderQuestion();
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    if (!question) return endGame();

    document.getElementById('question').textContent = question.quiz;
    document.getElementById('alternatives').innerHTML = '';
    document.getElementById('feedback').classList.add('d-none');
    document.getElementById('reference').classList.add('d-none');
    document.getElementById('nextButton').disabled = true;

    updateScoreDisplay();
    startTimer();

    ['a', 'b', 'c', 'd'].forEach((opt) => {
        const button = document.createElement('button');
        button.className = 'list-group-item list-group-item-action';
        button.textContent = question[opt];
        button.onclick = () => checkAnswer(opt);
        document.getElementById('alternatives').appendChild(button);
    });
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 15;

    const timerDisplay = createOrGetTimerDisplay();
    timerDisplay.textContent = timeLeft;
    timerDisplay.classList.remove('text-danger');
    timerDisplay.classList.add('text-primary');

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 5) {
            timerDisplay.classList.add('text-danger');
            timerDisplay.classList.remove('text-primary');
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null); // tempo esgotado
        }
    }, 1000);
}

function checkAnswer(selected) {
    clearInterval(timer);

    const question = questions[currentQuestionIndex];
    const correct = question.x;
    const correctText = question[correct];
    const buttons = document.querySelectorAll('#alternatives button');
    const audioSuccess = document.getElementById('audioSuccess');
    const audioError = document.getElementById('audioError');

    buttons.forEach((btn) => {
        btn.disabled = true;
        if (btn.textContent === correctText) {
            btn.classList.add('btn-success');
        } else if (btn.textContent === question[selected]) {
            btn.classList.add('btn-danger');
        }
    });

    const feedback = document.getElementById('feedback');
    feedback.classList.remove('d-none');

    if (selected === correct) {
        score++;
        updateScoreDisplay();
        feedback.className = 'alert alert-success mb-3';
        feedback.textContent = '✅ Resposta correta!';
        audioSuccess.play();
    } else {
        feedback.className = 'alert alert-danger mb-3';
        feedback.textContent = `❌ Resposta incorreta. A correta era: "${correctText}".`;
        audioError.play();
    }

    const ref = question.ref || question.referencia;
    if (ref) {
        const refDiv = document.getElementById('reference');
        refDiv.textContent = `📚 ${ref}`;
        refDiv.classList.remove('d-none');
    }

    document.getElementById('nextButton').disabled = false;
}


function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
        endGame();
    } else {
        renderQuestion();
    }
}

function endGame() {
    document.getElementById('gameArea').innerHTML = `
        <h2 class="text-center">🎉 Fim do Quiz!</h2>
        <p class="text-center fs-4">Pontuação final: <strong>${score}</strong> ponto(s)</p>
        <button class="btn btn-primary w-100 mt-3" onclick="backToModeSelector()">Voltar ao Início</button>
    `;
}

// ====== Auxiliares ======
function updateScoreDisplay() {
    let scoreDiv = document.getElementById('scoreDisplay');
    if (!scoreDiv) {
        scoreDiv = document.createElement('div');
        scoreDiv.id = 'scoreDisplay';
        scoreDiv.className = 'alert alert-info text-center';
        document.getElementById('gameArea').prepend(scoreDiv);
    }
    scoreDiv.textContent = `🏅 Pontuação: ${score}`;
}

function createOrGetTimerDisplay() {
    let timer = document.getElementById('timerDisplay');
    if (!timer) {
        timer = document.createElement('div');
        timer.id = 'timerDisplay';
        timer.className = 'text-center display-6 fw-bold text-primary mb-3';
        document.getElementById('gameArea').insertBefore(timer, document.getElementById('question'));
    }
    return timer;
}
