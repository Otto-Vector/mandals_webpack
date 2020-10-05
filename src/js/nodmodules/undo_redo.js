import {reinit} from '../modules/reinit.js'
import {history, history_counter} from '../modules/history.js'


////////////////////////////////////////////////////////////////////////

let undo_button = document.querySelector("#undo_button")
let redo_button = document.querySelector("#redo_button")

//события по перемотке истории мандал
undo_button.onclick = function () { reinit(-1) }
redo_button.onclick = function () { reinit(1) }

undo_button.firstChild.innerHTML = '77'

//функция проверки и окрашивания стрелок в крайних значениях
function undo_redo_check() {

	//сброс
	redo_button.classList.remove('redo_to_copy')
	
	//отображение значения количества повторов и отмен (в span элемент, идущий первым)
	undo_button.firstChild.innerHTML = (history_counter == 0) ? '' : history_counter
	redo_button.firstChild.innerHTML = (history_counter+1 == history.length) ? '' : Math.abs(history_counter+1-history.length)
	
	//окрашивание кнопки назад в нулевой позиции массива
  undo_button.classList.toggle('opacity_button', history_counter == 0)

	//окрашивание кнопки вперёд в крайней позиции массива
  redo_button.classList.toggle('opacity_button', history_counter+1 >= history.length)

}


export {undo_button, redo_button, undo_redo_check}