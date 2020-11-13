
// import {palitra}from './palitra_sort_buttons.js'

let titles = []
//выбираем данные кнопок слева и справа
let palitra_div_left = document.querySelectorAll('#left_panel div')
let palitra_div_right = document.querySelectorAll('#palitra div')
//объединяем данные кнопок
let left_right_palitras = [...palitra_div_left, ...palitra_div_right]

//выбираем ноды всех элементов help_description панелей "помощь"
let help_text_node = document.querySelectorAll('.help_description__text')

//присваиваем значения title в help_description-ы
function help_vis() {
	for (const [i, val] of help_text_node.entries()) { val.innerText = left_right_palitras[i].title }
}

//активация прорисовки значений из title-ов указанных кнопок
help_vis()

//отображение панели помощи в зависимости от того с какой стороны нажата помощь
function help_panel_vis(position) {
	document.querySelector('#help_panel.'+position).classList.toggle('active')
}

export {help_panel_vis}