import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import CANNON from "cannon";

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObj = {
  createSpgere: () => {
    createSphere(Math.random() * 0.5, {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
  },
};

gui.add(debugObj, "createSpgere");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const hisSound = new Audio("/sounds/hit.mp3");

const play = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  if (impactStrength > 1.5) {
    hisSound.volume = Math.random()
    hisSound.currentTime = 0;
    hisSound.play();
  }
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

// Physics
const world = new CANNON.World(); // 创建一个Cannon.js的物理世界对象，用于模拟物体之间的物理行为。
world.broadphase = new CANNON.SAPBroadphase(world); // 减轻掉帧
world.allowSleep = true; // 启用休眠功能可以提高物理仿真的性能和效率，尤其适用于具有大量静态或稳定对象的场景。它可以减少物理引擎的计算负载，并提供更快速的仿真结果。
world.gravity.set(0, -9, 0); // 设置物理世界的重力方向为向下，值为(0, -9, 0)。这将影响物体的运动和碰撞反应。

const defaultMaterial = new CANNON.Material("defalut"); // 创建了一个默认材质，用于定义物体之间的摩擦力和弹性恢复

//创建了一个默认接触材质，指定了摩擦力和弹性恢复系数。此处两个物体都使用默认材质，具有0.1的摩擦力和0.7的弹性恢复。
const defaultContacMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
world.addContactMaterial(defaultContacMaterial); // 将默认接触材质添加到物理世界中
world.defaultContactMaterial = defaultContacMaterial; // 将默认接触材质设置为物理世界的默认接触材质，以确保所有未定义接触材质的物体使用该材质

const floorShape = new CANNON.Plane(); // 创建了一个平面形状对象，用于表示地板。
//创建了一个物体体类对象，用于表示地板。在该示例中，地板的质量设为0，即静态物体，不受重力和碰撞影响。
const floorBoay = new CANNON.Body({
  mass: 0,
  shape: floorShape,
});
//  设置地板的旋转角度，使用四元数来表示绕轴旋转。此处将地板绕(-1, 0, 0)轴旋转90度
floorBoay.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBoay); // 将地板物体添加到物理世界中。

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const objectToUpdate = [];
const spheregeoMetry = new THREE.SphereGeometry(1, 20, 20);
const meshstandardMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.1,
  envMap: environmentMapTexture,
});
const createSphere = (radius, position) => {
  const mesh = new THREE.Mesh(spheregeoMetry, meshstandardMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
  });

  body.position.copy(position);
  body.addEventListener("collide", play);
  world.add(body);

  objectToUpdate.push({
    mesh,
    body,
  });
};

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const delaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // 物理引擎会根据给定的时间步长和迭代次数来模拟物体的运动、碰撞等物理行为。在每一次调用后，物理世界中的物体的位置、速度等属性将根据物理规则进行更新。
  world.step(1 / 60, delaTime, 3);

  for (const obj of objectToUpdate) {
    obj.mesh.position.copy(obj.body.position);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
