import {axis, plain_x_cube, grid_squares, border, scale_border, charNumber, dots} from '../my.js'
import {camera} from './three_manipulations.js'
import {unactive_visual_button, opacity_button} from '../default_values.js'
import {history_counter, history} from './history.js'
import {basic_colors, color_change_to_second, color_change_to_gray, gray_second} from './color_change.js'
import {palitra, palitra_button__unactive_visibler, palitra_button__colored,
        palitra_button__default_pos_value, statistic_item__zero, statistic__value_counter,
        palitra_button__check_unactive} from '../nodmodules/palitra_sort_buttons.js'
import {all_visibler_colors, toggle_visibler} from './support.js'
import {color_material_for_border, color_material_set} from './visual_constructors.js'
import {help_panel_vis} from '../nodmodules/help_description.js'

////////////////////////////////////////////////////////////////////////////////////////////////////
///МАНИПУЛЯЦИИ С ПРИМЕНЕНИЕМ И ОСЛЕЖИВАНИЕМ СОБЫТИЙ НАЖАТИЯ НА ОБЪЕКТЫ И КНОПКИ НА БОКОВОЙ ПАНЕЛИ///
////////////////////////////////////////////////////////////////////////////////////////////////////

//отслеживание нажатия кнопок боковой панели и передача содержимого этих кнопок
for (let i = 0; i < palitra.length; i++) {
  palitra[i].onmousedown = (event) => selected_button(event.target) //передача в функцию визуального содержимого кнопки
}

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
    //отдельно, изменение цвета для бордюра
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
      all_visibler_colors(dots, history[history_counter].visible_colors)

    }
    else {
      //включаем всё, в зависимости от состояния
      toggle_visibler( border, history[history_counter].border_mode )
      toggle_visibler( grid_squares, history[history_counter].grid_mode )
      toggle_visibler( charNumber, history[history_counter].number_mode )
      
      //отображение по цветам
      all_visibler_colors([...axis, ...plain_x_cube], history[history_counter].visible_colors)

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

  //расширение на весь экран (пока пустое)
  if (selected_html_content == "\u25A3") {
    console.log('\u25A3')
  }

  //активация панели помощи справа или слева
  if (selected_html_content === "?") {
      //берем данные из тега значение position (left/right) у кнопки
      let position = selected_target.getAttribute('position')
      console.log(selected_target.position)
      //активируем нужную панель помощи
      help_panel_vis(position)
  }
  
  //пересборка отображения кнопок левой панели
  check_left_panel()

}

//функция изменения вида кнопок по состоянию выбранных модов
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

export {selected_button, check_left_panel}