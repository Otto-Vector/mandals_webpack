"use strict"

//базовые переменные и объекты
import {history, history_counter} from './modules/history.js'
import {max_expansion_length,
        opacity_button,
        unactive_visual_button} from './default_values.js'


//модули переменных и функций поддержки
import './modules/prototypes.js' //прототипизированные функции
import {modification_to_normal, to_one_fibbonachi_digit} from './modules/support.js'
import {basic_colors, color_change_to_second, color_change_to_gray, gray_second} from './modules/color_change.js'


//модули THREE
import {scene, camera, renderer,
        onWindowResize, animate, remove_all_objects_from_memory} from './modules/three_manipulations.js'
import {plane_square_3x_algorithm, curtail_diamond_algorithm, chess_algorithm} from './modules/calc_mandalas_algorithms.js'
import {dots_visibler,
        color_material_for_border, color_material_set,
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
import {undo_redo_check} from './nodmodules/undo_redo.js'

import './nodmodules/help_description.js'

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
function init() {

  
  /////////////////////////////////////////////////////////////////////////////////
  //////////////////////////BEGIN/////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  //  задаёт разные мандалы
  // 2 - квадрат (по три) =11=                      +
  // 4 - на квадрат (по три)                        + 
  // 3 - "ромб" (концентрация квадрата по три)      +
  // 5 - "ромб" (концентрация квадрата по три) =11= +
  // 8 - на квадрат шахматный расчёт (1вар)         +
  // 9 - на квадрат шахматый расчёт (2вар)          +
  // 6 - на квадрат шахматный расчёт (1вар) =11=    + 
  // 7 - на квадрат шахматый расчёт (2вар) =11=     +
  // 
  
  //проверка на первый запуск init() (по умолчанию 4-ый вариант)
  history[history_counter].selected_mandala = history[history_counter].selected_mandala || 4
  
  
  //задание цветовых схем
  color_change_to_second(history[history_counter].second_color_mode)
  color_change_to_gray(history[history_counter].gray_mode)
  gray_second(history[history_counter].gray_mode && history[history_counter].second_gray_mode)
  color_material_set()

  //////////////////////////////////////////////////////////////
  //здесь будет адаптация отдаления камеры по размеру вводимого значения
  if (history[history_counter].selected_mandala.true_of(2,3,4,5)) camera.position.set( 0, 0, history[history_counter].camera_range ) //60 //позиция камеры для малых квадратов
  if (history[history_counter].selected_mandala.true_of(6,7,8,9)) camera.position.set( 0, 0, history[history_counter].camera_range == 60 ? 120 : history[history_counter].camera_range ) //позиция камеры для больших квадратов

  
  ///////////////БЛОК ОБРАБОТКИ ВВОДИМОЙ СТРОКИ///////////////////////////////////////////////

  ///заменяемая строка при неверном вводе (сейчас вводит дату)
  let default_string = "01234567890" //тестовая строка на которую заменяется при неверном вводе
  ///Блок подстановки текущей даты
  let date_from_pc = new Date()
  //приводим дату к строке используя zero_include()
  default_string = date_from_pc.getDate().zero_include()
                 + (date_from_pc.getMonth()+1).zero_include()
                 + date_from_pc.getFullYear()

  
  //нормализация введенной строки для корректного перевода в цифровой массив
  history[history_counter].title_of_mandala = modification_to_normal(history[history_counter].title_of_mandala, default_string)

  //////////////////////////////////////////////////////////////
  /////// Блок адаптации букв в цифровой код //////////////////
  ////////////////////////////////////////////////////////////
  
  //если не задан, то присваивается значение длины введенной строки
  history[history_counter].length_of_title = +history[history_counter].length_of_title || history[history_counter].title_of_mandala.length
  
  //символы расположены строго по таблице (удачно получилось то, что нужен всего один пробел)
  let simbols_static = "abcdefghijklmnopqrstuvwxyz абвгдеёжзийклмнопрстуфхцчшщъыьэюя"

  //переводит строку в массив чисел
  let input_string_array =  history[history_counter].title_of_mandala.to_array_of_numbers(simbols_static)
  
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

  // 2 - квадрат (по три) =11=                      +
  // 4 - на квадрат (по три)                        + 

  if ( history[history_counter].selected_mandala.true_of(4,2) )
    plane_of_colors = plane_square_3x_algorithm( string_for_algorithms,
                                                 history[history_counter].selected_mandala.true_of(2) )

  // 3 - "ромб" (концентрация квадрата по три)      +
  // 5 - "ромб" (концентрация квадрата по три) =11= +

  if ( history[history_counter].selected_mandala.true_of(3,5) )
    plane_of_colors = curtail_diamond_algorithm( plane_square_3x_algorithm( string_for_algorithms,
                                                 history[history_counter].selected_mandala.true_of(5) ),
                                                 history[history_counter].selected_mandala.true_of(5) )

  // 8 - на квадрат шахматный расчёт (1вар)         +
  // 9 - на квадрат шахматый расчёт (2вар)          +
  // 6 - на квадрат шахматный расчёт (1вар) =11=    + 
  // 7 - на квадрат шахматый расчёт (2вар) =11=     +

  if ( history[history_counter].selected_mandala.true_of(6,7,8,9) )
    plane_of_colors = chess_algorithm ( string_for_algorithms,
                                        //передается boolean для второго расчёта оси
                                        history[history_counter].selected_mandala.true_of(7,9),
                                        history[history_counter].selected_mandala.true_of(6,7)
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
  toggle_visibler(grid_squares,
    history[history_counter].dots_mode ? //отображение сетки в зависимости от тотчечного режима
    history[history_counter].grid_mode_for_dots : history[history_counter].grid_mode)
  
  //для корректировки отображения обводки на ромбовидных мандалах
  if (history[history_counter].selected_mandala.true_of(3,5) && history[history_counter].number_mode)
    history[history_counter].border_mode = false

  //массив для элементов обводки мандалы
  border = border_visual( plane_of_colors[0] )
  //не включать бордер в режиме точек
  toggle_visibler(border, !history[history_counter].dots_mode && history[history_counter].border_mode)
  
  //значения по умолчанию для неназначенного цвета бордюра
  if (history[history_counter].border_color < 0)
    history[history_counter].border_color =
      history[history_counter].selected_mandala.true_of(3,5) ? 0 : summ_to_zero_element
  //перекрас бордюра в цвет из истории
  color_material_for_border.color.set(basic_colors[history[history_counter].border_color])

  //массив для поворота и изменения размера обводки в мандале "ромб"
  scale_border = history[history_counter].selected_mandala.true_of(3,5) ? x_border_visual(border) : null
  //цифры//
  //активация переменной charNumber и прорисовка объектов цифр в инвиз
  charNumber = charNumber_active([...axis,...plain_x_cube])
  toggle_visibler(charNumber, !history[history_counter].dots_mode && history[history_counter].number_mode)
  

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
  title_input.value =  history[history_counter].title_of_mandala
  
  //задание дефолтных значений поля ввода количества символов
  number_of_symbols_init(history[history_counter].length_of_title)
  
  
  ///selected mandalas type
  //селект для выбора типа мандалы
  let select_mandala_type = document.querySelector("#select_mandala_type")
  //задание дефолтных значений
  select_mandala_type.value = history[history_counter].selected_mandala
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
    toggle_visibler_from_button( !history[history_counter].dots_mode ? [...axis,...plain_x_cube] : dots)
    //запуск изменения формы кнопок при нажатии девизуализации
    palitra_button__unactive_visibler( !history[history_counter].dots_mode ?
                                       [...axis,...plain_x_cube] : dots, unactive_visual_button)
   

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
        palitra_button__unactive_visibler(!history[history_counter].dots_mode ? [...axis,...plain_x_cube] : dots, unactive_visual_button)

      }
    }


    //Смена схем отображения цветов
    if (selected_html_content === "C") {
      
      if (!history[history_counter].gray_mode) {
       
        color_change_to_second(history[history_counter].swich_mode('second_color_mode'))
      }
      else {
        history[history_counter].swich_mode('second_gray_mode')
        gray_second(true)
      }
        palitra_button__colored()
        color_material_set()
        //отдельно, изменение цвета для бордюра
        color_material_for_border.color.set(basic_colors[history[history_counter].border_color])
    }

    //Серая схема
    if (selected_html_content === "G") {

      history[history_counter].swich_mode('gray_mode')
      color_change_to_gray(history[history_counter].gray_mode)

      //сохранение измененной (в случае выбора) схемы цветных цветов
      if (!history[history_counter].gray_mode) {
        color_change_to_second(history[history_counter].second_color_mode)
      }
      
      palitra_button__colored()
      color_material_set()
      color_material_for_border.color.set(basic_colors[history[history_counter].border_color])

    }


    //отображение сетки//
    if (selected_html_content === "#") {
      
      if (!history[history_counter].dots_mode)
        history[history_counter].swich_mode('grid_mode')
      else
        history[history_counter].swich_mode('grid_mode_for_dots')

      toggle_visibler( grid_squares, history[history_counter].dots_mode ?
        history[history_counter].grid_mode_for_dots : history[history_counter].grid_mode
      )

    }

   
    //смена цвета для бордера//
    if (selected_html_content === "B" &&
       !history[history_counter].dots_mode && history[history_counter].border_mode) {

      //перебор по циклу
      history[history_counter].border_color =
          (+history[history_counter].border_color === 9) ? 0 : ++history[history_counter].border_color

      //перекрас через материал для бордюра
      color_material_for_border.color.set(basic_colors[history[history_counter].border_color])

    }

    //отображение бордера//
    if (selected_html_content === "b" &&
        //не включать в режиме точек
        !history[history_counter].dots_mode &&
        //не включать в режиме цифр на мандале "ромб"
        !(history[history_counter].selected_mandala.true_of(3,5) && history[history_counter].number_mode)
      ) {

      history[history_counter].swich_mode('border_mode')
      toggle_visibler( border, history[history_counter].border_mode )

    }
    
    //отображение цифр//
    if (selected_html_content === "№" && !history[history_counter].dots_mode) {
      history[history_counter].swich_mode('number_mode')
      toggle_visibler( charNumber, history[history_counter].number_mode )
      //
      //убираем бордер для отображения цифр при третьей мандале и возвращаем при неактиве
      if (history[history_counter].selected_mandala.true_of(3,5)) {
        //в зависимости от отображаемых цифр
        history[history_counter].swich_mode('border_mode')
        toggle_visibler( border, history[history_counter].border_mode )
      }

    }

    
    //точечный режим//
    if (selected_html_content == "\u2219") {
    
      toggle_visibler(dots, history[history_counter].swich_mode('dots_mode') )
      
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
      palitra_button__unactive_visibler(!history[history_counter].dots_mode ? [...axis,...plain_x_cube] : dots, unactive_visual_button)

    }

    //отдаление/приближение//
    if (selected_html_content === "+") {
      camera.position.z = (camera.position.z > 10) ? camera.position.z - 9 : 10
    }
    if (selected_html_content === "-") {
      camera.position.z = camera.position.z + 9
    }
    
    if (selected_html_content === "?") {
      help_panel.classList.toggle('active')
    }
    
    //пересборка отображения кнопок левой панели
    check_left_panel()

  }

  function check_left_panel() {
    
    //создаём буфер со значениями кнопок в ключах
    let face = {}
    for (const [i, val] of palitra.entries()) { face[val.innerText[0]] = i }
    
    //"C"
    palitra[face["C"]].classList.toggle( unactive_visual_button,
      //учет логики переключения в сером цвете
      ( !history[history_counter].gray_mode && history[history_counter].second_color_mode )
      ||
      ( history[history_counter].gray_mode && history[history_counter].second_gray_mode )
    )
    
    //"G"
    palitra[face["G"]].classList.toggle( unactive_visual_button, history[history_counter].gray_mode)

    //"#"
    palitra[face["#"]].classList.toggle(unactive_visual_button, !grid_squares[0].visible)

    //"B" //тут перекрас в цвет бордера
    palitra[face["B"]].style.backgroundColor = basic_colors[history[history_counter].border_color]
    palitra[face["B"]].classList.toggle(
      opacity_button, history[history_counter].dots_mode || !history[history_counter].border_mode)

    //"b"
    palitra[face["b"]].classList.toggle(unactive_visual_button, !border[0].visible)
    palitra[face["b"]].classList.toggle(opacity_button, history[history_counter].dots_mode)

    //"№"
    palitra[face["№"]].classList.toggle(unactive_visual_button, !charNumber[0].visible)
    palitra[face["№"]].classList.toggle(opacity_button, history[history_counter].dots_mode)

    //"∙"
    palitra[face["∙"]].classList.toggle(unactive_visual_button, !history[history_counter].dots_mode)
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