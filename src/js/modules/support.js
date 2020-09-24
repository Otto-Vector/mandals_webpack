
///////////////////////////////////////////////////////////////////////////////
///////ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ АНАЛИЗА И ПРЕОБРАЗОВАНИЯ///////////////////////
/////////////////////////////////////////////////////////////////////////////

//функция сложения чисел к одному числу фибоначчи
function to_one_fibbonachi_digit(number_in_fn) {//передаётся числовое значение
    return number_in_fn%9 || 9
  }//возвращает одну цифру по фибоначчи

//функция
function to_one_eleven_digit(number_in_fn) {
  number_in_fn = Math.abs(number_in_fn-11)
  return number_in_fn > 9 ? to_one_eleven_digit(number_in_fn) : number_in_fn
}

////функция нормализации введенной строки, и замены его на тестовое значение
function modification_to_normal(string_from_user_input, string_by_default) {
//принимает две строки, string_from_user_input - на обработку
//string_by_default - на замену, если string_from_user_input оказалась false

  return  (//проверка string_from_user_input 
            !string_from_user_input || // на значения приводящие к false
            !string_from_user_input.trim() || // (в том числе пустая строка после сброса пробелов)
            +string_from_user_input == 0 //бессмысленные нули
          ) ? 
              //присваивается значение по умолчанию //и (на всякий случай) обрабатывается и оно
              modification_to_normal( string_by_default, "0123456789" )
            : 
              string_from_user_input
                .delete_all_spaces() //убираем все пробелы
                .toLowerCase()     //убираем верхний регистр
}//возвращает обработанную строку без пробелов в нижнем регистре либо обработанную тестовую строку

export {to_one_fibbonachi_digit, to_one_eleven_digit, modification_to_normal}