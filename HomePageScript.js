function ValidateInput() {
	var inp = $("#name").val();
	var patt = /^([a-zA-Z])(\d|[a-zA-Z]){3,}/g
	var valid = patt.test(inp);
	var dataArr = JSON.parse(localStorage.getItem("DataBase"));

	if (valid == false) {
		ErrNotValid();
	}
	else {
		if (dataArr != null) {
			for(let i = 0; i < dataArr.length; i++) {
				if (inp == dataArr[i].name) {
					ErrNameTaken();
					return;
				}
			}
		}
		StartGame();
	}
}

function ErrNotValid() {
	$("#ErrMsg").html("Name must begin with a letter and contain minimum 4 characters.");

}

function ErrNameTaken() {
	$("#ErrMsg").html("Name Is Taken");
}

function ClearErr(){
	$("#ErrMsg").html("");
	$("#name").val("");
}

function StartGame() {
	sessionStorage.setItem("playerName", $("#name").val());
	location.href = "GamePlay.html";
}


	