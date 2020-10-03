import * as THREE from '../three.min.js'
import {scene} from './three_manipulations.js'
import {basic_colors} from '../modules/color_change.js'


///////////////////////////////////////////////////////////////////////////////
/////// ФУНКЦИИ ВИЗУАЛЬНОЙ СБОРКИ и ГРУППИРОВКИ ОБЪЕКТОВ В МАССИВ ////////////
/////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////
  // //база цветов//
  

  //геометрия кубов//
  let cubeGeom = new THREE.CubeGeometry(1,1,0.01)
  //геометрия точек//
  let sphereGeom = new THREE.SphereGeometry(0.15,32,32)
  

  //материал кубов создаётся из массива цветов от нуля до девяти соответственно
  let color_material = basic_colors.map( color_n => new THREE.MeshBasicMaterial({ color: color_n }) )
  
  function color_material_set() {
    basic_colors.forEach(function (color,n) {color_material[n].color.set(color)})
  }
  //еще один материал для бордера и дальнейших манипуляций с ним
  let color_material_for_border = new THREE.MeshBasicMaterial({ color: 0x000000 })
  //материал для линий сетки
  let lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } )


// /////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////



//////////функция конструктора объектов КУБА////////////////////////////////////////////
function cubus_construct(x, y, z, colornum=-1, setGeom = cubeGeom) {//передаются координаты и номер цвета

    //в конструкторе для бордюра задаются отрицательные значения цвета
    let color_material_choice = (colornum < 0) ? color_material_for_border
                                               : color_material[colornum]

    let cubus = new THREE.Mesh( setGeom , //геометрия куба задана один раз
                                color_material_choice
                              )
    cubus.position.set(x,y,z) // устанавливается позиция объекта
    if (colornum >= 0) cubus.colornum = Math.abs(colornum) //идентификатор для отбора объектов по значению цвета
    scene.add(cubus) //визуализация полученного объекта

    return cubus
  }//возвращает новый объект куб, обработанный по заданным координатам и цвету




/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
  

//////////сборка осей //////////
function axis_visual(input_nums_fn) {//принимает одномерный числовой массив
  
  let axis_fn = []

  //нулевой куб в центре оси
  axis_fn[0] = cubus_construct( 0,0,0, input_nums_fn[0] )

  let color_n
  for (let i = 1; i < input_nums_fn.length; i++) {
    //присваиваем значение цвета из принятого массива
    color_n = input_nums_fn[i]

    //направо
    axis_fn.push( cubus_construct( i,0,0, color_n) )
    //вверх
    axis_fn.push( cubus_construct( 0,i,0, color_n) )
    //налево
    axis_fn.push( cubus_construct( -i,0,0, color_n) )
    //вниз
    axis_fn.push( cubus_construct( 0,-i,0, color_n) )

  }

  return axis_fn
}//возвращает одномерный массив объектов



////////пластина/плоскость кубов/////////////
function plain_x_cube_visual(plane_of_colors_fn) {//принимает одномерный числовой массив

  let plain_x_cube_fn = []
  //отрисовка панелей
  let color_n
  for (let y = 1; y < plane_of_colors_fn[0].length; y++)
    for (let x = 1; x < plane_of_colors_fn[0].length; x++) {

      //назначение цвета в соответствии с цветоцифрами, вычисленными по примененному алгоритму
      color_n = plane_of_colors_fn[y][x] 

      //верх-право
      plain_x_cube_fn.push( cubus_construct ( y, x, 0, color_n) )
      //низ-лево
      plain_x_cube_fn.push( cubus_construct ( -y, -x, 0, color_n) )
      //верх-лево
      plain_x_cube_fn.push( cubus_construct ( -x, y, 0, color_n) )
      //низ-право
      plain_x_cube_fn.push( cubus_construct ( x, -y, 0, color_n) )
    }

  return plain_x_cube_fn
}//возвращает одномерный массив объектов



///////рабочий вариант обводки мандалы////////////////////////
function border_visual(input_nums_fn) {//принимает одномерный числовой массив
  //перменные для обводки мандалы
  let border_coordin = input_nums_fn.length
  let border_fn = [] //массив для элементов обводки мандалы

    for (let i = -border_coordin; i < border_coordin; i++) {
        border_fn.push(
          cubus_construct( -border_coordin, i, 0 ), //левая
          cubus_construct( i, border_coordin, 0 ), //верхняя
          cubus_construct( border_coordin, -i, 0 ), //правая
          cubus_construct( -i, -border_coordin, 0 ) //нижняя
        )

    }

  return border_fn
}//возвращает одномерный массив объектов



