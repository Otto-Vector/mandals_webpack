"use strict"

//модули переменных и функций поддержки
import './modules/prototypes.js' //прототипизированные функции
import {basic_colors, camera_range, max_expansion_length,
        opacity_button,
        unactive_visual_button
        } from './default_values.js'
import {modification_to_normal, to_one_fibbonachi_digit} from './modules/support.js'

//модули THREE
import {scene, camera, renderer,
        onWindowResize, animate, remove_all_objects_from_memory} from './modules/three_manipulations.js'
import {plane_square_3x_algorithm, curtail_diamond_algorithm, chess_algorithm} from './modules/calc_mandalas_algorithms.js'
import {dots_visibler,
        charNumber_active,
        axis_visual,
        plain_x_cube_visual,
        border_visual,
        x_border_visual,
        grid} from './modules/visual_constructors.js'

//модули для обработки DOM элементов
import {title_input,
        number_of_symbols,
        number_of_symbols_init,
        number_of_symbols_changer_from_current} from './nodmodules/title_inputs.js'
import {palitra,
        palitra_button__default_pos_value,
        palitra_button__colored,
        palitra_button__check_unactive,
        palitra_button__unactive_visibler,
        statistic__value_counter,
        statistic_item,
        statistic_item__zero,
        statistic_sort_button,
        statistic_sort_button__sort} from './nodmodules/palitra_sort_buttons.js'
import {header_title,
        numeric_adaptation_Node_elements} from './nodmodules/numeric_adaptation.js'

import {history, history_counter, undo_redo_check} from './nodmodules/undo_redo.js'

//модуль перезапуска и очистки памяти
import {reinit} from './modules/reinit.js'


//запуск программы
window.onload = init

  /////////////////////////////////////////////////////////////////////////////////////
  ///////////////////PRE_BEGIN////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////

  //добавление графического окна к документу в тег
  document.body.appendChild( renderer.domElement )
  //при динамическом изменении размера окна
  window.addEventListener('resize', onWindowResize, false)

//глобальные переменные
let axis, plain_x_cube, grid_squares, border, scale_border, dots, charNumber

