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
const classification = document.querySelector(".classification");
const tableAns = document.querySelector(".table-ans");
const tableBodyAns = document.querySelector(".tbody-ans");

const Loading = document.querySelector("#Loading");
const MainGame = document.querySelector("#mainGame");
MainGame.style.display = "none";

let draggableElements;
let droppableElements;

//Get data
var idData = 1;
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
function GetRandomQuestion() {
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
        firstPart: BigData2[index]["words"][i]["content"],
        secondPart: '',
        id: BigData2[index]["words"][i]["type_true"],
      });
    }
    dataQuiz = coventData;
    totalDraggableItems = dataQuiz.length;
    totalMatchingPairs = dataQuiz.length;
    nameCol = [];
    for (var i = 0; i < BigData2[index]["type_name"].length; i++) {
      nameCol.push({ "content": BigData2[index]["type_name"][i], "id": i });
    }
  }
}
function StartGame() {
  GetRandomQuestion();
  initiateGame();
}
//Update
function super_update() {
  setTimeout(() => {
    if (BigData1 != null && BigData2 != null && firstQuery == false) {
      firstQuery = true;
      Loading.style.display = "none";
      MainGame.style.display = "block";
      StartGame(); // 1 or 2
    } else super_update();
  }, 100);
}
super_update();

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initiateGame() {
  // Random 2 number in range (0, tổng số nhóm)
  const randomCol1 = getRndInteger(0, nameCol.length - 2);
  const randomCol2 = getRndInteger(randomCol1 + 1, nameCol.length - 1);

  let randomDraggable = [];
  if (idData == 1)
    randomDraggable = generateRandomItemsArray(totalDraggableItems, dataQuiz);
  else {
    for (let i = 0; i < dataQuiz.length; i++) {
      if (dataQuiz[i].id == randomCol1 || dataQuiz[i].id == randomCol2)
        randomDraggable.push(dataQuiz[i]);
    }
    randomDraggable.sort(() => Math.random() - 0.5);
  }

  const randomDroppable = totalMatchingPairs < totalDraggableItems ? generateRandomItemsArray(totalMatchingPairs, randomDraggable) : randomDraggable;
  const alphabeticallySortedRandomDroppable = [...randomDroppable].sort((a, b) => a.secondPart.toLowerCase().localeCompare(b.secondPart.toLowerCase()));
  
  // Create "draggable-items" and append to DOM
  for (let i = 0; i < randomDraggable.length; i++) {
    draggableItems.insertAdjacentHTML("beforeend", `
    <span class="label draggable" draggable="true" data-quiz="${randomDraggable[i].id}" id="${randomDraggable[i].firstPart}">${randomDraggable[i].firstPart}</span>
    `);
  }
  tableAns.style.display = "none";
  classification.style.display = "none";

  if(idData == 1){
    // Create "matching-pairs" and append to DOM
    for (let i = 0; i < alphabeticallySortedRandomDroppable.length; i++) {
      matchingPairs.insertAdjacentHTML("beforeend", `
        <div class="matching-pair">
          <span class="label">${alphabeticallySortedRandomDroppable[i].secondPart}</span>
          <span class="droppable" data-quiz="${alphabeticallySortedRandomDroppable[i].id}"></span>
        </div>
      `);
    }
  }

  if(idData == 2){
    classification.style.display = "flex";
    classification.innerHTML = "";
    tableBodyAns.innerHTML = "";
    // Create classification column
    classification.insertAdjacentHTML("beforeend", `
    <div class="col-6">
        <img src="assets/img/box1.png" style="width: 50%;" class="img-fluid droppable" alt="" data-quiz="${nameCol[randomCol1].id}">
        <h6>${nameCol[randomCol1].content}</h6>
    </div>
    <div class="col-6">
        <img src="assets/img/box2.png" style="width: 50%;" class="img-fluid droppable" alt="" data-quiz="${nameCol[randomCol2].id}">
        <h6>${nameCol[randomCol2].content}</h6>
    </div>
    `);

    // Load ans to table ans
    let arrAnsCol1 = [];
    let arrAnsCol2 = [];
    for (let i = 0; i < randomDraggable.length; i++) {
      if (randomDraggable[i].id == randomCol1)
        arrAnsCol1.push(randomDraggable[i].firstPart);
      else
        arrAnsCol2.push(randomDraggable[i].firstPart);
    }

    for (let i = 0; i < Math.max(arrAnsCol1.length, arrAnsCol2.length); i++) {
      if (i < Math.min(arrAnsCol1.length, arrAnsCol2.length)) {
        tableBodyAns.insertAdjacentHTML("beforeend", `
        <tr>
          <td style="width: 50vw;">${arrAnsCol1[i]}</td>
          <td style="width: 50vw;">${arrAnsCol2[i]}</td>
        </tr>
      `);
      }
      else if (arrAnsCol1.length > arrAnsCol2.length) {
        tableBodyAns.insertAdjacentHTML("beforeend", `
        <tr>
          <td style="width: 50vw;">${arrAnsCol1[i]}</td>
          <td style="width: 50vw;"></td>
        </tr>
      `);
      }
      else {
        tableBodyAns.insertAdjacentHTML("beforeend", `
        <tr>
          <td style="width: 50vw;"></td>
          <td style="width: 50vw;">${arrAnsCol2[i]}</td>
        </tr>
      `);
      }
    }

    // Load name col
    document.getElementById('name-col-1').innerText = nameCol[randomCol1].content;
    document.getElementById('name-col-2').innerText = nameCol[randomCol2].content;
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
  if (event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
    event.target.classList.add("droppable-hover");
  }
}

function dragOver(event) {
  if (event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
    event.preventDefault();
  }
}

function dragLeave(event) {
  if (event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
    event.target.classList.remove("droppable-hover");
  }
}

function drop(event) {
  event.preventDefault();
  event.target.classList.remove("droppable-hover");

  const draggableElementQuiz = event.dataTransfer.getData("text");
  const draggableElementQuizId = event.dataTransfer.getData("idTrue");
  const droppableElementQuiz = event.target.getAttribute("data-quiz");
  const isCorrectMatching = (draggableElementQuizId === droppableElementQuiz);
  total++;

  if (isCorrectMatching) {
    const draggableElement = document.getElementById(draggableElementQuiz);
    if(idData == 1) event.target.classList.add("dropped");
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
  if (correct === Math.min(totalMatchingPairs, totalDraggableItems)) { // Game Over!!
    newGameBtn.style.display = "block";
    if(idData == 2) tableAns.style.display = "block";
    setTimeout(() => {
      newGameBtn.classList.add("new-game-btn-entrance");
    }, 200);
  }
}

// Other Event Listeners
newGameBtn.addEventListener("click", newGameBtnClick);
function newGameBtnClick() {
  idData = idData%2 + 1;
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
  if (n > clonedArray.length) n = clonedArray.length;
  for (let i = 1; i <= n; i++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);
    res.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }
  return res;
}