//поворот и уменьшение стандартной обводки для мандалы "ромб"
function x_border_visual(border_in_fn) {
  
  //создание группы
  let x_border = new THREE.Group()
  
  //уменьшение повернутой обводки (0.75 идеальное значение для 8 символов, от него и "скакал")
  let degree_from_diagonal = (number_of_symbols_fn) => {
    //размер стороны куба
    let side = number_of_symbols_fn
    //размер диагонали
    let diagonal = Math.sqrt(side*side*2)
    //коэффициент разницы между реальной и нужной диагональю
    let coefficient = (side+1)/diagonal
    
    return coefficient
  }

  let to_size = border_in_fn.length/4 - 1
  let scale_p = degree_from_diagonal( to_size )

  //сама группирока объекта из элементов бордюра
  border_in_fn.forEach(function(item) {x_border.add(item)} )
  
  scene.add(x_border)
  //поворот на 45градусов
  x_border.rotation.z = THREE.Math.degToRad( 45 )
  //приближаем объект для визуального перекрытия "зубцов"
  x_border.position.set(0,0,0.005)
  //изменение размера
  x_border.scale.set(scale_p,scale_p,scale_p)

  return x_border
}

////////////////////////////////////////////////////////////////////////////////////
////// РАБОТА С ЛИНИЯМИ  //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
  
//функция сетки
function grid(object) {

  // let lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } )
  let grid = []
  let geometry_for_line = []
  let area_position = []
  let z_position = 0.0065
  let area_around = 0.5
  let x = 0, y = 0, color_n = 0

  for (let i = 0, k = 0; i < object.length; i++) {
      x = object[i].position.x
      y = object[i].position.y
      color_n = object[i].colornum

      area_position[0] = [ x - area_around, y - area_around, z_position ]
      area_position[1] = [ x + area_around, y - area_around, z_position ]
      area_position[2] = [ x + area_around, y + area_around, z_position ]
      area_position[3] = [ x - area_around, y + area_around, z_position ]
      area_position[4] = area_position [0]

    //не считаем нули вне осей
    if ( color_n !== 0 || (color_n === 0 && (x === 0 || y === 0)) ){

      geometry_for_line[k] = new THREE.Geometry()
      
      for (let j = 0; j < area_position.length; j++)
        geometry_for_line[k].vertices.push( new THREE.Vector3( ...area_position[j] ) )

      grid[k] = new THREE.Line(geometry_for_line[k], lineMaterial )
      
      scene.add(grid[k])
      k++
    }
  }

  return grid
} //возвращает массив объектов линий

