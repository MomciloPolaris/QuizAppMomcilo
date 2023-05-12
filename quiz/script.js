let category;
let difficulty;
const QUESTION_COUNT = 5;
const QUIZ = document.getElementById(`quiz`);
const INIT = document.getElementById(`init`);
const fetchQuestions = async () => {
    const result = await fetch(`https://the-trivia-api.com/v2/questions?limit=${QUESTION_COUNT}&categories=${category}&difficulty=${difficulty}`);
    return result.json()
}

// Shuffle array reference: https://stackoverflow.com/a/2450976
const randomizeArray = answers => {
    let currentIndex = answers.length,  randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [answers[currentIndex], answers[randomIndex]] = [
            answers[randomIndex], answers[currentIndex]];
    }
    return answers;
}

const answerQuestion = (question, button) => {
    const answer = button.dataset.value;
    const questionElement = document.getElementById(question.id);
    const correctAnswerButton = questionElement.querySelector(`[data-value="${question.correctAnswer}"]`);
    correctAnswerButton.classList.add(`correct`)
    if(question.correctAnswer !== answer) {
        const wrongAnswerButton = questionElement.querySelector(`[data-value="${answer}"]`);
        wrongAnswerButton.classList.add('error');
    }
    setTimeout(() => showNextQuestion (parseInt(questionElement.dataset.index)), 2000)
}

const showNextQuestion = index => {
    const currentQuestionElement = document.querySelector(`.question[data-index="${index}"]`)
    const nextQuestionElement = document.querySelector(`.question[data-index="${index + 1}"]`)
    currentQuestionElement.classList.add('hidden')
    if(nextQuestionElement) nextQuestionElement.classList.remove('hidden')
}

const createQuestionAnswerButtons = (question, button) => {
    const answers = randomizeArray([question.correctAnswer, ...question.incorrectAnswers]);
    return `
        <div>
            ${answers.map(answer => `<button data-value="${answer}">${answer}</button>`)}
        </div>
    `
}

const createQuestionContainer = (question, index) => {
    return `
      <div id="${question.id}" class="question ${index === 0 ? '' : 'hidden'}" data-index="${index}">
        <h1>${category}</h1>
        <div>
            <p>${question.question.text}</p>
        </div>
        <div class="answers">
            ${createQuestionAnswerButtons(question)}
        </div>
      </div>
    `
}

const createQuestionElementsAndSetupListeners = (questions) => {
    questions.map(createQuestionContainer).forEach(container => QUIZ.insertAdjacentHTML('beforeend', container))
    window.requestAnimationFrame(() => {
        questions.forEach((question, index) => {
            const questionParent = document.getElementById(`${question.id}`);
            const buttons = [...questionParent.querySelectorAll('button')];
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    answerQuestion(question, button)
                })
            })
        })
    })
}


const startQuiz = async () => {
    if(!category) return alert(`Select a category`);
    if(!difficulty) return alert(`Select a difficulty`);
    const questions = await fetchQuestions();
    createQuestionElementsAndSetupListeners(questions)
    INIT.classList.add('hidden');
}



