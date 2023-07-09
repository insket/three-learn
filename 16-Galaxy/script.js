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

// Galaxy
const parameters = {
  count: 10000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  inColor: "#ff6030",
  outColor: "#1b3984",
};

let geometry = null;
let material = null;
let pointsMesh = null;

const generdteGalaxy = () => {
  if (pointsMesh) {
    geometry.dispose();
    material.dispose();
    scene.remove(pointsMesh);
  }

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const color = new Float32Array(parameters.count * 3);

  const colorIn = new THREE.Color(parameters.inColor);
  const colorout = new THREE.Color(parameters.outColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;

    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const randomX = (Math.random() - 0.5) * parameters.randomness;
    const randomY = (Math.random() - 0.5) * parameters.randomness;
    const randomZ = (Math.random() - 0.5) * parameters.randomness;

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorIn.clone();
    mixedColor.lerp(colorout, radius / parameters.radius);

    color[i3] = mixedColor.r;
    color[i3 + 1] = mixedColor.g;
    color[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(color, 3));

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  pointsMesh = new THREE.Points(geometry, material);

  scene.add(pointsMesh);
};
generdteGalaxy();

gui
  .add(parameters, "count")
  .min(100)
  .max(2000)
  .step(100)
  .name("粒子数量")
  .onFinishChange(generdteGalaxy);
gui
  .add(parameters, "size")
  .min(0.01)
  .max(0.1)
  .step(0.01)
  .name("粒子大小")
  .onFinishChange(generdteGalaxy);
gui
  .add(parameters, "radius")
  .min(1)
  .max(20)
  .step(0.5)
  .name("半径")
  .onFinishChange(generdteGalaxy);
gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .name("分支")
  .onFinishChange(generdteGalaxy);
gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(1)
  .name("旋转")
  .onFinishChange(generdteGalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.1)
  .name("随机性")
  .onFinishChange(generdteGalaxy);
gui
  .add(parameters, "randomnessPower")
  .min(1)
  .max(10)
  .step(1)
  .name("randomnessPower")
  .onFinishChange(generdteGalaxy);
gui.addColor(parameters, "inColor").onFinishChange(generdteGalaxy);
gui.addColor(parameters, "outColor").onFinishChange(generdteGalaxy);

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
camera.position.x = 3;
camera.position.y = 3;
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
