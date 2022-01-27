const dataQuiz = [
  {
    firstPart: "adobe",
    secondPart: "Adobe",
    color: "#ff0000"
  },
  {
    firstPart: "airbnb",
    secondPart: "Airbnb",
    color: "#fd5c63"
  },
  {
    firstPart: "amazon",
    secondPart: "Amazon",
    color: "#333333"
  },
  {
    firstPart: "android",
    secondPart: "Android",
    color: "#a4c639"
  },
  {
    firstPart: "angellist",
    secondPart: "AngelList",
    color: "#000000"
  },
  {
    firstPart: "angular",
    secondPart: "Angular",
    color: "#b52e31"
  },
  {
    firstPart: "app-store-ios",
    secondPart: "App Store",
    color: "#5fc9f8"
  },
  {
    firstPart: "apple",
    secondPart: "Apple",
    color: "#aaaaaa"
  },
  {
    firstPart: "bitcoin",
    secondPart: "Bitcoin",
    color: "#d4af37"
  },
  {
    firstPart: "blackberry",
    secondPart: "BlackBerry",
    color: "#000000" 
  }
];
let correct = 0;
let total = 0;
const totalDraggableItems = 5;
const totalMatchingPairs = 5; // Should be <= totalDraggableItems

const scoreSection = document.querySelector(".score");
const correctSpan = scoreSection.querySelector(".correct");
const totalSpan = scoreSection.querySelector(".total");
const newGameBtn = scoreSection.querySelector("#new-game-btn");

const draggableItems = document.querySelector(".draggable-items");
const matchingPairs = document.querySelector(".matching-pairs");
let draggableElements;
let droppableElements;

initiateGame();

function initiateGame() {
  const randomDraggable = generateRandomItemsArray(totalDraggableItems, dataQuiz);
  const randomDroppable = totalMatchingPairs<totalDraggableItems ? generateRandomItemsArray(totalMatchingPairs, randomDraggable) : randomDraggable;
  const alphabeticallySortedRandomDroppable = [...randomDroppable].sort((a,b) => a.secondPart.toLowerCase().localeCompare(b.secondPart.toLowerCase()));
  
  // Create "draggable-items" and append to DOM
  for(let i=0; i<randomDraggable.length; i++) {
    draggableItems.insertAdjacentHTML("beforeend", `
    <span class="label draggable" draggable="true" id="${randomDraggable[i].firstPart}">${randomDraggable[i].firstPart}</span>
    `);
  }
  
  // Create "matching-pairs" and append to DOM
  for(let i=0; i<alphabeticallySortedRandomDroppable.length; i++) {
    matchingPairs.insertAdjacentHTML("beforeend", `
      <div class="matching-pair">
        <span class="label">${alphabeticallySortedRandomDroppable[i].secondPart}</span>
        <span class="droppable" data-quiz="${alphabeticallySortedRandomDroppable[i].firstPart}"></span>
      </div>
    `);
  }
  
  draggableElements = document.querySelectorAll(".draggable");
  droppableElements = document.querySelectorAll(".droppable");
  
  draggableElements.forEach(elem => {
    elem.addEventListener("dragstart", dragStart);
    // elem.addEventListener("drag", drag);
    // elem.addEventListener("dragend", dragEnd);
  });
  
  droppableElements.forEach(elem => {
    elem.addEventListener("dragenter", dragEnter);
    elem.addEventListener("dragover", dragOver);
    elem.addEventListener("dragleave", dragLeave);
    elem.addEventListener("drop", drop);
  });
}

// Drag and Drop Functions

//Events fired on the drag target

function dragStart(event) {
  event.dataTransfer.setData("text", event.target.id); // or "text/plain"
}

//Events fired on the drop target

function dragEnter(event) {
  if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
    event.target.classList.add("droppable-hover");
  }
}

function dragOver(event) {
  if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
    event.preventDefault();
  }
}

function dragLeave(event) {
  if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
    event.target.classList.remove("droppable-hover");
  }
}

function drop(event) {
  event.preventDefault();
  event.target.classList.remove("droppable-hover");
  const draggableElementQuiz = event.dataTransfer.getData("text");
  const droppableElementQuiz = event.target.getAttribute("data-quiz");
  
  // Pls create isCorrectMatching function with your structure database
  const isCorrectMatching = true;
  total++;
  if(isCorrectMatching) {
    const draggableElement = document.getElementById(draggableElementQuiz);
    event.target.classList.add("dropped");
    draggableElement.classList.add("dragged");
    draggableElement.setAttribute("draggable", "false");
    event.target.innerHTML = `<h6 style="color: ${draggableElement.style.color};">${draggableElementQuiz}</h6>`;
    correct++;  
  }
  scoreSection.style.opacity = 0;
  setTimeout(() => {
    correctSpan.textContent = correct;
    totalSpan.textContent = total;
    scoreSection.style.opacity = 1;
  }, 200);
  if(correct===Math.min(totalMatchingPairs, totalDraggableItems)) { // Game Over!!
    newGameBtn.style.display = "block";
    setTimeout(() => {
      newGameBtn.classList.add("new-game-btn-entrance");
    }, 200);
  }
}

// Other Event Listeners
newGameBtn.addEventListener("click", newGameBtnClick);
function newGameBtnClick() {
  newGameBtn.classList.remove("new-game-btn-entrance");
  correct = 0;
  total = 0;
  draggableItems.style.opacity = 0;
  matchingPairs.style.opacity = 0;
  setTimeout(() => {
    scoreSection.style.opacity = 0;
  }, 100);
  setTimeout(() => {
    newGameBtn.style.display = "none";
    while (draggableItems.firstChild) draggableItems.removeChild(draggableItems.firstChild);
    while (matchingPairs.firstChild) matchingPairs.removeChild(matchingPairs.firstChild);
    initiateGame();
    correctSpan.textContent = correct;
    totalSpan.textContent = total;
    draggableItems.style.opacity = 1;
    matchingPairs.style.opacity = 1;
    scoreSection.style.opacity = 1;
  }, 500);
}

// Auxiliary functions
function generateRandomItemsArray(n, originalArray) {
  let res = [];
  let clonedArray = [...originalArray];
  if(n>clonedArray.length) n=clonedArray.length;
  for(let i=1; i<=n; i++) {
    const randomIndex = Math.floor(Math.random()*clonedArray.length);
    res.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }
  return res;
}