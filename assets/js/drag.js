//First setup
var db = firebase.firestore();
//U5Dbgs1dUW6iiyxb2y44
var main_questions = db.collection("main-questions").doc("U5Dbgs1dUW6iiyxb2y44");

//Colm name here bro!!!!!!!!!!!!!!!!!!!!!!
var nameCol = [];

let correct = 0;
let total = 0;
var totalDraggableItems = 5;
var totalMatchingPairs = 5; // Should be <= totalDraggableItems

const scoreSection = document.querySelector(".score");
const correctSpan = scoreSection.querySelector(".correct");
const totalSpan = scoreSection.querySelector(".total");
const newGameBtn = scoreSection.querySelector("#new-game-btn");

const draggableItems = document.querySelector(".draggable-items");
const matchingPairs = document.querySelector(".matching-pairs");
let draggableElements;
let droppableElements;

//Get data
var BigData1 = null;
var BigData2 = null;
var firstQuery = false;
main_questions.get().then((querySnapshot) => {
  BigData1 = querySnapshot.data()["questions02"];
  BigData2 = querySnapshot.data()["questions04"];
}).catch((error) => {
  console.log("Error getting documents: ", error);
});
//Start game
//firstPart secondPart
var dataQuiz = [];
function GetRandomQuestion(){
  if (idData == 1) {
    var index = getRndInteger(0, BigData1.length - 1);
    var coventData = [];
    for (var i = 0; i < BigData1[index]["words"].length; i++) {
      coventData.push({
        firstPart: BigData1[index]["words"][i]["word1"],
        secondPart: BigData1[index]["words"][i]["word2"],
        id: i,
      });
    }
    dataQuiz = coventData;
    totalDraggableItems = dataQuiz.length;
    totalMatchingPairs = dataQuiz.length;
    nameCol = [];
  } else {
    var index = getRndInteger(0, BigData2.length - 1);
    var coventData = [];
    for (var i = 0; i < BigData2[index]["words"].length; i++) {
      coventData.push({
        firstPart: '',
        secondPart: BigData1[index]["words"][i]["content"],
        id: BigData1[index]["words"][i]["type_true"],
      });
    }
    dataQuiz = coventData;
    totalDraggableItems = dataQuiz.length;
    totalMatchingPairs = dataQuiz.length;
    nameCol = [];
    for(var i = 0; i < BigData2[index]["type_name"].length; i++){
      nameCol.push({"content": BigData2[index]["type_name"][i], "id" : i});
    }
  }
}
function StartGame(){
  GetRandomQuestion();
  initiateGame();
}
//Update
function super_update() {
  setTimeout(() => {
      if (BigData != null && firstQuery == false) {
          firstQuery = true;
          StartGame();
      } else super_update();
  }, 100);
}
super_update();

function initiateGame() {
  const randomDraggable = generateRandomItemsArray(totalDraggableItems, dataQuiz);
  const randomDroppable = totalMatchingPairs<totalDraggableItems ? generateRandomItemsArray(totalMatchingPairs, randomDraggable) : randomDraggable;
  const alphabeticallySortedRandomDroppable = [...randomDroppable].sort((a,b) => a.secondPart.toLowerCase().localeCompare(b.secondPart.toLowerCase()));
  
  // Create "draggable-items" and append to DOM
  for(let i=0; i<randomDraggable.length; i++) {
    draggableItems.insertAdjacentHTML("beforeend", `
    <span class="label draggable" draggable="true" data-quiz="${randomDraggable[i].id}" id="${randomDraggable[i].firstPart}">${randomDraggable[i].firstPart}</span>
    `);
  }
  
  // Create "matching-pairs" and append to DOM
  for(let i=0; i<alphabeticallySortedRandomDroppable.length; i++) {
    matchingPairs.insertAdjacentHTML("beforeend", `
      <div class="matching-pair">
        <span class="label">${alphabeticallySortedRandomDroppable[i].secondPart}</span>
        <span class="droppable" data-quiz="${alphabeticallySortedRandomDroppable[i].id}"></span>
      </div>
    `);

    // Load name col
    document.getElementById('name-col-1').innerText = nameCol1;
    document.getElementById('name-col-2').innerText = nameCol2;
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
  event.dataTransfer.setData("idTrue", event.target.getAttribute("data-quiz"));
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
  const draggableElementQuizId = event.dataTransfer.getData("idTrue");
  const droppableElementQuiz = event.target.getAttribute("data-quiz");
  
  // Pls create isCorrectMatching function with your structure database
  const isCorrectMatching = (draggableElementQuizId === droppableElementQuiz);
  total++;
  if(isCorrectMatching) {
    const draggableElement = document.getElementById(draggableElementQuiz);
    event.target.classList.add("dropped");
    draggableElement.classList.add("dragged");
    draggableElement.setAttribute("draggable", "false");
    event.target.innerHTML = `<h6>${draggableElementQuiz}</h6>`;
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
  GetRandomQuestion();
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