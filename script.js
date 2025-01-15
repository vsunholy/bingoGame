document.addEventListener("DOMContentLoaded", () => {
  const wordInput = document.getElementById("wordInput");
  const generateCardButton = document.getElementById("generateCard");
  const bingoCard = document.getElementById("bingoCard");
  const notification = document.getElementById("notification");
  const container = document.querySelector(".container");

  // Load saved words from localStorage
  const savedWords = JSON.parse(localStorage.getItem("simonaBingoWords")) || [];
  if (savedWords.length > 0) generateBingoCard(savedWords);

  generateCardButton.addEventListener("click", () => {
      const words = wordInput.value.split(",").map(word => word.trim()).filter(word => word);
      if (words.length < 5) {
          alert("Please enter at least 5 words to generate a Bingo card.");
          return;
      }
      localStorage.setItem("simonaBingoWords", JSON.stringify(words));
      generateBingoCard(words);
  });

  function generateBingoCard(words) {
      bingoCard.innerHTML = ""; // Clear existing card
      words.forEach((word) => {
          const wordElement = document.createElement("div");
          wordElement.classList.add("bingo-word");
          wordElement.textContent = word;
          wordElement.addEventListener("click", () => {
              wordElement.classList.toggle("highlighted");
              saveHighlightedWords();
              checkForCompletion(); // Check if all elements are highlighted
          });
          bingoCard.appendChild(wordElement);
      });

      // Highlight previously saved words
      loadHighlightedWords();
  }

  function saveHighlightedWords() {
      const highlightedWords = Array.from(document.querySelectorAll(".bingo-word.highlighted")).map(
          word => word.textContent
      );
      localStorage.setItem("simonaBingoHighlighted", JSON.stringify(highlightedWords));
  }

  function loadHighlightedWords() {
      const highlightedWords = JSON.parse(localStorage.getItem("simonaBingoHighlighted")) || [];
      document.querySelectorAll(".bingo-word").forEach(wordElement => {
          if (highlightedWords.includes(wordElement.textContent)) {
              wordElement.classList.add("highlighted");
          }
      });
  }

  function checkForCompletion() {
      const bingoWords = Array.from(document.querySelectorAll(".bingo-word"));
      
      // Check if all bingo words are highlighted
      if (bingoWords.every(word => word.classList.contains('highlighted'))) {
          notifyPlayer(); // Notify player when all are completed
      }
  }

  function notifyPlayer() {
      notification.textContent = "Keep it up, you're doing really good!"; // Set notification message
      notification.style.opacity = "1"; // Fade in notification
      container.classList.add("shake"); // Trigger shake animation

      setTimeout(() => {
          container.classList.remove("shake"); // Remove shake effect after animation ends
          setTimeout(() => {
              notification.style.opacity = "0"; // Fade out notification after a delay
          }, 2000); // Show message for 2 seconds before fading out
      }, 500); // Wait for shake animation to finish before fading out
  }
});
