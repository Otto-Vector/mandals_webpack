
let history = []
let history_counter = 0

//первая запись из запуска


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
          number_mode				: false,
          second_color_mode : false,
          gray_mode         : false,
          second_gray_mode  : false,
          camera_range      : 60,
          swich_mode        : function(mode) {this[mode] = !this[mode]; return this[mode]}
          }


////////////////////////////////////
function add_history(){

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
          number_mode				: false,
          second_color_mode : false,
          gray_mode         : false,
          second_gray_mode  : false,
          camera_range      : 60,
          swich_mode : function(mode) {this[mode] = !this[mode]; return this[mode]}
          }
  //обрезание массива при добавлении элементов не в конце списка
  history.length = history_counter+1
}

function copy_history() {
  history[history_counter] = {...history[history_counter-1]}
}

function so_crit_value_add(_new_){
    
    let crit_value = (history_counter+_new_ < 0 || history_counter+_new_ >= history.length)
    if (crit_value) _new_ = 0
    history_counter += _new_

  return crit_value
 }
export {history, history_counter, add_history, copy_history, so_crit_value_add}