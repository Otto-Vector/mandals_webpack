
// import {palitra}from './palitra_sort_buttons.js'

let titles = []
let palitra_div_left = document.querySelectorAll('#left_panel div')
for (const [i, val] of palitra_div_left.entries()) { titles[i] = val.title }

let help_text_node = document.querySelectorAll('.help_description__text')

function help_vis() {
	for (const [i, val] of help_text_node.entries()) { val.innerText = titles[i] }
}

//активация прорисовки значений из title-ов указанных кнопок
help_vis()

let help_panel = document.querySelectorAll('#help_panel')

function help_panel_vis() {
	help_panel.classList.toggle('active')
}

// export {help_panel_vis}