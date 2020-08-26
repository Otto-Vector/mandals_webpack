import {scene, remove_all_objects_from_memory} from './three_manipulations.js'
// import {number_of_symbols, title_input} from '../nodmodules/title_inputs.js'
import {charNumber} from './visual_constructors.js'
import {axis, plain_x_cube, border, grid_squares, scale_border, init} from '../my.js'

let history = []
let history_counter = 0

//первая запись из запуска
history[history_counter] = [
                select_mandala_type.value,
                title_input.value,
                title_input.value.length
            ]

////////////////////////////////////////////////////////////////////////////////////////////////////////
//функция перезапуска мандалы с новыми данными//
let reinit = function (_new = 0) {

    let number_of_symbols_correct = +number_of_symbols.value || title_input.value.length
    
    if (_new == 0) {

        let history_element = [
                select_mandala_type.value,
                title_input.value,
                number_of_symbols_correct
            ]
        

        history[++history_counter] = history_element

    }

    let crit_value = (history_counter+_new < 0 || history_counter+_new == history.length)
    if (crit_value) _new = 0
    
    history_counter += _new
    
    if (!crit_value) {
        //зачистка памяти
        if (axis) remove_all_objects_from_memory(axis)
        if (plain_x_cube) remove_all_objects_from_memory(plain_x_cube)
        if (charNumber) remove_all_objects_from_memory(charNumber)
        if (grid_squares) remove_all_objects_from_memory(grid_squares)
        if (border) remove_all_objects_from_memory(border)

        //всё не так просто с этим объектом. он сгруппирован
        if (scale_border) { scene.remove( scale_border ) }
        //перезапуск
        init(...history[history_counter])
    }

  }

  export {reinit}