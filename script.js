let quizData = []; // JSON dosyasından yüklenecek
let selectedQuizData = []; // Kullanıcının seçtiği aralıktaki sorular
let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];
let previousAnswers = []; // Önceki cevapları saklamak için

// JSON dosyasını yükle
fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    quizData = data;
    startQuiz();
  })
  .catch(error => {
    console.error('JSON dosyasını yüklerken bir hata oluştu:', error);
  });

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayQuestion() {
  const quizContainer = document.getElementById('quiz');
  quizContainer.style.display = 'block';

  const questionData = selectedQuizData[currentQuestion];
  const questionElement = document.createElement('div');
  questionElement.className = 'question';
  questionElement.innerHTML = questionData.question;

  const optionsElement = document.createElement('div');
  optionsElement.className = 'options';

  const shuffledOptions = [...questionData.options];
  shuffleArray(shuffledOptions);

  for (let i = 0; i < shuffledOptions.length; i++) {
    const option = document.createElement('label');
    option.className = 'option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'quiz';
    radio.value = shuffledOptions[i];

    const optionText = document.createTextNode(shuffledOptions[i]);

    option.appendChild(radio);
    option.appendChild(optionText);
    optionsElement.appendChild(option);
  }

  quizContainer.innerHTML = '';
  quizContainer.appendChild(questionElement);
  quizContainer.appendChild(optionsElement);

  // Önceki cevabı işaretle
  if (previousAnswers[currentQuestion]) {
    const selectedOption = document.querySelector(`input[name="quiz"][value="${previousAnswers[currentQuestion]}"]`);
    if (selectedOption) {
      selectedOption.checked = true;
    }
  }

  // Soru sırasını güncelle
  const questionNumberElement = document.getElementById('questionNumber');
  questionNumberElement.innerText = `Soru sırası: ${currentQuestion + 1}/${selectedQuizData.length}`;
}

function startQuiz() {
  const start = parseInt(localStorage.getItem('startQuestion'));
  const end = parseInt(localStorage.getItem('endQuestion'));

  selectedQuizData = quizData.slice(start, end);
  currentQuestion = 0;
  score = 0;
  incorrectAnswers = [];
  previousAnswers = new Array(selectedQuizData.length).fill(null);

  document.getElementById('submit').style.display = 'inline-block';
  document.getElementById('previous').style.display = 'inline-block';
  displayQuestion();
}

function checkAnswer() {
  const selectedOption = document.querySelector('input[name="quiz"]:checked');
  if (selectedOption) {
    const answer = selectedOption.value;
    previousAnswers[currentQuestion] = answer; // Cevabı sakla
    if (answer === selectedQuizData[currentQuestion].answer) {
      score++;
    } else {
      incorrectAnswers.push({
        question: selectedQuizData[currentQuestion].question,
        incorrectAnswer: answer,
        correctAnswer: selectedQuizData[currentQuestion].answer,
      });
    }
    currentQuestion++;
    if (currentQuestion < selectedQuizData.length) {
      displayQuestion();
    } else {
      displayResult();
    }
  }
}

function showPreviousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
  }
}

function displayResult() {
  const quizContainer = document.getElementById('quiz');
  const resultContainer = document.getElementById('result');
  quizContainer.style.display = 'none';
  document.getElementById('submit').style.display = 'none';
  document.getElementById('previous').style.display = 'none';
  resultContainer.innerHTML = `You scored ${score} out of ${selectedQuizData.length}!`;

  // "Show Answer" ve "Çıkış" butonlarını görünür ve aktif yap
  document.getElementById('showAnswer').classList.remove('hide');
  document.getElementById('exit').classList.remove('hide');
}

function showAnswers() {
  const incorrectAnswersContainer = document.getElementById('incorrectAnswers');
  incorrectAnswersContainer.innerHTML = '<h2>Yanlış Cevaplar:</h2>';
  incorrectAnswers.forEach(answer => {
    const answerElement = document.createElement('div');
    answerElement.innerHTML = `
      <p><strong>Soru:</strong> ${answer.question}</p>
      <p><strong>Verilen Yanıt:</strong> ${answer.incorrectAnswer}</p>
      <p><strong>Doğru Yanıt:</strong> ${answer.correctAnswer}</p>
      <hr>
    `;
    incorrectAnswersContainer.appendChild(answerElement);
  });
  incorrectAnswersContainer.classList.remove('hide');
}

function exitQuiz() {
  window.location.href = 'index.html';
}

document.getElementById('submit').addEventListener('click', checkAnswer);
document.getElementById('previous').addEventListener('click', showPreviousQuestion);
document.getElementById('showAnswer').addEventListener('click', showAnswers);
document.getElementById('exit').addEventListener('click', exitQuiz);