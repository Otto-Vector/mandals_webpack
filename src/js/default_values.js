//база цветов//
  let BASE_colors = [ 
                      "#FFFFFF",
                      "#E4388C", "#E4221B", "#FF7F00",
                      "#FFED00", "#008739", "#02A7AA",
                      "#47B3E7", "#2A4B9B", "#702283"
                    ]

  let BASE_second_colors = [
                             BASE_colors[0],
                             BASE_colors[9], BASE_colors[1], BASE_colors[2],
                             BASE_colors[3], BASE_colors[4], BASE_colors[5],
                             BASE_colors[6], BASE_colors[8], BASE_colors[7]
                           ]

  let BASE_gray_colors = [
                            "#FFFFFF",
                            "#E2E2E2", "#C6C6C6", "#AAAAAA",
                            "#8E8E8E", "#717171", "#555555",
                            "#383838", "#1C1C1C", "#000000"
                         ]
	
  //максимальное количество символов вводимой строки
  let max_input_length = 33
  //максимальное количество знаков на расширение
  let max_expansion_length = 45 //было 57
/////////////////////////////////////////////////////////////////

	//названия классов для манипуляций с кнопками
  let unactive_visual_button = "unactive_visual_button"
  let opacity_button = "opacity_button"

///////////////////////////////////////////////////


 export { max_input_length, max_expansion_length,
 				BASE_colors,
        BASE_second_colors,
        BASE_gray_colors,
        opacity_button,
        unactive_visual_button
 				}