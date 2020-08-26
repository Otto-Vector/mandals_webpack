import {reinit} from '../modules/reinit.js'

let undo_button = document.querySelector("#undo_button")

undo_button.onclick = function () { reinit(-1) }

let redo_button = document.querySelector("#redo_button")

redo_button.onclick = function () { reinit(1) }

export {undo_button, redo_button}