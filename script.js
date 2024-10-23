
const questionForm = document.getElementById('discussionForm');
const questionList = document.getElementById('questionList');
const mainContent = document.getElementById('mainContent');
let questions = JSON.parse(localStorage.getItem('questions')) || [];
let currentQuestionIndex = null;

function renderQuestions() {
    questionList.innerHTML = '';
    questions.forEach((question, index) => {
        const questionItem = document.createElement('li');
        questionItem.classList.add('question-item');
        questionItem.textContent = question.subject;
        questionItem.addEventListener('click', () => openQuestion(index));
        questionList.appendChild(questionItem);
    });
}

function openQuestion(index) {
    currentQuestionIndex = index;
    const question = questions[index];
    mainContent.innerHTML = `
        <h2>${question.subject}</h2>
        <p>${question.text}</p>
        <div class="response-section">
            <h3>Responses</h3>
            <div id="responses">
                ${question.responses.map(response => `
                    <div class="response">
                        <strong>${response.name}</strong>: ${response.comment}
                    </div>`).join('')}
            </div>
        </div>
        <form id="responseForm">
            <label for="responseName">Your Name</label>
            <input type="text" id="responseName" placeholder="Your Name" required>
            <label for="responseComment">Your Comment</label>
            <textarea id="responseComment" placeholder="Your Comment" rows="3" required></textarea>
            <button type="submit" class="submit-btn">Submit Response</button>
        </form>
        <button class="resolve-btn" onclick="resolveQuestion()">Resolve</button>
    `;

    document.getElementById('responseForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('responseName').value;
        const comment = document.getElementById('responseComment').value;
        questions[currentQuestionIndex].responses.push({ name, comment });
        localStorage.setItem('questions', JSON.stringify(questions));
        openQuestion(currentQuestionIndex);
    });
}

questionForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const subject = document.getElementById('subject').value;
    const text = document.getElementById('question').value;
    questions.push({ subject, text, responses: [] });
    localStorage.setItem('questions', JSON.stringify(questions));
    renderQuestions();
    questionForm.reset();
});

function resolveQuestion() {
    questions.splice(currentQuestionIndex, 1);
    localStorage.setItem('questions', JSON.stringify(questions));
    renderQuestions();
    mainContent.innerHTML = `
        <h2>Welcome to Discussion Portal!</h2>
        <p>Enter a subject and question to get started</p>
        <form id="discussionForm">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" required>
            
            <label for="question">Question</label>
            <textarea id="question" name="question" rows="4" required></textarea>
            
            <button type="submit" class="submit-btn">Submit</button>
        </form>
    `;
    document.getElementById('discussionForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const subject = document.getElementById('subject').value;
        const text = document.getElementById('question').value;
        questions.push({ subject, text, responses: [] });
        localStorage.setItem('questions', JSON.stringify(questions));
        renderQuestions();
        questionForm.reset();
    });
}

renderQuestions();