"use strict"

const LETTER_WIDTH = 14.1;

let editorBlock = document.querySelector("#editor-block");
let fileEditorWrapper = document.querySelector("#file-editor-wrapper");
let fileEditor = document.querySelector("#file-editor");
let lineNumbersBlock = document.querySelector("#line-numbers");
let caretPos = document.querySelector("#cur-pos");

/*
const SCROLL_WIDTH = 18;
const EDITOR_MIN_WIDTH = getStyleProp("#editor-wrapper", "min-width");

let screenWidth = document.documentElement.clientWidth * 0.9 > EDITOR_MIN_WIDTH ? document.documentElement.clientWidth * 0.9 : EDITOR_MIN_WIDTH;
let editorBlockWidth = screenWidth - document.querySelector("#structure-block").offsetWidth;

fileEditorWrapper.style.width = editorBlockWidth + "px";
fileEditor.cols = Math.ceil((editorBlockWidth - SCROLL_WIDTH - getStyleProp(fileEditor, "padding-left")  - getStyleProp(fileEditor, "padding-right")) / LETTER_WIDTH);
*/

fileEditorWrapper.style.width = "900px";
fileEditor.cols = 900 / LETTER_WIDTH;

let caretLine, caretCol;
let rowsCount, colsCount;
let minRowsCount = document.querySelector("#file-editor").rows;
let minColsCount = document.querySelector("#file-editor").cols;

setLines.call(fileEditor);
setLineLength.call(fileEditor);

fileEditor.addEventListener('cut', setLines);
fileEditor.addEventListener('paste', setLines);
fileEditor.addEventListener('dragend', setLines);
fileEditor.addEventListener('keyup', setLines);

fileEditor.addEventListener('keydown', tabIndent);

fileEditor.addEventListener('cut', setLineLength);
fileEditor.addEventListener('paste', setLineLength);
fileEditor.addEventListener('keydown', setLineLength);
fileEditor.addEventListener('keyup', setLineLength);

fileEditor.addEventListener('keyup', checkCurPos);
fileEditor.addEventListener('click', checkCurPos);

function getStyleProp(elem, propName){
	if (typeof elem == "string")
		return parseInt(window.getComputedStyle(document.querySelector(elem), null).getPropertyValue(propName));
	 else 
	 	return parseInt(window.getComputedStyle(elem, null).getPropertyValue(propName));
}

function setLines(event){

	let editorObj = this;

	if (event && event.type == "keyup"){
		if (!(event.keyCode === 13 || event.keyCode === 46 || event.keyCode === 8)){
			return false;
		}
	}

	setTimeout(function() {
		rowsCount = editorObj.value.split(/\r\n|\r|\n/).length;
		editorObj.rows = (rowsCount > minRowsCount) ? rowsCount : minRowsCount;

		lineNumbersBlock.innerHTML = "";
		for (let i = 1; i <= editorObj.rows; i++) {
			lineNumbersBlock.innerHTML += "<div>" + i + "</div>";
		}
	}, 0);
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
		editorObj.cols = (colsCount > minColsCount) ? colsCount + 3 : minColsCount;
	}, 0);

}

function tabIndent(event){

	let editorObj = this;

	if(event.keyCode === 9){
		event.preventDefault();
		let curPosition = editorObj.selectionStart;
		let beforeCaret = editorObj.value.substr(0, editorObj.selectionStart);
		let afterCaret = editorObj.value.substr(editorObj.selectionStart, editorObj.value.length);
		editorObj.value = beforeCaret + "    " + afterCaret;
		editorObj.selectionStart = editorObj.selectionEnd = curPosition + 4;
	}
}

function checkCurPos(event){

	let editorObj = this;

	caretLine = editorObj.value.substr(0, editorObj.selectionStart).split(/\r\n|\r|\n/).length;
	caretCol = editorObj.value.substr(0, editorObj.selectionStart).split(/\r\n|\r|\n/).pop().length + 1;
	caretPos.innerHTML = caretLine + ", " + caretCol;
}