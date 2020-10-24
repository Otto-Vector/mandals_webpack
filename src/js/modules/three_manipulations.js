import * as THREE from '../three.min.js'
import { OrbitControls } from '../OrbitControls.js'
import {history, history_counter} from '../modules/history.js'
import {autofocus} from './camera_autofocus.js'

/////////////////////////////////////////////////////////////////////////////
  //добавил сцену
  let scene = new THREE.Scene()
  scene.background = new THREE.Color( "white" ) //задал сцене задний фон
 
  //настроил параметры камеры
  let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 )
  camera.lookAt( 0, 0, 0 ) //смотреть в центр координат

  //выбрал рендер
  let renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize( window.innerWidth-4, window.innerHeight-4 ) //отнял по 4 пикселя, потому что появляется прокрутка



///////////МАНИПУЛЯЦИИ СО СЦЕНОЙ (оставил только приближение и удаление)//////////////////////

// активация внутри функции render() и onwindowresize() строкой controls.update()
let controls = new THREE.OrbitControls (camera, renderer.domElement)
controls.minDistance = 2 //минимальная 
controls.maxDistance = 444 //максимальная дистанция при ручном приближении

/////функция изменения центровки камеры при изменении размера экрана///////////////
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth-4, window.innerHeight-4)

  controls.update() //для сохранения пропорций при динамическом изменении ширины экрана

  autofocus()
}


////анимация
function animate() {

  requestAnimationFrame( animate )

  // рендеринг
  controls.update() //манипуляция со сценой
  renderer.render( scene, camera )
  // history[history_counter].camera_range = camera.position.z
}


//////////////////////////////////////////////////////////////////////////////
////функция очистки памяти от ссылок на объекты THREEX, оставшихся в render
function remove_all_objects_from_memory(object_to_clear) {

  //функция поиска соответствий на наличие объектов
  function disposeNode(parentObject) {

  parentObject.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
          if (node.geometry) {
              node.geometry.dispose();
          }

          if (node.material) {

              if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.MultiMaterial) {
                  node.material.materials.forEach(function (mtrl, idx) {
                      if (mtrl.map) mtrl.map.dispose();
                      if (mtrl.lightMap) mtrl.lightMap.dispose();
                      if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                      if (mtrl.normalMap) mtrl.normalMap.dispose();
                      if (mtrl.specularMap) mtrl.specularMap.dispose();
                      if (mtrl.envMap) mtrl.envMap.dispose();

                      mtrl.dispose();    // disposes any programs associated with the material
                  });
              }
              else {
                  if (node.material.map) node.material.map.dispose();
                  if (node.material.lightMap) node.material.lightMap.dispose();
                  if (node.material.bumpMap) node.material.bumpMap.dispose();
                  if (node.material.normalMap) node.material.normalMap.dispose();
                  if (node.material.specularMap) node.material.specularMap.dispose();
                  if (node.material.envMap) node.material.envMap.dispose();

                  node.material.dispose();   // disposes any programs associated with the material
              }
          }
      }
    });
  }

  //сама реализация очистки
  for (let i = 0; i < object_to_clear.length; i++) {

    scene.remove( object_to_clear[i] ) //убираем объект со сцены
    disposeNode(object_to_clear[i]) //запускаем встроенную функцию очистки
    object_to_clear[i] = null //зачищаем сам массив
  
  }

  //дополнительная очистка (на всякий)
  object_to_clear.length = 0

}

  export {scene, camera, renderer,
          onWindowResize, animate, remove_all_objects_from_memory, controls}