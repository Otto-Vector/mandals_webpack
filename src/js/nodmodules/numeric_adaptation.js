import '../modules/prototypes.js' //прототипизированные функции
import {to_one_fibbonachi_digit} from '../modules/support.js'
import {reinit} from '../modules/reinit.js'

//////////////////////////////////////////////////////////////////////////////
///// NUMERIC ADAPTATION ITEM BLOCK /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

//выделяем блок title для манипуляций с background через класс
let header_title = document.querySelector('.title')
  
////////////////////////////////////////////////////////////////////////////////////
///ФУНКЦИИ ПРЕОБРАЗДВАНИЯ DOM дерева//////////
//////////////////////////////////////////////////////////////////////////////////
function numeric_adaptation_Node_elements(input_string_array_fn, to_Node, now_resize_is) {
  let element = [],
      string_fn,
      summ_fn,
      class_Name = 'numeric_adaptation_item'

  for (let i = 0; i < now_resize_is; i++) {
    //пересборка каждой строки по убыванию
    string_fn = input_string_array_fn.to_number_of_symbols(now_resize_is-i)
    //пересчёт каждой суммы
    summ_fn = to_one_fibbonachi_digit( string_fn.reduce( (sum,n) => sum+n ))
    //создание элемента 
    element[i] = document.createElement('div')
    //значение класса для первого элемента
    element[i].classList.add(class_Name+(i==0 ? '_first' : ''))
    //содержимое пункта
    element[i].innerHTML = `(${string_fn.length}) ${string_fn.join('')}  =  ${summ_fn}`
    //добавление элемента
    to_Node.appendChild(element[i])
  }
  
  /////////////////////////////////////////////////////////////////
  
  let numeric_adaptation_item_first = document.querySelector(".numeric_adaptation_item_first")

  //вывод подменюшки сокращения по нажатию на первый элемент
    numeric_adaptation_item_first.onclick = function() {
      //активация каждого элемента в списке
      numeric_adaptation_item.forEach( function(entry) {
        entry.classList.toggle("active")
      })
      //активация самого поля отображения менюшки
      to_Node.classList.toggle("active")
      //перерисовка бэкграунда
      header_title.classList.toggle("new_bg")
    }

    
  let numeric_adaptation_item = document.querySelectorAll(".numeric_adaptation_item")

  //выбор меню из списка сокращений
    numeric_adaptation_item.forEach( (item,i) => item.onclick = function() {
      
      //деактивация поля, после выбора элемента
      to_Node.classList.remove("active")
      header_title.classList.remove("new_bg")

      //передача значения изменения размера в поле, которое затем принимается функцией reinit
      number_of_symbols.value = now_resize_is-1-i
      reinit()
    })

  //сворачивание списка
    to_Node.onmouseleave = function() {
      numeric_adaptation_item.forEach( function(entry) { entry.classList.remove("active")})
      to_Node.classList.remove("active")
      header_title.classList.remove("new_bg")
    }
}

export {numeric_adaptation_Node_elements}