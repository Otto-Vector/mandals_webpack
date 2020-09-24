import {to_one_fibbonachi_digit, to_one_eleven_digit} from './support.js'

///////////////////////////////////////////////////////////////////////////////
/////////////////////АЛГОРИТМЫ ПОДСЧЁТА МАНДАЛ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

////////пластина мандалы из кубов по первому алгоритму (Юлин вариант)///////
function plane_square_3x_algorithm(input_nums_in_fn, eleven = false) {//принимает одномерный массив чисел, созданных из введенной строки

  //задаём основной цифро-световой массив мандалы
  let matrix = []
  //сначала назначаем ось по горизонтали
    matrix[0] = input_nums_in_fn
  //и зеркально по вертикали от единицы
  for (let i=1; i < input_nums_in_fn.length; i++) {
    //первое значение каждой строки
    matrix[i] = [matrix[0][i]]
  }

  //высчитываем мандалу на основе заданных осей (массивы считаются от 1, потому что подсчёт -1)
  let fibbo_number
  for (let y=1; y < input_nums_in_fn.length; y++)
    for (let x=1; x < input_nums_in_fn.length; x++) {

      fibbo_number = matrix[y-1][x] + matrix[y][x-1] + matrix[y-1][x-1]
      fibbo_number = !eleven ? to_one_fibbonachi_digit(fibbo_number) : to_one_eleven_digit(fibbo_number)


      matrix[y].push(fibbo_number)
    }

  return matrix
}//возвращает двумерный массив



//алгоритм для мадалы "ромб"
function curtail_diamond_algorithm(plane_of_colors_in_fn, eleven = false) {

  let diamond_matrix = [...plane_of_colors_in_fn]
  let length_fn = plane_of_colors_in_fn.length;
  //краткое описание: происходит "заворачивание" углов квадратной мандалы
  // суммированием от крайних элементов к середине
  for (let x=1; x < length_fn-1; x++)
    for (let y=1; y < length_fn-x; y++) {
    diamond_matrix[x][y] = plane_of_colors_in_fn[x][y] +
                           plane_of_colors_in_fn[length_fn-x][length_fn-y]
    //выбор расчёта через 11
    diamond_matrix[x][y] = !eleven ? to_one_fibbonachi_digit(diamond_matrix[x][y]) : to_one_eleven_digit(diamond_matrix[x][y])
    
    //срезание углов
    diamond_matrix[length_fn-x][length_fn-y] = 0
    }
  
  return diamond_matrix
}

////////алгоритм сбора мандалы по шахматной схеме/////////////////////////////
function chess_algorithm(input_nums_fn, mirror_variant = false, eleven = false ) {//принимает одномерный массив чисел, созданных из введенной строки и модификатор стиля отображения косой оси

  //косая ось шахматного подсчёта
  let axis_fn = !mirror_variant ?
  //первый вариант если false
    [ //создаём базис отсчёта сумма посередине и по краям, основное "слово" от центра
      input_nums_fn[0], //это уже посчитанная заранее сумма вписанная в нулевой элемент
      ...input_nums_fn.map((n,i,arr) => arr[arr.length-1-i]), //разворот вводного значения, соотвественно сумма из нулевого значения становится в середине
      ...input_nums_fn.slice(1), //еще раз вставляем значение и обрезаем повторную сумму
      input_nums_fn[0] //и снова сумма в конце
    ]
    :
  //второй вариант если true
    [//создаём базис отсчёта сумма посередине и по краям, основное "слово" от краёв к центру
      ...input_nums_fn,
      input_nums_fn[0],
      ...input_nums_fn.map((n,i,arr) => arr[arr.length-1-i]) //аналог reverse() без изменения массива
    ]

  let matrix = axis_fn.map(n => axis_fn.map( n => 0)) // создаём двумерную матрицу на нулях на основе размера базиса

  axis_fn.forEach( (n,i) => matrix[i][i] = n) // вписываем косую "ось" (базис) в матрицу подсчёта

    //сначала расчёт диагонали в сторону уменьшения
    for (let i=1; i < axis_fn.length; i++)
      for (let j=i; j < axis_fn.length; j++) {

           //складывается в шахматном порядке нечетная диагональ по две цифры
          matrix[j][j-i] = matrix[j][j-i+1]
                           + matrix[j-1][j-i]
                           + ((i%2==0) ? matrix[j-1][j-i+1] : 0) //четные диагонали - по три цифры
          matrix[j][j-i] = !eleven ? to_one_fibbonachi_digit ( matrix[j][j-i] ) : to_one_eleven_digit ( matrix[j][j-i] )
      }

    //расчёт диагонали в сторону увеличения
    for (let i=0; i < axis_fn.length; i++)
      for (let j=0; j < axis_fn.length-1-i; j++) {

          //складывается в шахматном порядке нечетная диагональ по две цифры
          matrix[j][j+i+1] = matrix[j][j+i]
                             + matrix[j+1][j+i+1]
                             + ((i%2==0) ? matrix[j+1][j+i] : 0) //четные диагонали - по три цифры
          matrix[j][j+i+1] = !eleven ? to_one_fibbonachi_digit ( matrix[j][j+i+1] ) : to_one_eleven_digit ( matrix[j][j+i+1] )
      }

  return matrix.reverse()
}//возвращаем развёрнутую наоборот двумерную матрицу, потому как отображение с другого угла


export {plane_square_3x_algorithm, curtail_diamond_algorithm, chess_algorithm}