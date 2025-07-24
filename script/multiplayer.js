// ========== CÓDIGO PARA MODO MULTIPLAYER ==========
class MultiplayerQuiz {
    constructor() {
        this.players = [
            { name: 'Jogador 1', color: '#007bff', score: 0 },
            { name: 'Jogador 2', color: '#28a745', score: 0 }
        ];
        this.multiQuestions = [];
        this.currentQuestionIndex = 0;
        this.currentPlayerIndex = 0;
        this.timer = null; // Defined as a property of the class
        this.timeLeft = 15; // Defined as a property of the class
        this.gameActive = false;
        this.skippedQuestions = new Set(); // Armazena índices de perguntas já respondidas

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('multiQuestionsFile').addEventListener('change', (e) => this.handleFileUpload(e));
        document.getElementById('addPlayerBtn').addEventListener('click', () => this.addPlayer());
        document.getElementById('removePlayerBtn').addEventListener('click', () => this.removePlayer());
        document.getElementById('startMultiBtn').addEventListener('click', () => this.startGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('newMultiGameBtn').addEventListener('click', () => this.newGame());

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-option')) {
                this.selectColor(e.target);
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('player-input')) {
                this.updatePlayerName(e.target);
            }
        });

        this.renderPlayerSetup();
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const loadedQuestions = JSON.parse(e.target.result);
                if (Array.isArray(loadedQuestions) && loadedQuestions.length > 0) {
                    this.multiQuestions = loadedQuestions;
                    document.getElementById('startMultiBtn').disabled = false;
                    alert(`✅ ${loadedQuestions.length} perguntas carregadas!`);
                } else {
                    throw new Error('Formato inválido');
                }
            } catch (error) {
                alert('❌ Erro ao carregar arquivo. Verifique o formato JSON.');
            }
        };
        reader.readAsText(file);
    }

    addPlayer() {
        if (this.players.length >= 6) {
            alert('Máximo de 6 jogadores permitido!');
            return;
        }

        const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#17a2b8'];
        const usedColors = this.players.map(p => p.color);
        const availableColor = colors.find(color => !usedColors.includes(color)) || colors[0];

        this.players.push({
            name: `Jogador ${this.players.length + 1}`,
            color: availableColor,
            score: 0
        });

        this.renderPlayerSetup();
    }

    removePlayer() {
        if (this.players.length <= 2) {
            alert('Mínimo de 2 jogadores necessário!');
            return;
        }

        this.players.pop();
        this.renderPlayerSetup();
    }

    renderPlayerSetup() {
        const container = document.getElementById('playersContainer');
        container.innerHTML = '';

        this.players.forEach((player, index) => {
            const playerCard = document.createElement('div');
            playerCard.className = 'card mb-3';
            playerCard.dataset.player = index;

            playerCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">Jogador ${index + 1}</h5>
                    <input type="text" class="form-control player-input mb-3" 
                           placeholder="Nome do jogador" value="${player.name}">
                    <div class="d-flex justify-content-center gap-2 flex-wrap">
                        <div class="rounded-circle color-option ${player.color === '#007bff' ? 'border border-3 border-dark' : 'border'}" 
                             data-color="#007bff" style="width: 35px; height: 35px; background: #007bff; cursor: pointer;"></div>
                        <div class="rounded-circle color-option ${player.color === '#28a745' ? 'border border-3 border-dark' : 'border'}" 
                             data-color="#28a745" style="width: 35px; height: 35px; background: #28a745; cursor: pointer;"></div>
                        <div class="rounded-circle color-option ${player.color === '#dc3545' ? 'border border-3 border-dark' : 'border'}" 
                             data-color="#dc3545" style="width: 35px; height: 35px; background: #dc3545; cursor: pointer;"></div>
                        <div class="rounded-circle color-option ${player.color === '#ffc107' ? 'border border-3 border-dark' : 'border'}" 
                             data-color="#ffc107" style="width: 35px; height: 35px; background: #ffc107; cursor: pointer;"></div>
                        <div class="rounded-circle color-option ${player.color === '#6f42c1' ? 'border border-3 border-dark' : 'border'}" 
                             data-color="#6f42c1" style="width: 35px; height: 35px; background: #6f42c1; cursor: pointer;"></div>
                        <div class="rounded-circle color-option ${player.color === '#17a2b8' ? 'border border-3 border-dark' : 'border'}" 
                             data-color="#17a2b8" style="width: 35px; height: 35px; background: #17a2b8; cursor: pointer;"></div>
                    </div>
                </div>
            `;

            container.appendChild(playerCard);
        });
    }

    selectColor(colorElement) {
        const playerCard = colorElement.closest('.card');
        const playerIndex = parseInt(playerCard.dataset.player);
        const color = colorElement.dataset.color;

        // Remove seleção anterior
        playerCard.querySelectorAll('.color-option').forEach(option => {
            option.className = option.className.replace('border-3 border-dark', '');
            if (!option.className.includes('border')) {
                option.classList.add('border');
            }
        });

        // Adiciona nova seleção
        colorElement.classList.add('border-3', 'border-dark');
        this.players[playerIndex].color = color;
    }

    updatePlayerName(inputElement) {
        const playerCard = inputElement.closest('.card');
        const playerIndex = parseInt(playerCard.dataset.player);
        this.players[playerIndex].name = inputElement.value || `Jogador ${playerIndex + 1}`;
    }

    startGame() {
        if (this.multiQuestions.length === 0) {
            alert('❌ Carregue um arquivo de perguntas primeiro!');
            return;
        }

        this.players.forEach(player => player.score = 0);
        this.currentQuestionIndex = 0;
        this.currentPlayerIndex = 0;
        this.gameActive = true;
        this.skippedQuestions.clear();

        this.multiQuestions = this.shuffleArray(this.multiQuestions);

        document.getElementById('multiSetup').classList.add('d-none');
        document.getElementById('multiGame').classList.remove('d-none');

        this.displayQuestion();
        this.updateScoreboard();
    }

    displayQuestion() {
        // Pula perguntas já respondidas
        while (this.currentQuestionIndex < this.multiQuestions.length &&
            this.skippedQuestions.has(this.currentQuestionIndex)) {
            this.currentQuestionIndex++;
        }

        if (this.currentQuestionIndex >= this.multiQuestions.length) {
            this.endGame();
            return;
        }

        const question = this.multiQuestions[this.currentQuestionIndex];
        const currentPlayer = this.players[this.currentPlayerIndex];

        document.getElementById('multiQuestion').textContent = question.quiz;
        document.getElementById('currentPlayerDisplay').textContent = `Vez de: ${currentPlayer.name}`;
        document.getElementById('currentPlayerDisplay').style.backgroundColor = currentPlayer.color;

        const alternativesContainer = document.getElementById('multiAlternatives');
        alternativesContainer.innerHTML = '';

        ['a', 'b', 'c', 'd'].forEach(option => {
            const button = document.createElement('button');
            button.className = 'list-group-item list-group-item-action';
            button.textContent = question[option];
            button.onclick = () => this.selectAnswer(option);
            alternativesContainer.appendChild(button);
        });

        this.startTimer();
        this.updateProgress();
    }

    startTimer() {
        clearInterval(this.timer); // Use this.timer
        this.timeLeft = 15; // Use this.timeLeft

        const timerDisplay = this.createOrGetTimerDisplay(); // Call local helper method
        timerDisplay.textContent = this.timeLeft;
        timerDisplay.classList.remove('text-danger');
        timerDisplay.classList.add('text-primary');

        this.timer = setInterval(() => { // Use this.timer
            this.timeLeft--; // Use this.timeLeft
            timerDisplay.textContent = this.timeLeft;

            if (this.timeLeft <= 5) {
                timerDisplay.classList.add('text-danger');
                timerDisplay.classList.remove('text-primary');
            }

            if (this.timeLeft <= 0) {
                clearInterval(this.timer); // Use this.timer
                this.selectAnswer(null); // Call the correct method
            }
        }, 1000);
    }

    // Helper method for multiplayer timer display
    createOrGetTimerDisplay() {
        let timerElement = document.getElementById('timerDisplay');
        // Ensure this is the timer display for the multiplayer section
        // The HTML already has an ID 'timerDisplay' within multiGame, so we just need to target that one.
        if (!timerElement) {
             // Fallback, though it should exist based on index.html
            timerElement = document.createElement('div');
            timerElement.id = 'timerDisplay';
            document.getElementById('multiGame').prepend(timerElement); // Adjust where it's inserted if needed
        }
        return timerElement;
    }

    selectAnswer(selectedOption) {
        if (!this.gameActive) return;

        clearInterval(this.timer);
        const question = this.multiQuestions[this.currentQuestionIndex];
        const buttons = document.querySelectorAll('#multiAlternatives button');
        const audioSuccess = document.getElementById('audioSuccess');
        const audioError = document.getElementById('audioError');
        let isCorrect = selectedOption === question.x;

        buttons.forEach(button => {
            button.disabled = true;
            if (button.textContent === question[question.x]) {
                button.classList.add('btn-success');
            } else if (selectedOption && button.textContent === question[selectedOption]) {
                button.classList.add('btn-danger');
            }
        });

        // MARCA A PERGUNTA COMO RESPONDIDA (independente de success ou error)
        this.skippedQuestions.add(this.currentQuestionIndex);

        if (isCorrect) {
            this.players[this.currentPlayerIndex].score += 1;
            audioSuccess.play();
        } else {
            audioError.play();
        }

        // Add a small delay to show the correct/incorrect answer before moving to the next turn
        setTimeout(() => {
            this.nextTurn();
        }, 500);
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

        // Avança para a próxima pergunta quando voltar para o primeiro jogador
        // This logic ensures that a new question is presented only after all players have had a turn on the current question.
        // However, with `skippedQuestions`, the logic needs to ensure it only moves to a *new* question that hasn't been answered yet.
        // The `displayQuestion` method already handles skipping `skippedQuestions`.
        // So, we just need to ensure that the game ends if all questions are skipped/answered.

        // The current implementation of `nextTurn` will move to the next player.
        // The `displayQuestion` method itself will check `this.currentQuestionIndex` and `this.skippedQuestions`
        // to find the next valid question or end the game.
        
        // If it's the first player's turn again, we advance the question index.
        // This is a common way to cycle through questions in turn-based multiplayer.
        if (this.currentPlayerIndex === 0) {
            this.currentQuestionIndex++;
        }
        
        // Check if there are any remaining unanswered questions
        let allQuestionsAnswered = true;
        for (let i = 0; i < this.multiQuestions.length; i++) {
            if (!this.skippedQuestions.has(i)) {
                allQuestionsAnswered = false;
                break;
            }
        }

        if (allQuestionsAnswered) {
            this.endGame();
        } else {
            // Find the next unskipped question for the current player's turn
            this.displayQuestion();
            this.updateScoreboard();
        }
    }

    updateScoreboard() {
        const scoreboard = document.getElementById('scoreboard');
        scoreboard.innerHTML = '<h5 class="mb-3">Placar</h5>';

        this.players.forEach(player => {
            const scoreCard = document.createElement('div');
            scoreCard.className = 'card mb-2';
            scoreCard.style.borderLeft = `5px solid ${player.color}`;

            scoreCard.innerHTML = `
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <strong>${player.name}</strong>
                        <span class="badge bg-primary">${player.score} pontos</span>
                    </div>
                </div>
            `;

            scoreboard.appendChild(scoreCard);
        });
    }

    updateProgress() {
        const totalQuestions = this.multiQuestions.length;
        // The progress should reflect the number of *unique* questions that have been answered
        const questionsAnsweredCount = this.skippedQuestions.size; 
        const progress = totalQuestions > 0 ? (questionsAnsweredCount / totalQuestions) * 100 : 0;

        document.getElementById('progressFill').style.width = `${Math.min(progress, 100)}%`;
    }

    endGame() {
        this.gameActive = false;
        clearInterval(this.timer); // Stop the timer when the game ends
        document.getElementById('multiGame').classList.add('d-none');
        document.getElementById('multiResults').classList.remove('d-none');

        const sortedPlayers = [...this.players].sort((a, b) => b.score - a.score);

        const finalScoreboard = document.getElementById('finalScoreboard');
        finalScoreboard.innerHTML = '';

        sortedPlayers.forEach((player, index) => {
            const scoreCard = document.createElement('div');
            scoreCard.className = 'card mb-2';
            scoreCard.style.borderLeft = `5px solid ${player.color}`;

            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

            scoreCard.innerHTML = `
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <strong>${medal} ${player.name}</strong>
                        <span class="badge bg-primary fs-6">${player.score} pontos</span>
                    </div>
                </div>
            `;

            finalScoreboard.appendChild(scoreCard);
        });

        const winner = sortedPlayers[0];
        const winners = sortedPlayers.filter(p => p.score === winner.score);

        let announcement = '';
        if (winners.length === 1) {
            announcement = `🎉 ${winner.name} venceu com ${winner.score} pontos!`;
        } else {
            const winnerNames = winners.map(w => w.name).join(' e ');
            announcement = `🤝 Empate entre ${winnerNames} com ${winner.score} pontos!`;
        }

        document.getElementById('winnerAnnouncement').textContent = announcement;
    }

    restartGame() {
        this.startGame();
    }

    newGame() {
        this.players.forEach(player => player.score = 0);
        this.currentQuestionIndex = 0;
        this.currentPlayerIndex = 0;
        this.gameActive = false;
        this.skippedQuestions.clear();

        document.getElementById('multiResults').classList.add('d-none');
        document.getElementById('multiSetup').classList.remove('d-none');

        this.renderPlayerSetup();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}