import {scene, remove_all_objects_from_memory} from './three_manipulations.js'
// import {number_of_symbols, title_input} from '../nodmodules/title_inputs.js'
import {charNumber} from './visual_constructors.js'
import {axis, plain_x_cube, border, grid_squares, scale_border, init} from '../my.js'

////////////////////////////////////////////////////////////////////////////////////////////////////////
//функция перезапуска мандалы с новыми данными//
let reinit = function () {

    //зачистка памяти
    if (axis) remove_all_objects_from_memory(axis)
    if (plain_x_cube) remove_all_objects_from_memory(plain_x_cube)
    if (charNumber) remove_all_objects_from_memory(charNumber)
    if (grid_squares) remove_all_objects_from_memory(grid_squares)
    if (border) remove_all_objects_from_memory(border)

    //всё не так просто с этим объектом. он сгруппирован
    if (scale_border) { scene.remove( scale_border ) }


    let number_of_symbols_correct = +number_of_symbols.value || title_input.value.length

    //перезапуск
    init(select_mandala_type.value, title_input.value, number_of_symbols_correct )
  }

  export {reinit}