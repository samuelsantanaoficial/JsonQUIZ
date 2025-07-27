// ========== MODO INDIVIDUAL - VERSÃO DEBUGADA ==========
let allQuestions = []; // Array principal com todas as perguntas
let currentIndex = 0;
let playerScore = 0;
let gameTimer = null;
let timeRemaining = 15;

// Event listeners
document.getElementById('questionsFile').addEventListener('change', loadQuestionsFile);

function loadQuestionsFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            if (Array.isArray(jsonData) && jsonData.length > 0) {
                // Fazer uma cópia REAL e INDEPENDENTE
                allQuestions = jsonData.map(q => ({...q}));
                
                document.getElementById('playButton').disabled = false;
                alert(`✅ ${allQuestions.length} perguntas carregadas com sucesso!`);
                
                console.log('=== ARQUIVO CARREGADO ===');
                console.log('Total de perguntas:', allQuestions.length);
                console.log('Primeiras 3 perguntas:', allQuestions.slice(0, 3));
            } else {
                throw new Error('Formato de arquivo inválido');
            }
        } catch (err) {
            alert('❌ Erro ao carregar arquivo JSON. Verifique o formato.');
            console.error('Erro:', err);
        }
    };
    reader.readAsText(file);
}

function startSingleGame() {
    if (allQuestions.length === 0) {
        alert('❌ Carregue um arquivo de perguntas primeiro!');
        return;
    }

    // RESET TOTAL
    currentIndex = 0;
    playerScore = 0;
    stopTimerAndAudio();
    
    // Embaralhar as perguntas (sem modificar o array original)
    const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
    allQuestions = shuffledQuestions;
    
    console.log('=== INICIANDO JOGO ===');
    console.log('Total de perguntas disponíveis:', allQuestions.length);
    console.log('Pergunta inicial (índice 0):', allQuestions[0]);
    
    // Mostrar área do jogo
    document.getElementById('uploadArea').classList.add('d-none');
    document.getElementById('gameArea').classList.remove('d-none');
    
    // Mostrar primeira pergunta
    showCurrentQuestion();
}

function showCurrentQuestion() {
    console.log('=== MOSTRANDO PERGUNTA ===');
    console.log(`Índice atual: ${currentIndex}`);
    console.log(`Total disponível: ${allQuestions.length}`);
    
    // Verificar se acabaram as perguntas
    if (currentIndex >= allQuestions.length) {
        console.log('TODAS AS PERGUNTAS FORAM RESPONDIDAS - FINALIZANDO');
        finishGame();
        return;
    }
    
    const currentQuestion = allQuestions[currentIndex];
    
    if (!currentQuestion) {
        console.error('ERRO: Pergunta não encontrada no índice', currentIndex);
        finishGame();
        return;
    }
    
    console.log(`Mostrando pergunta ${currentIndex + 1}/${allQuestions.length}`);
    console.log('Texto da pergunta:', currentQuestion.quiz);
    
    // Atualizar interface
    document.getElementById('question').textContent = currentQuestion.quiz;
    document.getElementById('scoreDisplay').textContent = `🏅 Pontuação: ${playerScore}`;
    
    // Limpar alternativas anteriores
    const alternativesContainer = document.getElementById('alternatives');
    alternativesContainer.innerHTML = '';
    
    // Criar botões das alternativas
    ['a', 'b', 'c', 'd'].forEach(option => {
        if (currentQuestion[option]) {
            const button = document.createElement('button');
            button.className = 'list-group-item list-group-item-action';
            button.textContent = currentQuestion[option];
            button.onclick = () => selectAnswer(option);
            alternativesContainer.appendChild(button);
        }
    });
    
    // Limpar feedback anterior
    document.getElementById('feedback').classList.add('d-none');
    document.getElementById('reference').classList.add('d-none');
    document.getElementById('nextButton').disabled = true;
    
    // Iniciar timer
    startQuestionTimer();
}

