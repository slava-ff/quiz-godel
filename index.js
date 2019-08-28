if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

const wrapper = document.getElementById('wrapper');

const questions = [
    {
        "question": "How many employees are in Godel Technologies?",
        "answers": [
            "500+",
            "1000+",
            "1500+"
        ],
        "right": "1000+"
    }, 

    {
        "question": "What is the staff growth for the last 5 years?",
        "answers": [
            "~500%",
            "~350%",
            "~100%",
            "~50%"
        ],
        "right": "~500%"
    }, 

    {
        "question": "Godel Technologies is [...] owned business.",
        "answers": [
            "Belarus",
            "USA",
            "UK",
            "Cyprus",
            "Malta"
        ],
        "right": "UK"
    }, 

    {
        "question": "Software development methodology in Godel is ...",
        "answers": [
            "Waterfall",
            "Agile",
            "Offshore",
            "Spiral"
        ],
        "right": "Agile"
    }, 

    {
        "question": "Gender balance diversity in Godel management team is ... (female / male)",
        "answers": [
            "51% / 49%",
            "49% / 51%",
            "56% / 44%",
            "44% / 56%",
            "50% / 50%"
        ],
        "right": "56% / 44%"
    }, 

    {
        "question": "Godel Technologies was based in:",
        "answers": [
            "1999",
            "2001",
            "2002",
            "2003",
            "2008",
            "2015"
        ],
        "right": "2002"
    }, 

    {
        "question": "Does Slava want to work in Godel?",
        "answers": [
            "definitely YES",
            "not really"
        ],
        "right": "definitely YES"
    } 
]

const state = {
    currentQuestion: 0,
    rightAnswers: 0,
    chosenAnswers: []
}

// got from google - makes random order of elements in array
function shuffle(array) {
    let m = array.length, t, i;

    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
};

function generateQuestion(questions, state) {
    const markup = `
        <div id="question"></div>
        <ul id="answers"></ul>
    `;
    const currentQuestion = questions[state.currentQuestion].question;
    const currentAnswers = shuffle(questions[state.currentQuestion].answers); // mix order of answers to except cheating
    
    wrapper.innerHTML = markup;
    document.getElementById('question').innerHTML = currentQuestion;

    for (let i = 0; i < currentAnswers.length; i++) {
        const answer = `<li>${currentAnswers[i]}</li>`;
        document.getElementById('answers').insertAdjacentHTML('beforeend', answer);
    }
}

function generateResult(questions, state) {
    const markup = `
        <div id="result"></div>
        <div id="congrats"></div>
        <ul id="mistakes">
            <li>
                <div class="usersAnswer">Your answers:</div>
                <div class="rightAnswer">Right answers:</div>
            </li>
        </ul>
    `;
    let congrat;
    let result = state.rightAnswers / questions.length;

    if (result === 0) congrat = 'Too bad! "0" is not a result really...';
    else if (result > 0 && result < 0.5) congrat = 'Bad result. You can do better!';
    else if (result >= 0.5 && result < 1) congrat = 'Not bad! You passed :)';
    else if (result === 1) congrat = 'Well done! Perfect win!';

    wrapper.innerHTML = markup;
    document.getElementById('result').innerHTML = `Your result is ${state.rightAnswers} of ${questions.length}`;
    document.getElementById('congrats').innerHTML = congrat;

    for (let i = 0; i < questions.length; i++) {
        const markupResults = `
            <li>
                <div class="usersAnswer options">${state.chosenAnswers[i]}</div>
                <div class="rightAnswer options">${questions[i].right}</div>
            </li>
        `;
        document.getElementById('mistakes').insertAdjacentHTML('beforeend', markupResults);
    }
}

function generateContent(questions, state) {
    if (state.currentQuestion < questions.length) generateQuestion(questions, state);
    else generateResult(questions, state);
}

wrapper.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        if (e.target.innerHTML == questions[state.currentQuestion].right) {
            console.log(true);
            state.rightAnswers++;
        } else console.log(false);
        state.chosenAnswers[state.currentQuestion] = e.target.innerHTML;
        state.currentQuestion++;
        generateContent(questions, state);
    }
})

shuffle(questions);
generateContent(questions, state);