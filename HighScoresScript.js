var MaxLength = 10;
var MaxInfo = 2;
var Info = ["name", "score"];
var place;
var ScoresArr = [];

function CreateTable() {
	var scoreTable = $("<table>").attr({
		"align": "center"
		, "id": "ScoreTable"
	});
	for (let i = 0; i < MaxLength + 1; i++) {
		var tr = $("<tr>");
		tr.addClass("hsTDTR");
		for (let j = 0; j < MaxInfo; j++) {
			var td = $("<td>").attr({
				"id": Info[j] + i
			});
			td.addClass("hsTDTR");
			tr.append(td);
		}
		scoreTable.append(tr);
	}
	$("#ScoreDiv").append(scoreTable);
	document.getElementById("name0").innerHTML = "Name";
	document.getElementById("score0").innerHTML = "Score";

	RetrieveData();
}

function RetrieveData() {
	ScoresArr = JSON.parse(localStorage.getItem("DataBase"));
	if (ScoresArr == null) {
		ScoresArr = [];
		return;
	}
	var place = $(".hsTDTR td");
	var j = 0;
	for (let i = 0; j < ScoresArr.length; i+=2) {
		place[i + 2].innerHTML = ScoresArr[j].name;
		place[i + 3].innerHTML = ScoresArr[j].score;
		j++;
	}
}

function IsNewHighScore(score) {
	var worstScore = document.getElementById("score" + MaxLength).innerHTML;
	if (worstScore != "") {
		return (score < parseInt(worstScore));
	}
	return true;
}

function AddHighScore(score) {
	var name = sessionStorage.getItem("playerName");
	var Data = { "name": name, "score": score };

	if (ScoresArr.length == 0) {
		ScoresArr.push(Data);
		localStorage.setItem("DataBase", JSON.stringify(ScoresArr));
		RetrieveData();
		return;
	}

	if (ScoresArr.length == MaxLength) {
		ScoresArr.pop();
	}

	ScoresArr.push(Data);
	ScoresArr.sort(function (a, b) {
		if (a.score > b.score) {
			return 1;
		}
		if (a.score < b.score) {
			return -1;
		}
	});

	localStorage.setItem("DataBase", JSON.stringify(ScoresArr));
	RetrieveData();
}
