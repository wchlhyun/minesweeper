function getEdges(matrix)
{
	var nRow = matrix.length;
	var nCol = matrix[0].length;
	
	for(var row=0; row<nRow;row++){
		for(var col=0;col<nCol;col++){
			var numBoarder = 8;
			
			var h_edge = row == 0 || row == nRow - 1;
			var v_edge = col == 0 || col == nCol - 1;
			if (h_edge && v_edge)
			{
				numBoarder = 3;
			}
			else if (h_edge ||v_edge)
			{
				numBoarder = 5;
			}
			
			matrix[row][col] = numBoarder;
		}
	}
	
	printMatrix(matrix);
}



//returns board
function getBoard( nRow, nCol)
{
	var matrix = [];
	for(var i=0; i<nRow; i++)
	{
		matrix[i] = new Array(nCol);
	}
	//flag = -1
	//blank = -99
	
	for(var row=0; row<nRow;row++){
		for(var col=0;col<nCol;col++){
			var id = (row + 1) + "_" + (col + 1);
			var string_val = document.getElementById(id).className;
			
			if (string_val === "square blank"){
				matrix[row][col] = -99;
			}
			else if (string_val === "square open0"){
				matrix[row][col] = 0;
			}
			else if (string_val === "square open1"){
				matrix[row][col] = 1;
			}
			else if (string_val === "square open2"){
				matrix[row][col] = 2;
			}
			else if (string_val === "square open3"){
				matrix[row][col] = 3;
			}
			else if (string_val === "square open4"){
				matrix[row][col] = 4;
			}
			else if (string_val === "square open5"){
				matrix[row][col] = 5;
			}
			else if (string_val === "square open6"){
				matrix[row][col] = 6;
			}
			else if (string_val === "square open7"){
				matrix[row][col] = 7;
			}
			else if (string_val === "square open8"){
				matrix[row][col] = 8;
			}
			else if (string_val === "square bombflagged"){
				matrix[row][col] = -1;
			}
		}
	}
	return matrix;
}

function printMatrix(matrix)
{
	var nRow = matrix.length;
	var nCol = matrix[0].length;
	
	for(var row=0; row<nRow;row++){
		var toPrint = "";
		for(var col=0;col<nCol;col++){
			var numString = matrix[row][col].toString();
			while (numString.length < 4){
				numString = " " + numString;
			}
			
			toPrint = toPrint + numString;
		}
		console.log(toPrint);
	}
}

//el = "#?_?"
function getPosition(el)
{
	var x = $(el).position();
	return [x.top, x.left];
}

//x, y in 0 array
function clickOnSquare(x, y)
{
	var id = "#" + (x + 1) + "_" + (y + 1);
	var id2 = (x + 1) + "_" + (y + 1);

	var d = jQuery.Event("mousedown", {button: 0, clientX : getPosition(id)[1], clientY : getPosition(id)[0], target : document.getElementById(id2), ctrlKey : false});
	var u = jQuery.Event("mouseup", {button: 0, clientX : getPosition(id)[1], clientY : getPosition(id)[0], target : document.getElementById(id2), ctrlKey : false});

	$(document).trigger(d);

	$(document).trigger(u);
}

//x, y in 0 array
function flag(x, y)
{
	var id = "#" + (x + 1) + "_" + (y + 1);
	var id2 = (x + 1) + "_" + (y + 1);

	var d = jQuery.Event("mousedown", {button: 2, clientX : getPosition(id)[1], clientY : getPosition(id)[0], target : document.getElementById(id2), ctrlKey : false});
	var u = jQuery.Event("mouseup", {button: 2, clientX : getPosition(id)[1], clientY : getPosition(id)[0], target : document.getElementById(id2), ctrlKey : false});

	$(document).trigger(d);

	$(document).trigger(u);
}


