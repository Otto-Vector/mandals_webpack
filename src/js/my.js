"use strict"

//базовые переменные и объекты
import {history, history_counter} from './modules/history.js'
import {max_expansion_length,
        opacity_button,
        unactive_visual_button} from './default_values.js'


//модули переменных и функций поддержки
import './modules/prototypes.js' //прототипизированные функции
import {modification_to_normal, to_one_fibbonachi_digit,
        all_visibler_colors, toggle_visibler} from './modules/support.js'
import {basic_colors, color_change_to_second,
        color_change_to_gray, gray_second} from './modules/color_change.js'


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
import {autofocus} from './modules/camera_autofocus.js'

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

//функционал вывода помощи
import './nodmodules/help_description.js'

//модуль перезапуска и очистки памяти
import {reinit} from './modules/reinit.js'

//функционал нажатия кнопок
import {selected_button, check_left_panel} from './modules/selected_buttons_todo.js'


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
  

  /////////////БЛОК ОБРАБОТКИ ЦВЕТОВЫХ СХЕМ///////////////////////////////////////////////
  
  //задание второй цветовой схемы
  color_change_to_second(history[history_counter].second_color_mode)
  //манипуляции с серыми цветовыми схемами
  if (history[history_counter].gray_mode) {
    color_change_to_gray(history[history_counter].gray_mode)
    gray_second(history[history_counter].second_gray_mode)
  }
  //перекрас материала по новым цветовым схемам
  color_material_set()


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
  all_visibler_colors(history[history_counter].dots_mode ? dots : [...axis, ...plain_x_cube], history[history_counter].visible_colors)
  
  
  //создаём сетку
  grid_squares = grid([...axis, ...plain_x_cube])
  toggle_visibler(grid_squares,
    history[history_counter].dots_mode ? //отображение сетки в зависимости от тотчечного режима
    history[history_counter].grid_mode_for_dots : history[history_counter].grid_mode)
  
  //для корректировки отображения обводки на ромбовидных мандалах
  history[history_counter].border_mode =
    ( history[history_counter].selected_mandala.true_of(3,5)
      && history[history_counter].number_mode ) ? false : history[history_counter].border_mode


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
  
  //изменение вида кнопок левой панели (отключенные объекты)
  check_left_panel()
  //проверка на засвет кнопок отмены/повтора и запуск счётчика под ним
  undo_redo_check()
  
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


  
  // onWindowResize()
  //автофокусировка дальности камеры в зависимости от размера экрана и т.п.
  autofocus()

}; //init() end bracket


export {axis, plain_x_cube, grid_squares, border, scale_border, charNumber, dots, init}