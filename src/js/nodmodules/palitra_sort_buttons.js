import {basic_colors} from '../modules/color_change.js'
import {history, history_counter} from '../modules/history.js'
import {axis, plain_x_cube, dots} from '../my.js'

  ///statistic_item
  //объекты пунктов статы
  let statistic_item = document.querySelectorAll("#statistic div")
  
  ///statistic_button
  //кнопка вывода статы
  let statistic_sort_button = document.querySelector("#statistic_sort_button")

  ///palitra
  //задаём массив кнопок
  let palitra = document.querySelectorAll(".palitra_button")
  

  //нажатие кнопки сортировки статы
  statistic_sort_button.onclick = function() {
    //смена класса для визуализации параметров статы
    statistic_sort_button.classList.toggle("up")
    //сортировка
    statistic_sort_button__sort()
    //перекрашивание кнопок по изменившемуся значению
    palitra_button__colored()
    //проверка на нулевые значения статы
    palitra_button__check_unactive("opacity_button")
    //переотметка неактивных визуально кубов
    palitra_button__unactive_visibler((!history[history_counter].dots_mode)?[...axis,...plain_x_cube]:dots, "unactive_visual_button")
  }

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

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
    for (let i = 1; i < 10; i++)
      palitra[i].style.background = basic_colors[palitra[i].innerHTML]
  }
  
  //затемнение неактивных кнопок на основе статы
  function palitra_button__check_unactive(unactive_class) {

    for (let i = 1; i < 10; i++) {
      palitra[i].classList.toggle(unactive_class, statistic_item[i].innerHTML == 0)
    }

  }

  //запуск изменения формы кнопок при проверке девизуализации
  function palitra_button__unactive_visibler(arr, unactive_visual_class) {

    for (let i = 1; i < 10; i++) {
      //условие
      let visible_of = element => element.colornum == palitra[i].innerHTML && element.visible == false

      palitra[i].classList.toggle(unactive_visual_class, arr.some(visible_of))
    }

  }


  ///подсчёт статистики
  function statistic__value_counter(objects_to_count) {

    for (let i = 0; i < objects_to_count.length; i++)
      if (objects_to_count[i].colornum !== 0) //ноль не считаем
          ++statistic_item[objects_to_count[i].colornum].innerHTML

  }//манипуляция с DOM объектами statistic_item


  //запуск сортировки по возрастанию/убыванию со сменой значения кнопок цвета
  function statistic_sort_button__sort() {
      
    let buffer_sort_arr = []
    
    //запоминание позиций статы и значения
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
    if (statistic_sort_button.classList.contains("up")) buffer_sort_arr.reverse()

    //перерисовка цифр и количества в панели
    for (let i = 1; i < 10; i++) {
      statistic_item[i].innerHTML = buffer_sort_arr[i-1].value
      palitra[i].innerHTML = buffer_sort_arr[i-1].position
    }

  }

export {palitra,
        palitra_button__default_pos_value,
        palitra_button__colored,
        palitra_button__check_unactive,
        palitra_button__unactive_visibler,
        statistic__value_counter,
        statistic_item,
        statistic_item__zero,
        statistic_sort_button,
        statistic_sort_button__sort}