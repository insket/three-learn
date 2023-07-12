import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
// // 创建了一个起始点（origin），表示光线的起始位置
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// // 创建了一个方向向量（direction），表示光线的方向。在此例中，方向向量的坐标为 (10, 0, 0)，表示光线的方向是沿着 x 轴正方向
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize()
// raycaster.set(rayOrigin, rayDirection);

// const intersect = raycaster.intersectObject(object2)

// const intersects = raycaster.intersectObjects([object1,object2,object3])

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const mouse = new THREE.Vector2()
window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX / sizes.width * 2 - 1
    mouse.y = -(e.clientY / sizes.height) * 2 + 1
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * -1.3) * 1.5;

  raycaster.setFromCamera(mouse,camera)

//   const rayOrigin = new THREE.Vector3(-3, 0, 0);
//   const rayDirextion = new THREE.Vector3(1, 0, 0);
//   rayDirextion.normalize();
//   raycaster.set(rayOrigin, rayDirextion);

  const intersects = raycaster.intersectObjects([object1,object2,object3])

  for (const obj of [object1,object2,object3]) {
    obj.material.color.set("#ff0000")
  }
  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff")

  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
