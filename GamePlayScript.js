var difficulty = 9;
var minesTotal = 10;
var cells = []; // amount of cells.
var adjacencyArr = [];
var adjacencyQueue = [];
var tilesReveald = 0;
var time;
var count = 0;

window.onload = CreateGame;

function CreateGame() {
	CreateTable();
	var table = $("<table>").attr({ "align": "center" });
	for (let i = 0; i < difficulty; i++) {
		var tr = $("<tr>");
		for (let j = 0; j < difficulty; j++) {
			var td = $("<td>").attr({
				"id": difficulty * i + j,
			});
			td.mousedown(td.event, CheckMove);
			tr.append(td);
		}
		table.append(tr);
	}
	$("body").append(table);
	$("#numOfFlags").html(minesTotal);
	InitializeCells();
}

function InitializeCells() {
	// -1 means cell is emptys
	for (let i = 0; i < Math.pow(difficulty, 2); i++) {
		cells[i] = -1;
	}
	SetMinesPosition();
}

function SetMinesPosition() {
	// 1 means cell is taken
	for (let i = 0; i < minesTotal; i++) {
		var index = Math.floor((Math.random() * cells.length));
		while (cells[index] == 1) {
			index = Math.floor((Math.random() * cells.length));
		}
		$("#" + index).data("num", "mine");
		//$("#" + index).addClass("mine"); // temp for debbug 
		cells[index] = 1; // make sure a cell is chosen only once
	}
	SetNumbersPosition();
}

function SetNumbersPosition() {
	// set all cells that aren't mines to possible numbers
	for (var i = 0; i < Math.pow(difficulty, 2); i++) {
		var curCell = $("#" + i);
		if (curCell != null && (curCell.data("num") != "mine")) {
			curCell.data("num", "0");
		}
	}
	SetMinesDistance();
}

function SetMinesDistance() {
	var mineCell = $('*').filter(function () {
		return $(this).data("num") == "mine";
	});

	for (let i = 0; i < mineCell.length; i++) {
		var mineId = mineCell[i].id;
		var adjacentCell;
		var adjacentCellData;

		switch (mineId % difficulty) {
			case 0:
				SetAdjacencyArr(mineId, "left");
				break;

			case (difficulty - 1):
				SetAdjacencyArr(mineId, "right");
				break;

			default:
				SetAdjacencyArr(mineId, "default");
		}

		for (let j = 0; j < adjacencyArr.length; j++) {
			if (adjacencyArr[j] >= 0 && adjacencyArr[j] < cells.length) {
				adjacentCell = $("#" + adjacencyArr[j]);
				if (adjacentCell.data("num") != "mine") { 
					adjacentCellData = parseInt(adjacentCell.data("num"));
					adjacentCellData++;
					adjacentCell.data("num", adjacentCellData);
				}
			}
		}
	}
	time = setInterval(CountScore, 1000);
}

function CountScore() {
	count = document.getElementById("counter");
	count.innerHTML = parseInt(count.innerHTML) + 1;
}

function CheckMove(event) {
	var clickedCell = $("#" + event.currentTarget.id);

	if (event.button == 0) { // left click
		if (IsMine(clickedCell) == true) {
			GameOver();
		}
		else {
			if (IsRevealed(clickedCell) == false) {
				RevealCells(clickedCell);
			}
		}
		
	}

	else if (event.button == 2) { //right click
		if (IsRevealed(clickedCell) == false) {
			clickedCell.addClass("flag");
			UpdateFlagCounter(-1);
			//tilesReveald++;
			IsVictory();
		}
		else {
			if (clickedCell.hasClass("flag")) {
				clickedCell.removeClass("flag");
				UpdateFlagCounter(1);
				//tilesReveald--;
			}
		}
	}
}

// dir = 1 -> add, dir = -1 -> subtract
function UpdateFlagCounter(dir) { 
	var flagsDiv = $("#numOfFlags");
	var cureFlags = Number(flagsDiv.html());
	cureFlags = cureFlags + Number(dir);
	flagsDiv.html(cureFlags);


	//$("#numOfFlags").html(parseInt($("#numOfFlags").html() + 1));
	////var curFlags = $("#numOfFlags").html(Integer.parseInt($("#numOfFlags").html()));
}

function IsRevealed(clickedCell) {
	var clickedCellClassList = document.getElementById(clickedCell.attr("id")).classList.length;
	return (clickedCellClassList != 0);
}