function click_update(matrix)
{
	var nRow = matrix.length;
	var nCol = matrix[0].length;
	
	var numChanges = 0;
	
	for(var row=0; row<nRow;row++){
		for(var col=0;col<nCol;col++){
			if (matrix[row][col] > 0)
			{
				var totalBombs = matrix[row][col]
			
				var blanks = [];
				var bombs = [];
				
				for (var i = -1; i < 2; i++)
				{
					for (var j = -1; j < 2; j++)
					{
						var x = row  + i;
						var y = col + j;
												
						if(x != -1 && x != nRow && y != -1 && y != nCol)
						{
							if(matrix[x][y] == -99)
							{
								blanks.push([x, y]);
							}
							else if(matrix[x][y] == -1)
							{
								bombs.push([x, y]);
							}
						}					
					}
				}
				var nKnownBombs = bombs.length;
				var nUnknownBombs = totalBombs - nKnownBombs;
				var emptySpace = blanks.length;
				
				if(emptySpace == nUnknownBombs)
				{
					for(var a = 0; a < blanks.length; a++)
					{
						matrix[blanks[a][0]][blanks[a][1]] = -1;
						flag(blanks[a][0], blanks[a][1]);
						numChanges = numChanges + 1;
					}
					emptySpace = 0;
				}
				else if (nKnownBombs == totalBombs)
				{
					for(var a = 0; a < blanks.length; a++)
					{
						clickOnSquare(blanks[a][0], blanks[a][1]);
						numChanges = numChanges + 1;
					}
				}
			}
		}
	}
	return numChanges;
}

function solve_loop(r, c)
{
	var n = 1;
	while(n > 0)
	{
		var b = getBoard(r, c);
		n = click_update(b);
	}
	
	return b;
}

function is_game_over()
{
	return !(document.getElementById("face").className === "facesmile")
}

function click_random(matrix)
{
	var numBlank = 0;
	
	var nRow = matrix.length;
	var nCol = matrix[0].length;
		
	for(var row=0; row<nRow;row++){
		for(var col=0;col<nCol;col++){
			if(matrix[row][col] == -99)
			{
				numBlank = numBlank + 1;
			}
		}
	}
	
	var rand = Math.floor((Math.random() * numBlank) + 1);
	
	var count = 0;
	for(var row=0; row<nRow;row++){
		for(var col=0;col<nCol;col++){
			if(matrix[row][col] == -99)
			{
				count = count + 1;
				if(count == rand)
				{
					clickOnSquare(row, col);
					row = nRow + 1;
					col = nCol + 1;
				}
			}
		}	
	}
}


function reset()
{
	var id = "#face";
	var id2 = "face";

	var d = jQuery.Event("mousedown", {button: 0, clientX : getPosition(id)[1], clientY : getPosition(id)[0], target : document.getElementById(id2), ctrlKey : false});
	var u = jQuery.Event("mouseup", {button: 0, clientX : getPosition(id)[1], clientY : getPosition(id)[0], target : document.getElementById(id2), ctrlKey : false});

	$(document).trigger(d);
	$(document).trigger(u);
}


function solve(l, delay)
{
	var numRows = 16;
	var numCols = 30;
	
	if(l === "b")
	{
		numRows = 9;
		numCols = 9;
	}
	else if(l === "i")
	{
		numRows = 16;
		numCols = 16;
	}
	
	clickOnSquare(Math.round(numRows / 2), Math.round(numCols / 2));	

	setTimeout( function(){
		while(!is_game_over())
		{
			var m = solve_loop(numRows, numCols);
			click_random(m);
		}
		
		reset();
		console.log("done");
	}, delay * 1000);
}

function solve_many(num, lvl, delay)
{	
	for(var i = 0; i < num; i++)
	{
		solve(lvl, delay);
	}
}

function getHighScores(n)
{	

	//make new expert game
	document.getElementById("options-link").click();
	document.getElementById("expert").click();
	document.getElementsByClassName("dialogText")[0].click();
	solve_many(n, "e", 1);
	
	//make new intermediate game
	document.getElementById("options-link").click();
	document.getElementById("intermediate").click();
	document.getElementsByClassName("dialogText")[0].click();
	
	solve_many(n, "i", 1);
	
	//new beginner game
	document.getElementById("options-link").click();
	document.getElementById("beginner").click();
	document.getElementsByClassName("dialogText")[0].click();
	
	solve_many(n, "b", 1);
}

