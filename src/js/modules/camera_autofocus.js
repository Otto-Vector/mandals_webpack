import {history, history_counter} from './history.js'
import {camera} from './three_manipulations.js'


function autofocus() {
  
  let modificatorV = history[history_counter].selected_mandala.true_of(2,3,4,5) ? 2 : 4

  //размер объекта
  let lengthForView = history[history_counter].length_of_title*modificatorV+3
  
  //высота верхнего блока
  let title_height = document.querySelector('header.title').offsetHeight
  //без дополнительго отступа всё равно криво работает. это оптимальный
  let after_title_pad = 80
  title_height += after_title_pad

  //для размера поля откуда брать ширину и высоту
  let canvas = document.querySelector('canvas')
  
  //путём брейншторма родилась эта формула
  let pass_pad = (size_of_object, pad_percent) => 
    ((size_of_object*pad_percent)/(1-pad_percent))*2+1

  let pad_perc = title_height / canvas.height
  //изменненный размер видимого объекта для дальнейшей фокусировки
  lengthForView += pass_pad( lengthForView, pad_perc )

  //вычисление градуса положения камеры
  let vFov = camera.fov * Math.PI / 180

  //соотношение для широкого экрана и для узкого телефонного
  let vh_mode = canvas.width < canvas.height ? canvas.height / canvas.width : 1
  //расчёт дистанции видимости
  let vDist = lengthForView / 2 /  Math.tan( vFov / 2 ) * vh_mode
  // camera.fov = 2 * Math.atan( ( lengthForView / vh_mode ) / ( 2 * vDist ) ) * ( 180 / Math.PI )

  history[history_counter].camera_range = vDist

  camera.position.set( 0, 0, history[history_counter].camera_range)  
}

export {autofocus}