import {scene, remove_all_objects_from_memory} from './three_manipulations.js'
// import {number_of_symbols, title_input} from '../nodmodules/title_inputs.js'
// import {charNumber} from './visual_constructors.js'
import {history, history_counter, so_crit_value_add, add_history, copy_history} from '../nodmodules/undo_redo.js'
import {axis, plain_x_cube, border, grid_squares, scale_border, charNumber, dots, init} from '../my.js'


////////////////////////////////////////////////////////////////////////////////////////////////////////
//функция перезапуска мандалы с новыми данными//
let reinit = function (_new = 0) {

  //добавление записи в историю
  if (_new==0) add_history()
  if (_new=='copy') {
    copy_history()
    _new = 1
  }
  console.log(history_counter+' of '+ history.length)
  //проверка на крит.значения массива history
  //(не меньше нуля и не больше размера массива)
  if (!so_crit_value_add(_new)) {
      //зачистка памяти
      if (axis) remove_all_objects_from_memory(axis)
      if (plain_x_cube) remove_all_objects_from_memory(plain_x_cube)
      if (charNumber) remove_all_objects_from_memory(charNumber)
      if (grid_squares) remove_all_objects_from_memory(grid_squares)
      if (border) remove_all_objects_from_memory(border)
      if (dots) remove_all_objects_from_memory(dots)

      //всё не так просто с этим объектом. он сгруппирован
      if (scale_border) { scene.remove( scale_border ) }
      //перезапуск
      init()
  }

}

export {reinit}