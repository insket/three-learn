import "./style.css";
import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// mesh.position.set(.7,-.6,1)
// scene.add(mesh);
// // mesh.position.normalize()
// // console.log(mesh.position.length());

// // scale
// mesh.scale.set(2,.5,.5)

// // rotation
// mesh.rotation.reorder("YXZ")
// mesh.rotation.set(Math.PI * 0.25,Math.PI * 0.25,0)

const group = new THREE.Group()
scene.add(group)
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:"red"})
);
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:"blue"})
);
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:"orange"})
);
cube2.position.set(-1.5,0,0)
cube3.position.set(1.5,0,0)
group.add(cube1)
group.add(cube2)
group.add(cube3)
group.position.x = 0
group.scale.y = 1.5
group.rotation.y = 1.


// axes helper   坐标线
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

const sizes = {
  width: 1200,
  height: 900,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0,0,3)
scene.add(camera);
// console.log(mesh.position.distanceTo(camera.position));
// camera.lookAt(mesh.position)

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