////////////////////////////////////////////////////////////////////////////////////
////// РАБОТА С ЦИФРАМИ  //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
  let fontJ = '{"glyphs":{"0":{"x_min":73,"x_max":715,"ha":792,"o":"m 394 -29 q 153 129 242 -29 q 73 479 73 272 q 152 829 73 687 q 394 989 241 989 q 634 829 545 989 q 715 479 715 684 q 635 129 715 270 q 394 -29 546 -29 m 394 89 q 546 211 489 89 q 598 479 598 322 q 548 748 598 640 q 394 871 491 871 q 241 748 298 871 q 190 479 190 637 q 239 211 190 319 q 394 89 296 89 "},"1":{"x_min":215.671875,"x_max":574,"ha":792,"o":"m 574 0 l 442 0 l 442 697 l 215 697 l 215 796 q 386 833 330 796 q 475 986 447 875 l 574 986 l 574 0 "},"2":{"x_min":59,"x_max":731,"ha":792,"o":"m 731 0 l 59 0 q 197 314 59 188 q 457 487 199 315 q 598 691 598 580 q 543 819 598 772 q 411 867 488 867 q 272 811 328 867 q 209 630 209 747 l 81 630 q 182 901 81 805 q 408 986 271 986 q 629 909 536 986 q 731 694 731 826 q 613 449 731 541 q 378 316 495 383 q 201 122 235 234 l 731 122 l 731 0 "},"3":{"x_min":54,"x_max":737,"ha":792,"o":"m 737 284 q 635 55 737 141 q 399 -25 541 -25 q 156 52 248 -25 q 54 308 54 140 l 185 308 q 245 147 185 202 q 395 96 302 96 q 539 140 484 96 q 602 280 602 190 q 510 429 602 390 q 324 454 451 454 l 324 565 q 487 584 441 565 q 565 719 565 617 q 515 835 565 791 q 395 879 466 879 q 255 824 307 879 q 203 661 203 769 l 78 661 q 166 909 78 822 q 387 992 250 992 q 603 921 513 992 q 701 723 701 844 q 669 607 701 656 q 578 524 637 558 q 696 434 655 499 q 737 284 737 369 "},"4":{"x_min":48,"x_max":742.453125,"ha":792,"o":"m 742 243 l 602 243 l 602 0 l 476 0 l 476 243 l 48 243 l 48 368 l 476 958 l 602 958 l 602 354 l 742 354 l 742 243 m 476 354 l 476 792 l 162 354 l 476 354 "},"5":{"x_min":54.171875,"x_max":738,"ha":792,"o":"m 738 314 q 626 60 738 153 q 382 -23 526 -23 q 155 47 248 -23 q 54 256 54 125 l 183 256 q 259 132 204 174 q 382 91 314 91 q 533 149 471 91 q 602 314 602 213 q 538 469 602 411 q 386 528 475 528 q 284 506 332 528 q 197 439 237 484 l 81 439 l 159 958 l 684 958 l 684 840 l 254 840 l 214 579 q 306 627 258 612 q 407 643 354 643 q 636 552 540 643 q 738 314 738 457 "},"6":{"x_min":53,"x_max":739,"ha":792,"o":"m 739 312 q 633 62 739 162 q 400 -31 534 -31 q 162 78 257 -31 q 53 439 53 206 q 178 859 53 712 q 441 986 284 986 q 643 912 559 986 q 732 713 732 833 l 601 713 q 544 830 594 786 q 426 875 494 875 q 268 793 331 875 q 193 517 193 697 q 301 597 240 570 q 427 624 362 624 q 643 540 552 624 q 739 312 739 451 m 603 298 q 540 461 603 400 q 404 516 484 516 q 268 461 323 516 q 207 300 207 401 q 269 137 207 198 q 405 83 325 83 q 541 137 486 83 q 603 298 603 197 "},"7":{"x_min":58.71875,"x_max":730.953125,"ha":792,"o":"m 730 839 q 469 448 560 641 q 335 0 378 255 l 192 0 q 328 441 235 252 q 593 830 421 630 l 58 830 l 58 958 l 730 958 l 730 839 "},"8":{"x_min":55,"x_max":736,"ha":792,"o":"m 571 527 q 694 424 652 491 q 736 280 736 358 q 648 71 736 158 q 395 -26 551 -26 q 142 69 238 -26 q 55 279 55 157 q 96 425 55 359 q 220 527 138 491 q 120 615 153 562 q 88 726 88 668 q 171 904 88 827 q 395 986 261 986 q 618 905 529 986 q 702 727 702 830 q 670 616 702 667 q 571 527 638 565 m 394 565 q 519 610 475 565 q 563 717 563 655 q 521 823 563 781 q 392 872 474 872 q 265 824 312 872 q 224 720 224 783 q 265 613 224 656 q 394 565 312 565 m 395 91 q 545 150 488 91 q 597 280 597 204 q 546 408 597 355 q 395 465 492 465 q 244 408 299 465 q 194 280 194 356 q 244 150 194 203 q 395 91 299 91 "},"9":{"x_min":53,"x_max":739,"ha":792,"o":"m 739 524 q 619 94 739 241 q 362 -32 516 -32 q 150 47 242 -32 q 59 244 59 126 l 191 244 q 246 129 191 176 q 373 82 301 82 q 526 161 466 82 q 597 440 597 255 q 363 334 501 334 q 130 432 216 334 q 53 650 53 521 q 134 880 53 786 q 383 986 226 986 q 659 841 566 986 q 739 524 739 719 m 388 449 q 535 514 480 449 q 585 658 585 573 q 535 805 585 744 q 388 873 480 873 q 242 809 294 873 q 191 658 191 745 q 239 514 191 572 q 388 449 292 449 "},"+":{"x_min":23,"x_max":768,"ha":792,"o":"m 768 372 l 444 372 l 444 0 l 347 0 l 347 372 l 23 372 l 23 468 l 347 468 l 347 840 l 444 840 l 444 468 l 768 468 l 768 372 "},"-":{"x_min":8.71875,"x_max":350.390625,"ha":478,"o":"m 350 317 l 8 317 l 8 428 l 350 428 l 350 317 "},"*":{"x_min":116,"x_max":674,"ha":792,"o":"m 674 768 l 475 713 l 610 544 l 517 477 l 394 652 l 272 478 l 178 544 l 314 713 l 116 766 l 153 876 l 341 812 l 342 1013 l 446 1013 l 446 811 l 635 874 l 674 768 "},"/":{"x_min":183.25,"x_max":608.328125,"ha":792,"o":"m 608 1041 l 266 -129 l 183 -129 l 520 1041 l 608 1041 "},"=":{"x_min":8.71875,"x_max":780.953125,"ha":792,"o":"m 780 510 l 8 510 l 8 606 l 780 606 l 780 510 m 780 235 l 8 235 l 8 332 l 780 332 l 780 235 "}},"cssFontWeight":"normal","ascender":1189,"underlinePosition":-100,"cssFontStyle":"normal","boundingBox":{"yMin":-334,"xMin":-111,"yMax":1189,"xMax":1672},"resolution":1000,"original_font_information":{"postscript_name":"Helvetiker-Regular","version_string":"Version 1.00 2004 initial release","vendor_url":"http://www.magenta.gr/","full_font_name":"Helvetiker","font_family_name":"Helvetiker","copyright":"Copyright (c) Μagenta ltd, 2004","description":"","trademark":"","designer":"","designer_url":"","unique_font_identifier":"Μagenta ltd:Helvetiker:22-10-104","license_url":"http://www.ellak.gr/fonts/MgOpen/license.html","license_description":"Copyright (c) 2004 by MAGENTA Ltd. All Rights Reserved","manufacturer_name":"Μagenta ltd","font_sub_family_name":"Regular"},"descender":-334,"familyName":"Helvetiker","lineHeight":1522,"underlineThickness":50}'
  let fontS = JSON.parse(fontJ)
  let loader_font = new THREE.FontLoader()
  let font = loader_font.parse(fontS)

  // let charNumber = []
  //единый материал для всех символов(пока)
  let fontMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
  
  // function fontMaterial_color_change(bool) {

  //   let color_in_fn = !bool ? 0x000000 : 0xffffff
  //   fontMaterial.color.set(color_in_fn)
  // }

  //создаём массив геометрий для цифр от 0 до 9
  let fontGeometry = []

  function charNumber_active(objectos) {

    let CharsN = []

    for (let i=0; i < 10; i++) {

      let char = i.toString()

      fontGeometry[i] = new THREE.TextGeometry( char, {
                          font: font,
                          size: 0.6,
                          height: 0.03,
                          curveSegments: 15,
                          } )
    }
    
    for (let i=0, j=0; i < objectos.length; i++) {

        let x = objectos[i].position.x
        let y = objectos[i].position.y
        let color_n = objectos[i].colornum

        //не считаем нули вне осей
        if ( color_n !== 0 || (color_n === 0 && (x === 0 || y === 0)) ) {

          CharsN[j] = new THREE.Mesh( fontGeometry[color_n], fontMaterial )
          CharsN[j].position.set( x-0.25, y-0.3, 0.06 )
          scene.add( CharsN[j] )
          j++

        }

      }
        
    return CharsN
  }

////////////////////////////////////////////////////////////////////////////////////
////// РАБОТА С ТОЧКАМИ  //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function dots_visibler(objectos) {
  let x = 0, y = 0, color_n = 0
  let dots_fn = []
  
  for (let i = 0, k = 0; i < objectos.length; i++) {
    x = objectos[i].position.x
    y = objectos[i].position.y
    color_n = objectos[i].colornum

    dots_fn.push( cubus_construct( x, y, 0, color_n, sphereGeom) )
  }
    
  return dots_fn
}

export { dots_visibler,
        color_material_for_border, color_material_set,
        charNumber_active, //charNumber,
        axis_visual, plain_x_cube_visual,
        border_visual, x_border_visual, grid }