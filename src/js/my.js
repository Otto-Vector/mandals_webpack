"use strict"

//мои модули
import './modules/prototypes.js' //прототипизированные функции
import {modification_to_normal, to_one_fibbonachi_digit} from './modules/support.js'
import {scene, camera, renderer,
        onWindowResize, animate, remove_all_objects_from_memory} from './modules/three_manipulations.js'
import {plane_square_3x_algorithm, curtail_diamond_algorithm, chess_algorithm} from './modules/calc_mandalas_algorithms.js'
import {basic_colors, charNumber_active, charNumber,
         axis_visual, plain_x_cube_visual, border_visual, x_border_visual, grid
        } from './modules/visual_constructors.js'


window.onload = init


function init(value_init, previous_input, number_of_symbols_resize) {

  /////////////////////////////////////////////////////////////////////////////////////
  ///////////////////PRE_BEGIN////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////

  
  //добавление графического окна к документу в тег
  if (!+value_init)
    document.body.appendChild( renderer.domElement )
  //при динамическом изменении размера окна
  window.addEventListener('resize', onWindowResize, false)

  
  /////////////////////////////////////////////////////////////////////////////////
  //////////////////////////BEGIN/////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  //  задаёт разные мандалы
  // 3 - "ромб" (концентрация квадрата по три)  +
  // 4 - на квадрат (по три)                    +
  // 8 - на квадрат шахматный расчёт (1вар)     +
  // 9 - на квадрат шахматый расчёт (2вар)      +
  // 
  let selected_mandala = +value_init || 4 //проверка на первый запуск init() (по умолчанию 4-ый вариант)
  
  //дальность камеры
  let camera_range = 60
  //максимальное количество символов вводимой строки
  let max_input_length = 33
  //максимальное количество знаков на расширение
  let max_expansion_length = 45 //было 57
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
  let input_string = +value_init ? previous_input : ""

  //нормализация введенной строки для корректного перевода в цифровой массив
  input_string = modification_to_normal(input_string, default_string)


  //////////////////////////////////////////////////////////////
  //здесь будет адаптация отдаления камеры по размеру вводимого значения
  if (selected_mandala.true_of(4,3)) camera.position.set( 0, 0, camera_range ) //60 //позиция камеры для малых квадратов
  if (selected_mandala.true_of(8,9)) camera.position.set( 0, 0, 120 ) //позиция камеры для больших квадратов


  //////////////////////////////////////
  ///DOM///////////////////////////////
  ////////////////////////////////////

  ///statistic_item
  //объекты пунктов статы
  let statistic_item = document.querySelectorAll("#statistic div")
  
  //обнуление значений статы
  statistic_item__zero()

  ///statistic_button
  //кнопка вывода статы
  let statistic_sort_button = document.querySelector("#statistic_sort_button")

  ///palitra
  //задаём массив кнопок
  let palitra = document.querySelectorAll(".palitra_button")
  
  //возвращение кнопок в дефолтное значение
  palitra_button__default_pos_value()
  //окрашиваем кнопки визуализации цветов
  palitra_button__colored()
  
  ///title_input
  //поле ввода значения/имени мандалы
  let title_input = document.querySelector("#title_input")
  //вывод в заголовок обработанного текста
  title_input.value = input_string
  
  ///number_of_symbols
  //количество символов для расширения/сужения мандалы
  let number_of_symbols = document.querySelector("#number_of_symbols")
  //задание дефолтных значений поля ввода количества символов
  number_of_symbols.placeholder = title_input.value.length
  number_of_symbols.max = max_expansion_length

  ///clear_button
  //кнопка очистки значений и фокусировка на поле ввода
  let clear_button = document.querySelector("#clear_button")

  ///selected mandalas type
  //селект для выбора типа мандалы
  let selected_mandala_type = document.querySelector("#select_mandala_type")
  //задание дефолтных значений
  select_mandala_type.value = selected_mandala

  ///numeric_adaptation
  //справочная строка под title`ом
  let numeric_adaptation = document.querySelector("#numeric_adaptation")
   

  ////////////////////////////////////////////////////////////////
  /// события/////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////


  //контроль ввода цифровых значений
  number_of_symbols.oninput = function() {
    //убираем ввод недопустимых символов
    number_of_symbols.value = number_of_symbols.value.delete_all_spaces()
    //удаляем первый ноль
    if (number_of_symbols.value == 0) number_of_symbols.value = ""
    //предотвращаем ввод от руки большого значения
    if (number_of_symbols.value > max_expansion_length) number_of_symbols.value = max_expansion_length
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
  
  //перезапуск по выбору типа мандалы
  selected_mandala_type.oninput = function() { reinit() }
  
  //пересборка мандалы по нажанию Enter в полях ввода
  title_input.onkeydown = onEnter
  number_of_symbols.onkeydown = onEnter

  function onEnter(e) {

    if (e.key == "Enter") reinit()

    if (e.key == "ArrowUp" || e.key == "ArrowDown") number_of_symbols_changer_from_current()

    function number_of_symbols_changer_from_current() {
      //если поле пустое, то отсчет ведется от длины введенного текста
      if (!number_of_symbols.value) number_of_symbols.value = title_input.value.length

      //добавление манипуляций с количеством из поля ввода имени мандалы
      if (e.target.id == title_input.id)
        if (e.key == "ArrowUp" && number_of_symbols.value < max_expansion_length)
          ++number_of_symbols.value
        else if (e.key == "ArrowDown" && number_of_symbols.value > 1)
          --number_of_symbols.value
      }

  }

  //нажатие кнопки сортировки статы
  statistic_sort_button.onclick = function() {
    //смена класса для визуализации параметров статы
    statistic_sort_button.classList.toggle("up")
    //сортировка
    statistic_sort_button__sort()
    //перекрашивание кнопок по изменившемуся значению
    palitra_button__colored()
    //переотметка неактивных визуально кубов
    palitra_button__unactive_visibler([...axis,...plain_x_cube], "unactive_visual_button")
    //проверка на нулевые значения статы
    palitra_button__check_unactive("opacity_button")
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //функция перезапуска мандалы с новыми данными//
  function reinit() {

      //зачистка памяти
      if (axis) remove_all_objects_from_memory(axis)
      if (plain_x_cube) remove_all_objects_from_memory(plain_x_cube)

      if (border) remove_all_objects_from_memory(border)
      if (charNumber) remove_all_objects_from_memory(charNumber)
      if (grid_squares) remove_all_objects_from_memory(grid_squares)

      if (scale_border) {
        scene.remove( scale_border )
        scale_border = null }

      //обработка введенной строки
      input_string = modification_to_normal(title_input.value)
      //дополнительная проверка на ошибки при вводе значений количетва символов
      let number_of_symbols_correct = +number_of_symbols.value || input_string.length

      //перезапуск
      init(select_mandala_type.value, input_string, number_of_symbols_correct )
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  

  //////////////////////////////////////////////////////////////
  /////// Блок адаптации букв в цифровой код //////////////////
  ////////////////////////////////////////////////////////////
  
  //если не задан, то присваивается значение длины введенной строки
  number_of_symbols_resize = +number_of_symbols_resize || input_string.length
  
  //символы расположены строго по таблице (удачно получилось то, что нужен всего один пробел)
  let simbols_static = "abcdefghijklmnopqrstuvwxyz абвгдеёжзийклмнопрстуфхцчшщъыьэюя"

  //переводит строку в массив чисел
  let input_string_array = input_string.to_array_of_numbers(simbols_static)
  
  //изменяет размер обрабатываемой числовой строки
  let string_for_algorithms = input_string_array
                              .to_number_of_symbols(number_of_symbols_resize)
                              .map(Number) //мапим, чтобы не изменять предыдущий массив

  //добавляется нулевой элемент суммы всех чисел по фибоначи
  let summ_to_zero_element = to_one_fibbonachi_digit( string_for_algorithms.reduce( (sum,n) => sum+n ))
  //в начало массива
  string_for_algorithms.unshift( summ_to_zero_element )

  
  //////////////////////////////////////////////////////////////////////////////
  ///// NUMERIC ADAPTATION ITEM BLOCK /////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  let header_title = document.querySelector('.title')
  //отображение чисто цифрового значения с суммой под title
  //сброс пред. значений
  numeric_adaptation.innerHTML = null
  //запуск функции
  numeric_adaptation_Node_elements(input_string_array, numeric_adaptation, number_of_symbols_resize)

    
  let numeric_adaptation_item_first = document.querySelector(".numeric_adaptation_item_first")
  //вывод подменюшки сокращения
  numeric_adaptation_item_first.onclick = function() {
    numeric_adaptation_item.forEach( function(entry) { entry.classList.toggle("active")})
    numeric_adaptation.classList.toggle("active")
    header_title.classList.toggle("new_bg")

  }
  
  //пересборка numeric_adaptation
  numeric_adaptation = document.querySelector("#numeric_adaptation")
  
  //сворачивание списка
  numeric_adaptation.onmouseleave = function() {
    numeric_adaptation_item.forEach( function(entry) { entry.classList.remove("active")})
    numeric_adaptation.classList.remove("active")
    header_title.classList.remove("new_bg")
  }
  
  //действия по перемене 
  let numeric_adaptation_item = document.querySelectorAll(".numeric_adaptation_item")

  numeric_adaptation_item.forEach( (item,i) => item.onclick = function() {
      numeric_adaptation.classList.remove("active")
      header_title.classList.remove("new_bg")
      number_of_symbols.value = string_for_algorithms.length-2-i
      reinit()
      }
    )

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
  let axis = axis_visual( plane_of_colors[0] )

  //пластины между осями
  let plain_x_cube = plain_x_cube_visual(plane_of_colors)

  //создаём сетку
  let grid_squares = grid([...axis, ...plain_x_cube])
  
  //массив для элементов обводки мандалы
  let border = border_visual(plane_of_colors[0])

  //массив для поворота и изменения размера обводки в мандале "ромб"
  let scale_border = selected_mandala.true_of(3) ? x_border_visual(border) : null
  
  charNumber_active([...axis,...plain_x_cube])
  
  ////анимация объектов////////////////////
  if (!+value_init) animate()

  
  //отслеживание нажатия кнопок боковой панели и передача содержимого этих кнопок
  for (let i = 0; i < palitra.length; i++) {
    palitra[i].onmousedown = (event) => selected_button(event.target.innerHTML) //передача в функцию визуального содержимого кнопки
  }

  //подсчёт статистики и его отображение
  statistic__value_counter([...axis,...plain_x_cube])

  //затемнение неактивных кнопок на основе статы
  palitra_button__unactive_visibler([...axis,...plain_x_cube], "unactive_visual_button")

  //запуск изменения формы кнопок при проверке девизуализации
  palitra_button__check_unactive("opacity_button")


  //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
  //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
  //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//

  //КОНЕЦ ОСНОВНОГО БЛОКА, ДАЛЬШЕ ТОЛЬКО ФУНКЦИИ//

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ///МАНИПУЛЯЦИИ С ПРИМЕНЕНИЕМ И ОСЛЕЖИВАНИЕМ СОБЫТИЙ НАЖАТИЯ НА ОБЪЕКТЫ И КНОПКИ НА БОКОВОЙ ПАНЕЛИ///
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  ////функция проверки нажатой кнопки боковых панелей
  function selected_button(selected_html_content) { //передаётся символ внутри кнопки

    //функция перебора массива с отслеживанием нажатых кнопок
    function toggle_visibler(arr) { //в ф-цию передаем массив
      arr.forEach(function(item) { //перебираем массив
          if (selected_html_content === "N") item.visible = false //все искомые элементы становятся невидимыми
          if (selected_html_content === "@" ||
             +selected_html_content === +item.colornum) item.visible = !item.visible //смена видимости на невидимость
          if (selected_html_content === "A") item.visible = true //все искомые элементы становятся видимыми
        })
    }


    //запуск девизуализации осей и плоскостей
    toggle_visibler([...axis,...plain_x_cube])
    //запуск изменения формы кнопок при нажатии девизуализации
    palitra_button__unactive_visibler([...axis,...plain_x_cube], "unactive_visual_button")

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
        palitra_button__unactive_visibler([...axis,...plain_x_cube], "unactive_visual_button")
        palitra_button__check_unactive("opacity_button")

      }
    }
    if (selected_html_content === "#")
      grid_squares.forEach( function(entry) { entry.visible = !entry.visible } )

    //смена цвета для бордера//
    if (selected_html_content === "B")
      border.forEach( 
        function(entry) { 
          entry.colornum = (+entry.colornum === 9) ? 0 : ++entry.colornum //перебор цвета в замкнутом цикле 9 и смена значения
          entry.material.color.set( basic_colors[entry.colornum] ) //присвоение значения цвета
        }
      )

    //отображение бордера//
    if (selected_html_content === "b") {
      border.forEach( function(entry) { entry.visible = !entry.visible } )
    }
    
    //отображение цифр//
    if (selected_html_content === "№") {

      charNumber.forEach( function(entry) { entry.visible = !entry.visible } )
      //убираем бордер для отображения цифр и возвращаем при неактиве
      if (selected_mandala == 3) {
        //в зависимости от отображаемых цифр
        let visible_onoff = !charNumber[0].visible
        border.forEach( function(entry) { entry.visible = visible_onoff } )
      }

    }

    //отдаление/приближение//
    if (selected_html_content === "+") camera.position.z = (camera.position.z > 10) ? camera.position.z - 10 : 10
    if (selected_html_content === "-") camera.position.z = camera.position.z + 10
    
  }


  //обнуление значений статы
  function statistic_item__zero() {
    for (let i = 1; i < statistic_item.length; i++) statistic_item[i].innerHTML = 0
  }
  
  //возвращение кнопок на дефолтное значение
  function palitra_button__default_pos_value() {
    for (let i = 1; i < 10; i++) palitra[i].innerHTML = i
  }
  
  //окрашиваем кнопки визуализации цветов
  function palitra_button__colored() {
    palitra.forEach( (palitra_item) => palitra_item.style.background = basic_colors[palitra_item.innerHTML] )
  }
  
  //затемнение неактивных кнопок на основе статы
  function palitra_button__check_unactive(unactive_class) {

    for (let i = 1; i < 10; i++) {

      palitra[i].classList.remove(unactive_class)

      if (statistic_item[i].innerHTML == 0) palitra[i].classList.toggle(unactive_class)
    }

  }

  //запуск изменения формы кнопок при проверке девизуализации
  function palitra_button__unactive_visibler(arr, unactive_visual_class) {
   
    for (let i=1; i < 10; i++) {

      palitra[i].classList.remove(unactive_visual_class)
   
      let visible_of = (element) => element.colornum == palitra[i].innerHTML && element.visible == false

      if (arr.some(visible_of)) palitra[i].classList.add(unactive_visual_class)
    }

  }


  ///подсчёт статистики
  function statistic__value_counter(objects_to_count) {

    for (let i = 0; i < objects_to_count.length; i++)
      if (objects_to_count[i].colornum !== 0) //ноль не считаем
        statistic_item[objects_to_count[i].colornum].innerHTML =
          ++statistic_item[objects_to_count[i].colornum].innerHTML

  }//манипуляция с DOM объектами statistic_item


  //запуск сортировки по возрастанию/убыванию со сменой значения кнопок цвета
  function statistic_sort_button__sort() {
      
    let buffer_sort_arr = []
    
    for (let i = 1; i < 10; i++) {
      
      let buffer_sort_item = {
        value : statistic_item[i].innerHTML,
        position : palitra[i].innerHTML
      }

      buffer_sort_arr.push(buffer_sort_item)
    }

    //сама сортировка
    buffer_sort_arr.sort(function(a, b) { return a.value - b.value })
    //зеркальная пересборка массива сотрировки
    if (statistic_sort_button.className == "up") buffer_sort_arr.reverse()

    for (let i = 1; i < 10; i++) {
    
      statistic_item[i].innerHTML = buffer_sort_arr[i-1].value
      palitra[i].innerHTML = buffer_sort_arr[i-1].position
    }

  }
    

////////////////////////////////////////////////////////////////////////////////////
///ФУНКЦИИ ПРЕОБРАЗДВАНИЯ DOM дерева//////////
//////////////////////////////////////////////////////////////////////////////////
  function numeric_adaptation_Node_elements(input_string_array_fn, to_Node, now_resize_is) {
    let element = [],
        string_fn,
        summ_fn,
        class_Name = 'numeric_adaptation_item'

    for (let i = 0; i < now_resize_is; i++) {
      
      string_fn = input_string_array_fn.to_number_of_symbols(now_resize_is-i)
      
      summ_fn = to_one_fibbonachi_digit( string_fn.reduce( (sum,n) => sum+n ))
       
      element[i] = document.createElement('div')
      
      element[i].classList.add(class_Name+(i==0 ? '_first' : ''))
      
      element[i].innerHTML = `(${string_fn.length}) ${string_fn.join('')}  =  ${summ_fn}`

      to_Node.appendChild(element[i])
    }
  }

}; //init() end bracket



// export {axis, plain_x_cube}