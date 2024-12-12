
    let quizData = []; // JSON dosyasından yüklenecek
    let selectedQuizData = []; // Kullanıcının seçtiği aralıktaki sorular
    let currentQuestion = 0;
    let score = 0;
    let incorrectAnswers = [];

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
        document.getElementById('questionCount').innerText = `Soru sayısı: ${quizData.length}`;
        document.getElementById('endQuestion').max = quizData.length;
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
    }

    function startQuiz() {
      const startInput = document.getElementById('startQuestion');
      const endInput = document.getElementById('endQuestion');

      const start = parseInt(startInput.value) - 1;
      const end = parseInt(endInput.value);

      if (isNaN(start) || isNaN(end) || start < 0 || end > quizData.length || start >= end) {
        alert('Lütfen geçerli bir başlangıç ve bitiş değeri giriniz.');
        return;
      }

      selectedQuizData = quizData.slice(start, end);
      currentQuestion = 0;
      score = 0;
      incorrectAnswers = [];

      document.querySelector('.range-selector').style.display = 'none';
      document.getElementById('submit').style.display = 'inline-block';
      displayQuestion();
    }

    function checkAnswer() {
      const selectedOption = document.querySelector('input[name="quiz"]:checked');
      if (selectedOption) {
        const answer = selectedOption.value;
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
        selectedOption.checked = false;
        if (currentQuestion < selectedQuizData.length) {
          displayQuestion();
        } else {
          displayResult();
        }
      }
    }

    function displayResult() {
      const quizContainer = document.getElementById('quiz');
      const resultContainer = document.getElementById('result');
      quizContainer.style.display = 'none';
      document.getElementById('submit').style.display = 'none';
      resultContainer.innerHTML = `You scored ${score} out of ${selectedQuizData.length}!`;
    }

    document.getElementById('startQuiz').addEventListener('click', startQuiz);
    document.getElementById('submit').addEventListener('click', checkAnswer);
