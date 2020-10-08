
import {palitra}from './palitra_sort_buttons.js'

let titles = []

for (const [i, val] of palitra.entries()) { titles[i] = val.title }

let help_text_node = document.querySelectorAll('.help_description__text')

function help_vis() {
	for (const [i, val] of help_text_node.entries()) { val.innerText = titles[i+12] }

}

help_vis()

