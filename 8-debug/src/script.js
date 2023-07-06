import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";

const gui = new dat.GUI();
gui.hide()
const paramters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, {
      duration: 1,
      y: mesh.rotation.y + Math.PI * 2,
      x: mesh.rotation.x + Math.PI * 2,
    });
  },
};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: paramters.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
gui.add(mesh.position, "y", -2, 3, 0.1);
gui.add(mesh.position, "x", -2, 3, 0.1);
gui.add(mesh.position, "z", -2, 3, 0.1).name("Z");
gui.add(mesh, "visible").name("是否可视");
gui.add(material, "wireframe").name("材质");
gui.addColor(paramters, "color").onChange(() => {
  material.color.set(paramters.color);
});
gui.add(paramters, "spin");

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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
