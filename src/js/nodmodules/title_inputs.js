
import {max_expansion_length, max_input_length} from '../default_values.js'

import {reinit} from '../modules/reinit.js'

  ///number_of_symbols
  //количество символов для расширения/сужения мандалы
  let number_of_symbols = document.querySelector("#number_of_symbols")
  
  ///number_of_symbols__clear
  //кнопка очистки числового значения количества символов
  let number_of_symbols__clear = document.querySelector("#number_of_symbols__clear")

  ///title_input
  //поле ввода значения/имени мандалы
  let title_input = document.querySelector("#title_input")

  ///clear_button
  //кнопка очистки значений и фокусировка на поле ввода
  let clear_button = document.querySelector("#clear_button")


//////////////////////////////////////////////////////////////
function number_of_symbols_init(_resize){
    //задание дефолтных значений поля ввода количества символов
    number_of_symbols.placeholder = title_input.value.length
    number_of_symbols.max = max_expansion_length
    //перезапись значения
    number_of_symbols.value =
      (_resize !== title_input.value.length) ? _resize : ''
  }


//////////////СОБЫТИЯ/////////////////////////////////////
//////////////СОБЫТИЯ/////////////////////////////////////
//////////////СОБЫТИЯ/////////////////////////////////////

//контроль ввода цифровых значений
  number_of_symbols.oninput = function() {
    //убираем ввод недопустимых символов
    number_of_symbols.value = number_of_symbols.value.delete_all_spaces()
    //удаляем первый ноль
    if (number_of_symbols.value == 0) number_of_symbols.value = ""
    //предотвращаем ввод от руки большого значения
    if (number_of_symbols.value > max_expansion_length) number_of_symbols.value = max_expansion_length
  }
  
  number_of_symbols__clear.onclick = function() {
    number_of_symbols.value = ""
    let todo_focus_wrap = () => number_of_symbols.focus()
    todo_focus_wrap()
  }
  
  //контроль ввода значений мандалы
  title_input.oninput = function() {
    //убираем пробелы,точки и запятые при вводе
    title_input.value = title_input.value.delete_all_spaces()
    //обрезаем ввод
    if (title_input.value.length >= max_input_length)
      title_input.value = title_input.value.substr(0,max_input_length)

    //данные о длине вводимой строки сразу вводятся в поле
    number_of_symbols.placeholder = title_input.value.length
    number_of_symbols.value = ""
  }
  
  //очистка поля title_input
  clear_button.onclick = () => {
    title_input.value = ""
    number_of_symbols.value = ""
    number_of_symbols.placeholder = 0
    let todo_focus_wrap = () => title_input.focus()
    todo_focus_wrap()
    }

//пересборка мандалы по нажанию Enter в полях ввода
  title_input.onkeydown = onEnter
  number_of_symbols.onkeydown = onEnter

  function onEnter(e) {

    if (e.key == "Enter") reinit()

    if (e.key == "ArrowUp" || e.key == "ArrowDown") number_of_symbols_changer_from_current(e)

  }
///////////////////////ФУНКЦИИ/////////////////////////////////////
///////////////////////ФУНКЦИИ/////////////////////////////////////
///////////////////////ФУНКЦИИ/////////////////////////////////////

//функция изменения цифр по нажатию стрелок вверх-вниз    
  function number_of_symbols_changer_from_current(e) {
    //если поле пустое, то отсчет ведется от длины введенного текста
    if (!number_of_symbols.value) number_of_symbols.value = title_input.value.length

    //добавление манипуляций с количеством из поля ввода имени мандалы
    if (e.target.id == title_input.id)
      if (e.key == "ArrowUp" && number_of_symbols.value < max_expansion_length)
        ++number_of_symbols.value
      else if (e.key == "ArrowDown" && number_of_symbols.value > 1)
        --number_of_symbols.value
    }


export {number_of_symbols, title_input, clear_button,
        number_of_symbols_changer_from_current, number_of_symbols_init}