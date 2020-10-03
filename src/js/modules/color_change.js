import {BASE_colors, BASE_gray_colors} from '../default_values.js'

let basic_colors = [ ...BASE_colors ]

function color_change_to_second(bool) {

	basic_colors = !bool ? [ ...BASE_colors ] : [      BASE_colors[0],
                     BASE_colors[9], BASE_colors[1], BASE_colors[2],
                     BASE_colors[3], BASE_colors[4], BASE_colors[5],
                     BASE_colors[6], BASE_colors[8], BASE_colors[7]
                   ]
  }

function color_change_to_gray(bool) {
	basic_colors = !bool ? [ ...BASE_colors ] : [...BASE_gray_colors]
}

function gray_second(bool) {
	if (bool) basic_colors.reverse()
}

export {basic_colors, color_change_to_second, color_change_to_gray, gray_second}