import {reinit} from '../modules/reinit.js'


let history = []
let history_counter = 0

//первая запись из запуска
// history[history_counter] = [
//           select_mandala_type.value,
//           title_input.value,
//           title_input.value.length
//           ]


history[history_counter] = {
          selected_mandala  : 4,
          title_of_mandala  : title_input.value,
          length_of_title 	: title_input.value.length,
          dots_mode 				: false,
          visible_colors  	: [true,true,true,true,true,true,true,true,true,true],
          grid_mode 				: false,
          grid_mode_for_dots: false,
          border_mode				: true,
          border_color			: -1,
          number_mode				: false
          }


////////////////////////////////////
function add_history(){
console.log(+select_mandala_type.value)
history[++history_counter] = {
          selected_mandala  : +select_mandala_type.value,
          title_of_mandala  : title_input.value,
          length_of_title 	: (+number_of_symbols.value || title_input.value.length),
          dots_mode 				: false,
          visible_colors  	: [true,true,true,true,true,true,true,true,true,true],
          grid_mode 				: false,
          grid_mode_for_dots: false,
          border_mode				: true,
          border_color			: -1,
          number_mode				: false
          }
  //обрезание массива при добавлении элементов не в конце списка
  history.length = history_counter+1
}

function copy_history() {
  history[history_counter] = {...history[history_counter-1]}
  console.log(history[history_counter])
}

function so_crit_value_add(_new_){
    
    let crit_value = (history_counter+_new_ < 0 || history_counter+_new_ >= history.length)
    if (crit_value) _new_ = 0
    history_counter += _new_

  return crit_value
 }


////////////////////////////////////////////////////////////////////////

let undo_button = document.querySelector("#undo_button")
let redo_button = document.querySelector("#redo_button")

//события по перемотке истории мандал
undo_button.onclick = function () { reinit(-1) }
redo_button.onclick = function () { reinit(1) }

undo_button.firstChild.innerHTML = '77'

//функция проверки и окрашивания стрелок в крайних значениях
function undo_redo_check() {

	//сброс цвета
	undo_button.classList.remove('opacity_button')
	redo_button.classList.remove('redo_to_copy')
  redo_button.classList.remove('opacity_button')
	
	//отображение значения количества повторов и отмен
	undo_button.firstChild.innerHTML = (history_counter == 0) ? '' : history_counter
	redo_button.firstChild.innerHTML = (history_counter+1 == history.length) ? '' : Math.abs(history_counter+1-history.length)
	
	//окрашивание кнопки назад в нулевой позиции массива
	if (history_counter == 0) {
	  undo_button.classList.add('opacity_button')
	}
	//окрашивание кнопки вперёд в крайней позиции массива
	if (history_counter+1 >= history.length) {
		// redo_button.classList.add('redo_to_copy')
    redo_button.classList.add('opacity_button')
	}

}



export {undo_button, redo_button, undo_redo_check,
				history, history_counter, add_history, copy_history, so_crit_value_add}