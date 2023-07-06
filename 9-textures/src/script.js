import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log(
    "Started loading file: " +
      url +
      ".\nLoaded " +
      itemsLoaded +
      " of " +
      itemsTotal +
      " files."
  );
};
manager.onLoad = function () {
  console.log("Loading complete!");
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  console.log(
    "Loading file: " +
      url +
      ".\nLoaded " +
      itemsLoaded +
      " of " +
      itemsTotal +
      " files."
  );
};

manager.onError = function (url) {
  console.log("There was an error loading " + url);
};

const textureLoader = new THREE.TextureLoader(manager);
const colortexture = textureLoader.load("/textures/door/minecraft.png");
const ambientOcclusiontexture = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const heighttexture = textureLoader.load("/textures/door/height.jpg");
const metalnesstexture = textureLoader.load("/textures/door/metalness.jpg");
const normaltexture = textureLoader.load("/textures/door/normal.jpg");

// colortexture.repeat.x = 2
// colortexture.repeat.y = 3

// colortexture.wrapS = THREE.RepeatWrapping
// colortexture.wrapT = THREE.RepeatWrapping

// colortexture.generateMipmaps = false
// colortexture.minFilter = THREE.NearestFilter
colortexture.magFilter = THREE.NearestFilter
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 *
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colortexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
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

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
