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
     
    element[i] = document.createElement('div')
    //значение класса для первого элемента
    element[i].classList.add(class_Name+(i==0 ? '_first' : ''))
    //содержимое пункта
    element[i].innerHTML = `(${string_fn.length}) ${string_fn.join('')}  =  ${summ_fn}`

    to_Node.appendChild(element[i])
  }
  
  /////////////////////////////////////////////////////////////////
  
  let numeric_adaptation_item_first = document.querySelector(".numeric_adaptation_item_first")
  //вывод подменюшки сокращения
    numeric_adaptation_item_first.onclick = function() {
      numeric_adaptation_item.forEach( function(entry) {
        entry.classList.toggle("active")})
        to_Node.classList.toggle("active")
        header_title.classList.toggle("new_bg")
    }

    
  let numeric_adaptation_item = document.querySelectorAll(".numeric_adaptation_item")
  //выбор меню из списка сокращений
    numeric_adaptation_item.forEach( (item,i) => item.onclick = function() {
      to_Node.classList.remove("active")
      header_title.classList.remove("new_bg")
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