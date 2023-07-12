import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(6, 6, 6);
  gltf.scene.position.set(0, -2, 0);
  gltf.scene.rotation.y = Math.PI * 0.7;
  scene.add(gltf.scene);

  updateAllMaterials();

  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(Math.PI * 0.1)
    .name("FlightHelmet-y");
});

const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
  "textures/environmentMaps/0/px.jpg",
  "textures/environmentMaps/0/nx.jpg",
  "textures/environmentMaps/0/py.jpg",
  "textures/environmentMaps/0/ny.jpg",
  "textures/environmentMaps/0/pz.jpg",
  "textures/environmentMaps/0/nz.jpg",
]);
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
// 效果 和 child.material.envMap = environmentMap; 一样
scene.environment = environmentMap;

const updateAllMaterials = () => {
  //  traverse   遍历场景中的所有对象，包括子对象和孙对象。通过传入一个回调函数，可以对每个对象进行特定操作
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      // 将环境贴图应用到 child 对象的材质上。 用于模拟物体周围环境的反射和折射效果。它可以通过将场景中其它物体的样貌投射到一个纹理中，再将该纹理应用到目标物体上来实现
      //   child.material.envMap = environmentMap;
      // 增加环境贴图的亮度和影响力，使其更加明显
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.castShadow = true
    }
  });
};

debugObject.envMapIntensity = 10;
gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(10)
  .step(1)
  .onChange(updateAllMaterials);

/**
 * Test sphere
 */
const testSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial()
);
// scene.add(testSphere);

/**
 * light
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true
scene.add(directionalLight);
gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.1)
  .name("directionalLight-intensity");
gui
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.1)
  .name("directionalLight-x");
gui
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.1)
  .name("directionalLight-y");
gui
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.1)
  .name("directionalLight-z");

const c = new THREE.CameraHelper()

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
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  //   抗锯齿
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputEncoding = THREE.sRGBEncoding;

/**
 * 是用于启用渲染器的物理正确光照功能。
    在计算机图形学中，物理正确的光照是一种模拟现实世界中光照行为的方法。启用这个选项后，渲染器将根据物理规律来计算光线的传播、反射和折射等过程，以更准确地模拟真实光照的效果。
    具体而言，启用物理正确光照后，渲染器会考虑光线的能量衰减、颜色的反射率、材质的表面属性（如金属度、粗糙度）等因素来计算场景中的光照效果。这可以使得渲染结果更加真实，与现实世界的观察结果更加接近。
    需要注意的是，启用物理正确光照可能会增加计算开销，并对渲染性能产生一定的影响。因此，根据具体的应用需求和硬件性能，你可以根据需要选择是否启用这个选项。
 */
renderer.physicallyCorrectLights = true;
// 曝光
renderer.toneMappingExposure = 1;
renderer.toneMapping = THREE.ReinhardToneMapping;
gui.add(renderer, "toneMapping", {
  no: THREE.NoToneMapping,
  linear: THREE.LinearToneMapping,
  reinhard: THREE.ReinhardToneMapping,
  cineon: THREE.CineonToneMapping,
  acesf: THREE.ACESFilmicToneMapping,
});
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(1);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
