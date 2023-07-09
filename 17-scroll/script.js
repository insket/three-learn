import * as THREE from "three";
import * as dat from "lil-gui";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded",
};

const textureLoader = new THREE.TextureLoader();
const gradientsTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientsTexture.magFilter = THREE.NearestFilter;
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const objectDistance = 4;
const meterial = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientsTexture,
});
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), meterial);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), meterial);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  meterial
);

mesh1.position.y = -objectDistance * 0;
mesh1.position.x = 2;
mesh2.position.y = -objectDistance * 1;
mesh2.position.x = -2;
mesh3.position.y = -objectDistance * 2;
mesh3.position.x = 2;
scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

gui.addColor(parameters, "materialColor").onFinishChange(() => {
  meterial.color.set(parameters.materialColor);
});

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
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = e.x / sizes.width - 0.5;
  cursor.y = e.y / sizes.height - 0.5;
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  camera.position.y = (-scrollY / sizes.height) * objectDistance + cursor.y;
  camera.position.x = -cursor.x * 0.5;
  //   camera.position.y = cursor.y;

  for (const mesh of sectionMeshes) {
    mesh.rotation.x = elapsedTime * 0.1;
    mesh.rotation.y = elapsedTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
