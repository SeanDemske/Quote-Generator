const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const prevBtn = document.getElementById('prev-button')
const loader = document.getElementById('loader');
const quoteStorage = [];
let prevQuote = '';
let prevAuthor = '';
let counter = 0;
let init = false;

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Get quote from API
async function getQuote() {
    showLoadingSpinner();
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        const quoteObj = {
            quote: data.quoteText,
            author: data.quoteAuthor
        }

        const { quote, author } = quoteObj;

        // Checking for author
        if (author === '') {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = author;
        }

        // Reduce font size for long quotes
        if (quote.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = quote;

        removeLoadingSpinner();


        if (init){
            enableBackButton();
        }
        init = true;

        storePrevQuote(quoteObj);

    } catch (err) {

        // Infinite Loop handling
        if (counter < 60) {
            counter++
            console.log('whoops, something went from');
            getQuote();
        } else {
            return alert('error please refresh the page');
            counter = 0;
        }
    }
}

function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

function storePrevQuote(quoteObj) {
    quoteStorage.push(quoteObj);

    if (quoteStorage.length > 2) {
        quoteStorage.shift();
    }

    console.log(quoteStorage);

    prevQuote = quoteStorage[0].quote;
    prevAuthor = quoteStorage[0].author;
}

function enableBackButton(prevQuote) {
    prevBtn.disabled = false;
    prevBtn.classList.remove('button-inactive');
}

function disableBackButton(prevQuote) {
    prevBtn.disabled = true;
    prevBtn.classList.add('button-inactive');
}

function backButtonClick() {
    if (prevQuote !== '') {
        quoteText.innerText = prevQuote;
        authorText.innerText = prevAuthor;
        quoteStorage[1].quote = prevQuote;
        quoteStorage[1].author = prevAuthor;
    }
    disableBackButton();

}

// Event listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
prevBtn.addEventListener('click', backButtonClick);

// On Load
getQuote();