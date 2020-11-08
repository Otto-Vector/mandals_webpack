import {history, history_counter} from './history.js'
import {camera} from './three_manipulations.js'


function autofocus() {
  
  let modificatorV = history[history_counter].selected_mandala.true_of(2,3,4,5) ? 1 : 2

  //размер объекта
  let lengthForView = history[history_counter].length_of_title*(2*modificatorV)+(3+modificatorV)
  
  //высота верхнего блока
  let title_height = document.querySelector('header.title').offsetHeight


  //для размера поля откуда брать ширину и высоту
  let canvas = document.querySelector('canvas')
  
  //путём брейншторма родилась эта формула
  let pass_pad = (size_of_object, pad_percent) => 
    ((size_of_object*pad_percent)/(1-pad_percent))*4

  let pad_perc = title_height / canvas.offsetHeight
  //изменненный размер видимого объекта для дальнейшей фокусировки
  lengthForView += pass_pad( lengthForView, pad_perc )
  // lengthForView += lengthForView*(pad_perc*2)

  //вычисление градуса положения камеры
  let vFov = camera.fov * Math.PI / 180

  //соотношение для широкого экрана и для узкого телефонного
  let vh_mode = canvas.width < canvas.height ? canvas.offsetHeight / canvas.offsetWidth : 1
  //расчёт дистанции видимости
  let vDist = lengthForView / 2 /  Math.tan( vFov / 2 ) * vh_mode
  // camera.fov = 2 * Math.atan( ( lengthForView / vh_mode ) / ( 2 * vDist ) ) * ( 180 / Math.PI )

  history[history_counter].camera_range = vDist

  camera.position.set( 0, 0, history[history_counter].camera_range)  
}

export {autofocus}