//основная функция
// function init(value_init, previous_input, history[history_counter].length_of_title) {
function init() {


  
  /////////////////////////////////////////////////////////////////////////////////
  //////////////////////////BEGIN/////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  //  задаёт разные мандалы
  // 3 - "ромб" (концентрация квадрата по три)  +
  // 4 - на квадрат (по три)                    +
  // 8 - на квадрат шахматный расчёт (1вар)     +
  // 9 - на квадрат шахматый расчёт (2вар)      +
  // 
  //проверка на первый запуск init() (по умолчанию 4-ый вариант)
  
  //переназначение из длинных названий в короткие
  let selected_mandala = history[history_counter].selected_mandala
  // let dots_mode = history[history_counter].dots_mfode
  // history[history_counter].let visible_colors = history[history_counter].history[history_counter].visible_colors

    
  // let history[history_counter].grid_mode = false
  // let history[history_counter].grid_mode_for_dots = false
  // let history[history_counter].border_mode = true
  // let history[history_counter].number_mode = false
  // history[history_counter].border_color = 9
  //////////////////////////////////////////////////////////////
  //здесь будет адаптация отдаления камеры по размеру вводимого значения
  if (selected_mandala.true_of(4,3)) camera.position.set( 0, 0, camera_range ) //60 //позиция камеры для малых квадратов
  if (selected_mandala.true_of(8,9)) camera.position.set( 0, 0, 120 ) //позиция камеры для больших квадратов

  
  ///////////////БЛОК ОБРАБОТКИ ВВОДИМОЙ СТРОКИ///////////////////////////////////////////////

  ///заменяемая строка при неверном вводе (сейчас вводит дату)
  let default_string = "01234567890" //тестовая строка на которую заменяется при неверном вводе
  ///Блок подстановки текущей даты
  let date_from_pc = new Date()
  //приводим дату к строке используя zero_include()
  default_string = date_from_pc.getDate().zero_include()
                 + (date_from_pc.getMonth()+1).zero_include()
                 + date_from_pc.getFullYear()

  
  //пустая строка при первой инициализации
  let input_string = history[history_counter].title_of_mandala

  //нормализация введенной строки для корректного перевода в цифровой массив
  input_string = modification_to_normal(input_string, default_string)


  //////////////////////////////////////////////////////////////
  /////// Блок адаптации букв в цифровой код //////////////////
  ////////////////////////////////////////////////////////////
  
  //если не задан, то присваивается значение длины введенной строки
  history[history_counter].length_of_title = +history[history_counter].length_of_title || input_string.length
  
  //символы расположены строго по таблице (удачно получилось то, что нужен всего один пробел)
  let simbols_static = "abcdefghijklmnopqrstuvwxyz абвгдеёжзийклмнопрстуфхцчшщъыьэюя"

  //переводит строку в массив чисел
  let input_string_array = input_string.to_array_of_numbers(simbols_static)
  
  //изменяет размер обрабатываемой числовой строки
  let string_for_algorithms = input_string_array
                              .to_number_of_symbols(history[history_counter].length_of_title)
                              .map(Number) //мапим, чтобы не изменять предыдущий массив

  //добавляется нулевой элемент суммы всех чисел по фибоначи
  let summ_to_zero_element = to_one_fibbonachi_digit( string_for_algorithms.reduce( (sum,n) => sum+n ))
  //в начало массива
  string_for_algorithms.unshift( summ_to_zero_element )

 


  ///////////ВЫБОР АЛГОРИТМА РАСЧЁТА///////////
  //высчитываем двумерный массив цветов для одной стороны мандалы
  let plane_of_colors = []

  if ( selected_mandala.true_of(4) )
    plane_of_colors = plane_square_3x_algorithm( string_for_algorithms )

  if ( selected_mandala.true_of(3) )
    plane_of_colors = curtail_diamond_algorithm( plane_square_3x_algorithm( string_for_algorithms ) )

  if ( selected_mandala.true_of(8,9) )
    plane_of_colors = chess_algorithm ( string_for_algorithms,
                                        selected_mandala.true_of(9) //передается boolean для второго расчёта оси
                                      )

  ///////////////////////////////////////////////////////////////////////////////
  //////////////// задание и визуализация объектов /////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  
  //задаём ось
  axis = axis_visual( plane_of_colors[0] )

  //пластины между осями
  plain_x_cube = plain_x_cube_visual(plane_of_colors)
   
  toggle_visibler([...axis,...plain_x_cube], !history[history_counter].dots_mode)

  //точки
  dots = dots_visibler([...axis,...plain_x_cube])
  toggle_visibler( dots, history[history_counter].dots_mode )
  
  //отображение цветов, в зависимости от режима
  all_visibler_colors(history[history_counter].dots_mode ? dots : [...axis, ...plain_x_cube])
  
  
  //создаём сетку
  grid_squares = grid([...axis, ...plain_x_cube])
  toggle_visibler(grid_squares, history[history_counter].grid_mode)
  
  //массив для элементов обводки мандалы
  border = border_visual( plane_of_colors[0] )
  toggle_visibler(border, history[history_counter].border_mode)
  history[history_counter].border_color = border[0].colornum
  //массив для поворота и изменения размера обводки в мандале "ромб"
  scale_border = selected_mandala.true_of(3) ? x_border_visual(border) : null

  //цифры//
  //активация переменной charNumber и прорисовка объектов цифр в инвиз
  charNumber = charNumber_active([...axis,...plain_x_cube])
  toggle_visibler(charNumber, history[history_counter].number_mode)
  

  ////анимация объектов////////////////////
  // if (!+value_init) 
  animate()



  //////////////////////////////////////
  ///DOM///////////////////////////////
  ////////////////////////////////////

  //возвращение кнопок в дефолтное значение
  palitra_button__default_pos_value()
  //окрашиваем кнопки визуализации цветов
  palitra_button__colored()
  
  //обнуление значений статы
  statistic_item__zero()
  //подсчёт статистики и его отображение
  statistic__value_counter([...axis,...plain_x_cube])
  
  //запуск изменения формы кнопок при проверке девизуализации
  palitra_button__unactive_visibler(history[history_counter].dots_mode ? dots : [...axis, ...plain_x_cube], unactive_visual_button)
  //затемнение неактивных кнопок на основе статы
  palitra_button__check_unactive(opacity_button)
  
  //изменение кнопок левой панели (отключенные объекты)
  check_left_panel()

  //вывод в заголовок обработанного текста
  title_input.value = input_string
  
  //задание дефолтных значений поля ввода количества символов
  number_of_symbols_init(history[history_counter].length_of_title)
  
  
  ///selected mandalas type
  //селект для выбора типа мандалы
  let select_mandala_type = document.querySelector("#select_mandala_type")
  //задание дефолтных значений
  select_mandala_type.value = selected_mandala
  //перезапуск по выбору типа мандалы
  select_mandala_type.oninput = function() { reinit() }
 

  ///numeric_adaptation
  let numeric_adaptation = document.querySelector("#numeric_adaptation")
  //зачистка предыдущих значений
  numeric_adaptation.innerHTML = null
  //запуск функции сборки    
  numeric_adaptation_Node_elements(input_string_array, numeric_adaptation, history[history_counter].length_of_title)    

  //проверка на засвет кнопок отмены/повтора и запуск счётчика под ним
  undo_redo_check()
  
  ///////////////////////////////////////////////////
  
  //отслеживание нажатия кнопок боковой панели и передача содержимого этих кнопок
  for (let i = 0; i < palitra.length; i++) {
    palitra[i].onmousedown = (event) => selected_button(event.target) //передача в функцию визуального содержимого кнопки
  }

  
  //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
  //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
  //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ///МАНИПУЛЯЦИИ С ПРИМЕНЕНИЕМ И ОСЛЕЖИВАНИЕМ СОБЫТИЙ НАЖАТИЯ НА ОБЪЕКТЫ И КНОПКИ НА БОКОВОЙ ПАНЕЛИ///
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  ////функция проверки нажатой кнопки боковых панелей
  function selected_button(selected_target) { //передаётся символ внутри кнопки

    let selected_html_content = selected_target.innerHTML

    //функция перебора массива с отслеживанием нажатых кнопок
    function toggle_visibler_from_button(arr) { //в ф-цию передаем массив
      arr.forEach(function(item) { //перебираем массив
          if (selected_html_content === "X") {
            item.visible = false //все искомые элементы становятся невидимыми
            history[history_counter].visible_colors[item.colornum] = item.visible
          }
          if (selected_html_content === "@" ||
             +selected_html_content === +item.colornum) {
             //смена видимости на невидимость
             item.visible = !item.visible
             //присваивание элементу видимости логического значения 
             history[history_counter].visible_colors[item.colornum] = item.visible
          }
          if (selected_html_content === "A") {
           item.visible = true //все искомые элементы становятся видимыми
           history[history_counter].visible_colors[item.colornum] = item.visible
          }
        })
    }


   
    //запуск девизуализации осей и плоскостей
    toggle_visibler_from_button((!history[history_counter].dots_mode)?[...axis,...plain_x_cube]:dots)
    //запуск изменения формы кнопок при нажатии девизуализации
    palitra_button__unactive_visibler((!history[history_counter].dots_mode)?[...axis,...plain_x_cube]:dots, unactive_visual_button)
   

    //дополнительно статистика на "S"
    if (selected_html_content === "S") { //отобразить/спрятать
      
      statistic.classList.toggle("active")

      //при девизуализации статы, кнопки цвета возвращаются на свои места
      if (statistic.className != "active") {

        //возврат и перекрас кнопок цвета
        palitra_button__default_pos_value()
        palitra_button__colored()

        //переподсчёт статы по новым положениям кнопок
        statistic_item__zero()
        statistic__value_counter([...axis,...plain_x_cube])

        //применение доп.эффектов на кнопки цвета на основе данных статы
        palitra_button__check_unactive(opacity_button)
        palitra_button__unactive_visibler((!history[history_counter].dots_mode) ? [...axis,...plain_x_cube] : dots, unactive_visual_button)

      }
    }

    //отображение сетки//
    if (selected_html_content === "#") {
      
      if (!history[history_counter].dots_mode)
        history[history_counter].grid_mode = !history[history_counter].grid_mode
      else
        history[history_counter].grid_mode_for_dots = !history[history_counter].grid_mode_for_dots

      toggle_visibler( grid_squares, history[history_counter].dots_mode ? history[history_counter].grid_mode_for_dots : history[history_counter].grid_mode )

    }

   
    //смена цвета для бордера//
    if (selected_html_content === "B" && !history[history_counter].dots_mode && history[history_counter].border_mode) {

      //перекрашиваем бордюр
      border.forEach( 
        function(entry) { 
          //перебор цвета в замкнутом цикле 9 и смена значения
          entry.colornum = (+entry.colornum === 9) ? 0 : ++entry.colornum
          //присвоение значения цвета
          entry.material.color.set( basic_colors[entry.colornum] )
        }
      )
    }

    //отображение бордера//
    if (selected_html_content === "b" &&
        //не включать в режиме точек
        !history[history_counter].dots_mode &&
        //не включать в режиме цифр на мандале "ромб"
        !(selected_mandala.true_of(3) && history[history_counter].number_mode)
      ) {

      history[history_counter].border_mode = !history[history_counter].border_mode
      toggle_visibler( border, history[history_counter].border_mode )

    }
    
    //отображение цифр//
    if (selected_html_content === "№" && !history[history_counter].dots_mode) {
      history[history_counter].number_mode = !history[history_counter].number_mode
      toggle_visibler( charNumber, history[history_counter].number_mode )
      //
      //убираем бордер для отображения цифр при третьей мандале и возвращаем при неактиве
      if (selected_mandala == 3) {
        //в зависимости от отображаемых цифр
        history[history_counter].border_mode = !history[history_counter].border_mode
        toggle_visibler( border, history[history_counter].border_mode )
      }

    }

    
    //точечный режим//
    if (selected_html_content == "\u2219") {
      
      history[history_counter].dots_mode = !history[history_counter].dots_mode

      toggle_visibler(dots, history[history_counter].dots_mode )
      
      if (history[history_counter].dots_mode) {
        //отключаем все, кроме точек
        let all_unvis = [...border,...axis,...plain_x_cube,...charNumber]
        toggle_visibler( all_unvis, false )
        
        //отображаем сетку, в зависимости от режима
        toggle_visibler( grid_squares, history[history_counter].grid_mode_for_dots )
        
        //отображаемые цвета
        all_visibler_colors(dots)

      }
      else {
        //включаем всё, в зависимости от состояния
        toggle_visibler( border, history[history_counter].border_mode )
        toggle_visibler( grid_squares, history[history_counter].grid_mode )
        toggle_visibler( charNumber, history[history_counter].number_mode )
        
        //отображение по цветам
        all_visibler_colors([...axis,...plain_x_cube])

      }
      
      //закруглять кнопки в зависимости от режима
      palitra_button__unactive_visibler((!history[history_counter].dots_mode)?[...axis,...plain_x_cube]:dots, unactive_visual_button)

    }

    //отдаление/приближение//
    if (selected_html_content === "+") camera.position.z = (camera.position.z > 10) ? camera.position.z - 10 : 10
    if (selected_html_content === "-") camera.position.z = camera.position.z + 10

    //пересборка отображения кнопок левой панели
    check_left_panel()

  }

  function check_left_panel() {
    //"#"
    palitra[10].classList.remove(unactive_visual_button)
    if (!grid_squares[0].visible) palitra[10].classList.toggle(unactive_visual_button)

    //"B" //тут перекрас в цвет бордера
    palitra[14].style.backgroundColor = basic_colors[border[0].colornum]
    
    palitra[14].classList.remove(opacity_button)
    if (history[history_counter].dots_mode || !history[history_counter].border_mode) palitra[14].classList.toggle(opacity_button)

    //"b"
    palitra[15].classList.remove(unactive_visual_button)
    if (!border[0].visible) palitra[15].classList.toggle(unactive_visual_button)
    palitra[15].classList.remove(opacity_button)
    if (history[history_counter].dots_mode) palitra[15].classList.toggle(opacity_button)

    //"№"
    palitra[16].classList.remove(unactive_visual_button)
    if (!charNumber[0].visible) palitra[16].classList.toggle(unactive_visual_button)
    palitra[16].classList.remove(opacity_button)
    if (history[history_counter].dots_mode) palitra[16].classList.toggle(opacity_button)

    //"."
    palitra[17].classList.remove(unactive_visual_button)
    if (!history[history_counter].dots_mode) palitra[17].classList.toggle(unactive_visual_button)
  }
  
  //функция пересборки видимости по цвету
  function all_visibler_colors(props) {
  for (let color in history[history_counter].visible_colors) {
          props.forEach( function(entry) {
            if (entry.colornum == color) 
              entry.visible = history[history_counter].visible_colors[color]
          } )
        }
  }

  function toggle_visibler(props, mode) {
    props.forEach( function(entry) { entry.visible = mode } )
  }

}; //init() end bracket



export {axis, plain_x_cube, grid_squares, border, scale_border, charNumber, dots, init}