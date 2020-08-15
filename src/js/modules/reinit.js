  import {scene,remove_all_objects_from_memory} from './three_manipulations.js'
  import {charNumber} from './visual_constructors.js'
  import {number_of_symbols} from '../nodmodules/title_inputs.js'
  // import {axis} from '../default_values.js'

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //функция перезапуска мандалы с новыми данными//
  let reinit = function () {

      //зачистка памяти
      if (axis) remove_all_objects_from_memory(axis)
      if (plain_x_cube) remove_all_objects_from_memory(plain_x_cube)

      if (border) remove_all_objects_from_memory(border)
      if (charNumber) remove_all_objects_from_memory(charNumber)
        // console.log(charNumber)
      if (grid_squares) remove_all_objects_from_memory(grid_squares)

      if (scale_border) {
        scene.remove( scale_border )
        scale_border = null }

      //обработка введенной строки
      // input_string = modification_to_normal(title_input.value)
      //дополнительная проверка на ошибки при вводе значений количетва символов
      let number_of_symbols_correct = +number_of_symbols.value || input_string.length

      //перезапуск
      init(select_mandala_type.value, input_string, number_of_symbols_correct )
  }

  export {reinit}