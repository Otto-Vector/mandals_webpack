
let history = []
let history_counter = 0

//значения по умолчанию
let history_default = {
          selected_mandala  : 4,
          title_of_mandala  : title_input.value,
          length_of_title 	: title_input.value.length,
          dots_mode 				: false,
          grid_mode 				: false,
          grid_mode_for_dots: false,
          border_mode				: true,
          border_color			: -1,
          number_mode				: false,
          visible_colors  	: [true,true,true,true,true,true,true,true,true,true],
          second_color_mode : false,
          gray_mode         : false,
          second_gray_mode  : false,
          // camera_range      : 30,
          swich_mode        : function(mode) {this[mode] = !this[mode]; return this[mode]}
          }

//первая запись из запуска
history[history_counter] = { ...history_default }

////////////////////////////////////
function add_history(){
	history[++history_counter] = { ...history_default }
	history[history_counter].selected_mandala = +select_mandala_type.value
	history[history_counter].title_of_mandala = title_input.value
	history[history_counter].length_of_title 	= +number_of_symbols.value || title_input.value.length
	history[history_counter].visible_colors  	= [true,true,true,true,true,true,true,true,true,true]

  //обрезание массива при добавлении элементов не в конце списка
  history.length = history_counter+1
}

function copy_history() {
  history[history_counter] = {...history[history_counter-1]}
}

function copy_history_colors() {
	history[history_counter].visible_colors 		= [...history[history_counter-1].visible_colors]
  history[history_counter].second_color_mode  = history[history_counter-1].second_color_mode
  history[history_counter].gray_mode          = history[history_counter-1].gray_mode
  history[history_counter].second_gray_mode  	= history[history_counter-1].second_gray_mode
}

function copy_history_visual() {
	history[history_counter].dots_mode					= history[history_counter-1].dots_mode
  history[history_counter].grid_mode 					= history[history_counter-1].grid_mode
  history[history_counter].grid_mode_for_dots = history[history_counter-1].grid_mode_for_dots
  history[history_counter].border_mode 				= history[history_counter-1].border_mode
  history[history_counter].number_mode 				= history[history_counter-1].number_mode
}

function so_crit_value_add(_new_){
    
    let crit_value = (history_counter+_new_ < 0 || history_counter+_new_ >= history.length)
    if (crit_value) _new_ = 0
    history_counter += _new_

  return crit_value
 }
export {history, history_counter, add_history, copy_history, so_crit_value_add, copy_history_colors, copy_history_visual}