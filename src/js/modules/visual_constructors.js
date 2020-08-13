import * as THREE from '../three.min.js'
import {scene} from './three_manipulations.js'
import {to_one_fibbonachi_digit} from './support.js'
// import {axis, plain_x_cube} from '../my.js'
///////////////////////////////////////////////////////////////////////////////
/////// ФУНКЦИИ ВИЗУАЛЬНОЙ СБОРКИ и ГРУППИРОВКИ ОБЪЕКТОВ В МАССИВ ////////////
/////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////
  //база цветов//
  let basic_colors = ["#FFFFFF", "#E4388C", "#E4221B", "#FF7F00", "#FFED00", "#008739", "#02A7AA", "#47B3E7", "#2A4B9B", "#702283"]

  //базовый сборщик геометрии кубов//
  let cubeGeom = new THREE.CubeGeometry(1,1,0.01)

  //материал кубов создаётся из массива цветов от нуля до девяти соответственно
  let color_material = basic_colors.map( color_n => new THREE.MeshBasicMaterial({ color: color_n }) )
  //еще один материал для бордера и дальнейших манипуляций с ним
  let color_material_for_border = new THREE.MeshBasicMaterial({ color: basic_colors[9] })
  //материал для линий сетки
  let lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } )


// /////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////



//////////функция конструктора объектов КУБА////////////////////////////////////////////
function cubus_construct(x, y, z, colornum) {//передаются координаты и номер цвета

    let color_material_choice = (colornum < 0) ? color_material_for_border //в конструкторе для бордюра задаются отрицательные значения цвета
                                               : color_material[colornum]

    let cubus = new THREE.Mesh( cubeGeom, //геометрия куба задана один раз
                                color_material_choice
                              )
    cubus.position.set(x,y,z) // устанавливается позиция объекта
    cubus.colornum = Math.abs(colornum) //идентификатор для отбора объектов по значению цвета
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
  let color_n = to_one_fibbonachi_digit( input_nums_fn.slice(1).reduce( (sum,n) => sum+n ))
  let border_fn = [] //массив для элементов обводки мандалы

  color_material_for_border.color.set(basic_colors[color_n]) //присваивается цвет нулевой клетки

    for (let i = -border_coordin; i < border_coordin; i++) {
        border_fn.push(
          cubus_construct( -border_coordin, i, 0, -color_n ), //левая
          cubus_construct( i, border_coordin, 0, -color_n ), //верхняя
          cubus_construct( border_coordin, -i, 0, -color_n ), //правая
          cubus_construct( -i, -border_coordin, 0, -color_n ) //нижняя
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

  //перекрас в белый цвет
  border_in_fn.forEach( function(entry) { entry.material.color.set(basic_colors[0]) } )

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
  let x=0, y=0, color_n=0

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
      
      // grid[k].visible = false
      
      scene.add(grid[k])
      k++
    }
  }

  return grid
} //возвращает массив объектов линий


///////////////////////////////////////////////////////////////////////////////////////////
  // charNumber = charNumber_active([...axis,...plain_x_cube])
  let charNumber = []
  //единый материал для всех символоа(пока)
  let fontMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
  
  //создаём массив геометрий для цифр от 0 до 9
  let fontGeometry = []

  function charNumber_active(props) {
    let loader_font = new THREE.FontLoader()
    loader_font.load( require('@fonts/helvetiker_regular.typeface.onlynumbers.json.eot'),
      function ( font ) {
        charNumber = font_visibler( font, props )
      }
    )
    return charNumber
  }
    console.log (charNumber)
  
  function font_visibler(font, objectos) {

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
          CharsN[j].visible = false
          j++

        }

      }
        
    return CharsN
  }



export { basic_colors, charNumber_active, charNumber,
        axis_visual, plain_x_cube_visual,
        border_visual, x_border_visual, grid }