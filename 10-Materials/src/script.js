import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const doorTexture = textureLoader.load("/textures/door/alpha.jpg");
const colorTexture = textureLoader.load("/textures/door/color.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapsTexture = textureLoader.load("/textures/matcaps/1.png");
const gradientsTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientsTexture.minFilter = THREE.NearestFilter
gradientsTexture.magFilter = THREE.NearestFilter

const material = new THREE.MeshToonMaterial();
material.map = gradientsTexture
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.set(-1.5, 0, 0);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);
torus.position.set(1.5, 0, 0);
scene.add(sphere, plane, torus);

const ambientLight = new THREE.AmbientLight(0xffffff,.5)
scene.add(ambientLight)
const light = new THREE.PointLight( 0xffffff,.5 );
light.position.set( 2, 3, 4 );
scene.add( light );

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
// camera.position.x = 1;
// camera.position.y = 1;
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

const tick = () => {
  // sphere, plane,torus
  sphere.rotation.y += 0.01;
  plane.rotation.y += 0.01;
  torus.rotation.x += 0.01;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
