// import {max_input_length} from '../my.js'

///////////////////////////////////////////////////////////////////////////////
///////ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ АНАЛИЗА И ПРЕОБРАЗОВАНИЯ///////////////////////
/////////////////////////////////////////////////////////////////////////////

function to_one_fibbonachi_digit(number_in_fn) {//передаётся числовое значение

    let amount = 
        Math.abs(+number_in_fn) //на всякий случай перевод из отрицательного в абсолютное значение с нумеризацией
        .toString()           //перевод числа в строку для разъединения многозначных чисел
        .split('')           //перевод строки в массив
        .map(Number)        //перевод массива символов в массив чисел
        .reduce( (sum,n) => sum+n ) //перебор массива с подсчётом суммы чисел

    return amount > 9 ? to_one_fibbonachi_digit(amount) : amount //замыкание функции при многозначной сумме
  }//возвращает одну цифру суммы всех чисел по фибоначчи

////функция нормализации введенной строки, и замены его на тестовое значение
function modification_to_normal(string_from_user_input, string_by_default) {
//принимает две строки, string_from_user_input - на обработку
//string_by_default - на замену, если string_from_user_input оказалась false

  return  (
            !string_from_user_input ||
            !string_from_user_input.trim() ||
            +string_from_user_input == 0
          ) ? //проверка string_from_user_input на значения приводящие к false (в том числе пустая строка после сброса пробелов)
              //присваивается значение по умолчанию //и (на всякий случай) обрабатывается и оно
              modification_to_normal( string_by_default, "0123456789" )
            : 
              string_from_user_input
                .delete_all_spaces() //убираем все пробелы
                // .slice( 0, max_input_length )        //обрезание более 30ти символов
                .toLowerCase()     //убираем верхний регистр
}//возвращает обработанную строку без пробелов меньше max_input_length символов в нижнем регистре либо обработанную тестовую строку

export {to_one_fibbonachi_digit, modification_to_normal}