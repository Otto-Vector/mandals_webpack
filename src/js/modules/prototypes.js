import {to_one_fibbonachi_digit} from './support.js'


/////////////////////////////////////////////////////////
////////////// прототипируемые функции /////////////////
///////////////////////////////////////////////////////
  
////функция для проверки различных значений selected_mandala (прототипирована в Number)
Number.prototype.true_of = function(...props) {//передаётся множество цифровых значений // обычно (1,2,3)
    return props.indexOf(this) != -1 //проверяет, есть ли переменная, к которой применяется функция, в указанном множестве цифровых значений
  }//возвращает boolean

////функция подстановки нуля в строку для даты (прототипирована в Number)
Number.prototype.zero_include = function() {//принимает число
    return this < 10 ? "0"+this : this.toString() //добавляет "0" при значениях меньше 10
  }//возвращает строку

//удаляет все пробелы
String.prototype.delete_all_spaces = function() { return this.replace(/[\s.,%]/g, '') }

///функция перевода строки в числа
//принимает строку, где каждая позиция символа соответсвует числовому коду
String.prototype.to_array_of_numbers = function(simbols_static_in_fn) {

  return this
          .split('') //перевод строки в массив
          .map( string_symbol =>   //пересборка в новый массив
                +string_symbol || //если символ число, то возвращает число
                //иначе возвращает позицию символа в соответствии с таблицей Урсулы
                simbols_static_in_fn.indexOf(string_symbol)%9+1 
              )
}//возвращает массив чисел


////функция пересборки цифрового кода строки до нужного количества цифр
Array.prototype.to_number_of_symbols = function (number_of_symbols_fn) {

  let output_array_fn = this

  //сужение по Урсуле
  function minus(minarray, mlength) {//массив и количество нужных чисел

    let minus_one = []
    for (let i=0; i < minarray.length-1; i++)
      minus_one.push(to_one_fibbonachi_digit(minarray[i]+minarray[i+1]))

    return (minus_one.length == mlength) ? minus_one : minus(minus_one, mlength)
  }//возвращает сужаемый до нужного количества цифр массив


  //расширение по суммам между каждым числом (одна итерация => (123) = (13253))
  function another_plus(another_plus_array, alength) {
    
    let another_one = []
    //первый символ добавляется автоматически
    another_one.push(another_plus_array[0])
    
    for (let i=0; i < another_plus_array.length-1; i++)
      another_one.push( to_one_fibbonachi_digit(another_plus_array[i]+another_plus_array[i+1]),
                        another_plus_array[i+1]
                      )
    return (another_one.length >= alength) ? another_one : another_plus(another_one, alength)
  }// массив расширяется на порядок (lenght*2-1)
  
  //на уменьшение
  if (number_of_symbols_fn < this.length )
      output_array_fn = minus(this, number_of_symbols_fn)

  //на расширение
  if (this.length != 1 && //блокируем расширение одного символа
        number_of_symbols_fn > this.length) {

      // массив расширяется на порядок (lenght*2-1)
      output_array_fn = another_plus(this, number_of_symbols_fn)
      
      //сокращаем до нужной длины по стандартному алгоритму
      if (output_array_fn.length != number_of_symbols_fn)
        output_array_fn = minus(output_array_fn, number_of_symbols_fn)
      }
  
  return output_array_fn
}//end // to_number_of_symbols