function RevealCells(clickedCell) {
	var num = [
		"zero", "one", "two",
		"three", "four", "five",
		"six", "seven", "eight"
	];
	var cellData = clickedCell.data("num");
	var numberStr = num[parseInt(cellData)];
	var cellId = clickedCell.attr("id");

	if (IsRevealed(clickedCell) == true) {
		return;
	}

	else if (cellId >= Math.pow(difficulty, 2)) {
		return;
	}

	// stop revealing when reaching a number
	else if (cellData != "0") {
		clickedCell.addClass(numberStr);
		tilesReveald++;
		IsVictory();
		return;
	}

	else if (true) {
		clickedCell.addClass(numberStr);
		tilesReveald++;
		IsVictory();
		adjacencyArr = [];
		switch (cellId % difficulty) {
			case 0:
				SetAdjacencyArr(cellId, "left");
				break;

			case (difficulty - 1):
				SetAdjacencyArr(cellId, "right");
				break;

			default:
				SetAdjacencyArr(cellId, "default");
		}
	}

	for (let i = 0; i < adjacencyArr.length; i++) {
		var nextCellID = parseInt($("#" + adjacencyArr[i]).attr("id"));
		if (nextCellID >= 0 && nextCellID < Math.pow(difficulty, 2)) {
			adjacencyQueue.push($("#" + adjacencyArr[i]));
		}
	}

	while (IsEmpty() == false) {
		RevealCells(Dequeue());
	}
}

function Enqueue(item) { // add to the end of the array
	adjacencyQueue.push(item);
}

function Dequeue() {
	if (IsEmpty() == false) {
		var temp = adjacencyQueue.shift();
		return temp;
	}
}

function IsEmpty() {
	return (adjacencyQueue.length == 0);
}

function SetAdjacencyArr(mineId, position) {
	switch(position) {
		case "left":
			adjacencyArr = [
				parseInt(mineId) + 1, // >
				mineId - difficulty, // ^
				parseInt(mineId) + difficulty, // v
				mineId - (difficulty - 1), // ^>
				parseInt(mineId) + (difficulty + 1) // v>
			];
			break;

		case "right":
			adjacencyArr = [
				mineId - 1, // <
				mineId - difficulty, // ^
				parseInt(mineId) + difficulty, // v
				mineId - (difficulty + 1), // <^
				parseInt(mineId) + (difficulty - 1), // <v
			];
			break;

		default:
			adjacencyArr = [
				mineId - 1, // <
				parseInt(mineId) + 1, // >
				mineId - difficulty, // ^
				parseInt(mineId) + difficulty, // v
				mineId - (difficulty + 1), // <^
				mineId - (difficulty - 1), // ^>
				parseInt(mineId) + (difficulty - 1), // <v
				parseInt(mineId) + (difficulty + 1) // v>
			];

	}
}

function IsMine(cell) {
	return (cell.data("num") == "mine");
}

function GameOver() {
	var cell;
	clearInterval(time);
	for (let i = 0; i < Math.pow(difficulty, 2); i++) {
		cell = $("#" + i);
		if (IsMine(cell) == false && cell.hasClass("flag")) {
			cell.removeClass("flag");
			cell.addClass("wrong");
		}

		switch (cell.data("num")) {
			case 1:
				cell.addClass("one");
				break;
			case 2:
				cell.addClass("two");
				break;
			case 3:
				cell.addClass("three");
				break;
			case 4:
				cell.addClass("four");
				break;
			case 5:
				cell.addClass("five");
				break;
			case 6:
				cell.addClass("six");
				break;
			case 7:
				cell.addClass("seven");
				break;
			case 8:
				cell.addClass("eight");
				break;
			case "mine":
				cell.addClass("mine");
				break;

			default:
				cell.addClass("zero");
		}
	}
	document.getElementById("TryAgain").disabled = false;
	$("#numOfFlagsDIV").html("Better luck next time!");
	$("#numOfFlagsDIV").css("backgroundColor", "#396A85");
}

function Restart() {
	location.reload();
}

function IsVictory() {
	if (tilesReveald == Math.pow(difficulty, 2)) {
		Victory();
	}
	else if ((Math.pow(difficulty, 2) - tilesReveald) == minesTotal) {
		Victory();
	}
}

function Victory() {
	var temp = $("td");
	var score;
	if (count == 0) {
		score = 0;
	}
	else {
		score = parseInt(count.innerHTML);
	}
	clearInterval(time);
	if (temp != null) {
		for (let i = 0; i < temp.length; i++) {
			$("#" + temp[i].id).unbind();
		}
	}
	if (IsNewHighScore(score)) {
		AddHighScore(score);
	}
	$("#numOfFlagsDIV").html("You Won!");
	$("#numOfFlagsDIV").css("backgroundColor", "#FE5F55");
	document.getElementById("TryAgain").disabled = false;
}

function Lougout() {
	location.href = "HomePage.html";
}

window.addEventListener('contextmenu', function (e) {
	// do something here... 
	e.preventDefault();
}, false);

