"use strict"

let fileEditor = document.querySelector("#file-editor");
let lineNumbersBlock = document.querySelector("#line-numbers");
let rowsCount, colsCount;
let minRowsCount = 10;
let minColsCount = 60;

setLines.call(fileEditor);
setLineLength.call(fileEditor);

fileEditor.addEventListener('cut', setLines);
fileEditor.addEventListener('paste', setLines);
fileEditor.addEventListener('dragend', setLines);
fileEditor.addEventListener('keyup', setLines);

fileEditor.addEventListener('keydown', tabIndent); //not realized yet

fileEditor.addEventListener('cut', setLineLength);
fileEditor.addEventListener('paste', setLineLength);
fileEditor.addEventListener('keydown', setLineLength);
fileEditor.addEventListener('keyup', setLineLength);

function setLines(event){

	let editorObj = this;

	if (event && event.type == "keyup"){
		if (!(event.keyCode === 13 || event.keyCode === 46 || event.keyCode === 8)){
			return false;
		}
	}

	setTimeout(function() {
		rowsCount = editorObj.value.split(/\r\n|\r|\n/).length;
		editorObj.rows = rowsCount;

		lineNumbersBlock.innerHTML = "";
		for (let i = 1; i <= rowsCount; i++) {
			lineNumbersBlock.innerHTML += "<div>" + i + "</div>";
		}
	}, 0);
}

function tabIndent(event){

	let editorObj = this;

	if(event.keyCode === 9){
		event.preventDefault();
	}
}

function setLineLength(event){

	let editorObj = this;

	if (event && event.type == "keyup"){
		if (!(event.keyCode === 13 || event.keyCode === 46 || event.keyCode === 8)){
			return false;
		}
	}

	setTimeout(function() {
		colsCount = editorObj.value.split(/\r\n|\r|\n/).sort(function (a, b) { return b.length - a.length; }).shift().length;	
		editorObj.cols = (colsCount > minColsCount) ? colsCount + 5 : minColsCount;
	}, 0);

}