function selectAnswer(selectedOption) {
    console.log('=== RESPOSTA SELECIONADA ===');
    console.log('Opção escolhida:', selectedOption);
    
    stopTimerAndAudio();
    
    const currentQuestion = allQuestions[currentIndex];
    const correctAnswer = currentQuestion.x;
    const correctText = currentQuestion[correctAnswer];
    
    console.log('Resposta correta:', correctAnswer);
    console.log('Está correto?', selectedOption === correctAnswer);
    
    // Desabilitar botões e colorir
    const buttons = document.querySelectorAll('#alternatives button');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctText) {
            btn.classList.add('btn-success');
        } else if (selectedOption && btn.textContent === currentQuestion[selectedOption]) {
            btn.classList.add('btn-danger');
        }
    });
    
    // Mostrar feedback
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.classList.remove('d-none');
    
    if (selectedOption === correctAnswer) {
        playerScore++;
        feedbackElement.className = 'alert alert-success mb-3';
        feedbackElement.textContent = '✅ Resposta correta!';
        document.getElementById('audioSuccess')?.play().catch(() => {});
        console.log('ACERTOU! Nova pontuação:', playerScore);
    } else {
        feedbackElement.className = 'alert alert-danger mb-3';
        if (selectedOption === null) {
            feedbackElement.textContent = `⏰ Tempo esgotado! Resposta correta: "${correctText}"`;
        } else {
            feedbackElement.textContent = `❌ Resposta incorreta. Correta: "${correctText}"`;
        }
        document.getElementById('audioError')?.play().catch(() => {});
        console.log('ERROU. Resposta correta era:', correctAnswer);
    }
    
    // Mostrar referência se existir
    if (currentQuestion.ref || currentQuestion.link) {
        const refElement = document.getElementById('reference');
        refElement.classList.remove('d-none');
        let refHTML = '📚 ';
        if (currentQuestion.ref) refHTML += currentQuestion.ref;
        if (currentQuestion.link) refHTML += ` — <a href="${currentQuestion.link}" target="_blank">${currentQuestion.link}</a>`;
        refElement.innerHTML = refHTML;
    }
    
    // Habilitar botão próxima
    document.getElementById('nextButton').disabled = false;
}

function goToNextQuestion() {
    console.log('=== AVANÇANDO PARA PRÓXIMA ===');
    console.log('Índice antes:', currentIndex);
    
    currentIndex++; // Simplesmente incrementar
    
    console.log('Índice depois:', currentIndex);
    console.log('Restam perguntas?', currentIndex < allQuestions.length);
    
    showCurrentQuestion(); // Vai verificar se acabaram as perguntas
}

function startQuestionTimer() {
    clearInterval(gameTimer);
    
    timeRemaining = 15;
    const timerElement = document.getElementById('timerDisplay');
    timerElement.textContent = timeRemaining;
    timerElement.className = 'text-center display-6 fw-bold text-primary mb-3';
    
    // Iniciar áudio do timer
    const audioTimer = document.getElementById('audioTimer');
    if (audioTimer) {
        audioTimer.volume = 0.5;
        audioTimer.currentTime = 0;
        audioTimer.play().catch(() => {});
    }
    
    gameTimer = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = timeRemaining;
        
        if (timeRemaining <= 5) {
            timerElement.className = 'text-center display-6 fw-bold text-danger mb-3';
        }
        
        if (timeRemaining <= 0) {
            selectAnswer(null); // Tempo esgotado
        }
    }, 1000);
}

function stopTimerAndAudio() {
    clearInterval(gameTimer);
    const audioTimer = document.getElementById('audioTimer');
    if (audioTimer) {
        audioTimer.pause();
        audioTimer.currentTime = 0;
    }
}

function finishGame() {
    console.log('=== JOGO FINALIZADO ===');
    console.log(`Pontuação final: ${playerScore}/${allQuestions.length}`);
    
    stopTimerAndAudio();
    
    const totalQuestions = allQuestions.length;
    const percentage = Math.round((playerScore / totalQuestions) * 100);
    
    document.getElementById('gameArea').innerHTML = `
        <div class="text-center">
            <h2>🎉 Quiz Finalizado!</h2>
            <div class="card mt-4">
                <div class="card-body">
                    <h3>Resultado Final</h3>
                    <p class="fs-4 mb-2">
                        <strong>${playerScore}</strong> de <strong>${totalQuestions}</strong> corretas
                    </p>
                    <p class="fs-5 text-muted">
                        Aproveitamento: <strong>${percentage}%</strong>
                    </p>
                    <div class="progress mb-3">
                        <div class="progress-bar ${percentage >= 70 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-danger'}" 
                             style="width: ${percentage}%"></div>
                    </div>
                </div>
            </div>
            <div class="row g-2 mt-4">
                <div class="col">
                    <button class="btn btn-primary w-100" onclick="backToModeSelector()">
                        🏠 Voltar ao Início
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Event delegation para o botão "Próxima"
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'nextButton') {
        goToNextQuestion();
    }
});