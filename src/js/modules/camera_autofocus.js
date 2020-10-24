import {history, history_counter} from './history.js'
import {camera} from './three_manipulations.js'


function autofocus() {
  let modificatorV = history[history_counter].selected_mandala.true_of(2,3,4,5) ? 2 : 4
  // let paddingV = 4 * modificatorV

  //размер объекта
  let lengthForView = history[history_counter].length_of_title*modificatorV+3

  //высота верхнего блока
  let before_title_pad = 80
  let title_size = document.querySelector('header.title').offsetHeight + before_title_pad
  let canvas = document.querySelector('canvas')

  function effective_title(lengthForView_fn, plus = 1 ) {

    let size_of_one_square = canvas.height / (lengthForView_fn + plus)
    
    return (plus * size_of_one_square > title_size) ?
      plus*2+1 : effective_title( lengthForView_fn, ++plus )
  }

  lengthForView += effective_title(lengthForView)

  //вычисление градуса положения камеры
  let vFov = camera.fov * Math.PI / 180
  let vh_mode = canvas.width < canvas.height ? canvas.height / canvas.width : 1
  //расчёт дистанции видимости
  let vDist = (lengthForView / 2 /  Math.tan( vFov / 2 ) * vh_mode )

  history[history_counter].camera_range = vDist


  
  camera.position.set( 0, 0, history[history_counter].camera_range)  
}

export {autofocus}