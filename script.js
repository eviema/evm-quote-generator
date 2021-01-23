const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
const error = document.getElementById("error");

function showQuote() {
  quoteContainer.hidden = false;
  loader.hidden = true;
  error.hidden = true;
}

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
  error.hidden = true;
}

function showError() {
  error.hidden = false;
  loader.hidden = true;
  quoteContainer.hidden = true;
}

async function getQuote() {
  showLoadingSpinner();

  const proxyUrl = "https://pure-atoll-40227.herokuapp.com/"; // Author's own proxy server
  const apiUrl =
    "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";

  let attemptCount = 0;

  while (true) {
    try {
      attemptCount += 1;

      const response = await fetch(proxyUrl + apiUrl);
      const data = await response.json();

      authorText.innerText =
        data.quoteAuthor === "" ? "Unknown" : data.quoteAuthor;

      // Reduce font size for long quotes
      if (data.quoteText.length > 50) {
        quoteText.classList.add("long-quote");
      } else {
        quoteText.classList.remove("long-quote");
      }
      quoteText.innerText = data.quoteText;

      showQuote();
      break;
    } catch (error) {
      if (attemptCount >= 3) {
        showError();
        break;
      }
    }
  }
}

function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, "_blank");
}

newQuoteBtn.addEventListener("click", getQuote);
twitterBtn.addEventListener("click", tweetQuote);

// On Load
getQuote();
