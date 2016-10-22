"use strict"

const LETTER_WIDTH = 13.45;
const LINE_HEIGHT = 23;

let structBlock = document.querySelector("#structure-block");
let editorBlock = document.querySelector("#editor-block");
let fileEditorWrapper = document.querySelector("#file-editor-wrapper");
let fileEditor = document.querySelector("#file-editor");
let lineNumbersBlock = document.querySelector("#line-numbers");
let caretPos = document.querySelector("#cur-pos");
let slider = document.querySelector('#border-line');

slider.style.left = "0";

fileEditorWrapper.style.width = fileEditor.style.width = document.documentElement.clientWidth - getStyleProp(structBlock, "width") + "px";
fileEditor.cols = document.documentElement.clientWidth / LETTER_WIDTH;
fileEditor.rows = (document.documentElement.clientHeight - getStyleProp(editorBlock, "padding-top") - getStyleProp(fileEditor, "padding-bottom")) / LINE_HEIGHT;

let caretLine, caretCol;
let rowsCount, colsCount;
let minRowsCount = document.querySelector("#file-editor").rows;
let minColsCount = document.querySelector("#file-editor").cols;

setLines.call(fileEditor);
drawLineNumbers.call(fileEditor);
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

slider.onmousedown = function(e) {
  let positionLeft = getStyleProp(slider, "left");
  let maxWidth = document.documentElement.clientWidth * getStyleProp(structBlock, "max-width") / 100;
  document.onmousemove = function(e) {
    let newLeft = e.pageX;
    newLeft = (newLeft >= maxWidth ) ? maxWidth : newLeft;
    slider.style.left = newLeft + 'px';
    structBlock.style.width = newLeft + 'px';
    setLineLength.call(fileEditor);
  }

  document.onmouseup = function() {
    document.onmousemove = document.onmouseup = null;
  };

  return false; // disable selection start (cursor change)
};

slider.ondragstart = function() {
  return false;
};

function drawLineNumbers(){

	let editorObj = this;

	lineNumbersBlock.innerHTML = "";
	for (let i = 1; i <= editorObj.rows; i++) {
		lineNumbersBlock.innerHTML += "<div>" + i + "</div>";
	}
}

function setLines(event){

	let editorObj = this;

	if (event && event.type == "keyup"){
		if (!(event.keyCode === 13 || event.keyCode === 46 || event.keyCode === 8)){
			return false;
		}
	}

	setTimeout(function() {
		let oldRowsCount = editorObj.rows;
		rowsCount = editorObj.value.split(/\r\n|\r|\n/).length;
		editorObj.rows = (rowsCount > minRowsCount) ? rowsCount : minRowsCount;

		if (oldRowsCount != editorObj.rows) {
			drawLineNumbers.call(fileEditor);
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
		minColsCount = getStyleProp(fileEditorWrapper, "width") / LETTER_WIDTH;
		colsCount = editorObj.value.split(/\r\n|\r|\n/).sort(function (a, b) { return b.length - a.length; }).shift().length;
		if (colsCount > minColsCount){
			editorObj.cols = colsCount + 1;
			fileEditor.style.width = "auto";
			fileEditorWrapper.style.width = document.documentElement.clientWidth - getStyleProp(structBlock, "width") + "px";
		} else {
			editorObj.cols = minColsCount;
			fileEditorWrapper.style.width = fileEditor.style.width = document.documentElement.clientWidth - getStyleProp(structBlock, "width") + "px";
		}
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