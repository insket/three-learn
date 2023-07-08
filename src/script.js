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

// fog
const fog = new THREE.Fog("#262837", 1, 16);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorColorTesture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTesture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTesture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTesture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTesture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTesture = textureLoader.load("/textures/door/roughness.jpg");
const doorMetalnessTesture = textureLoader.load("/textures/door/metalness.jpg");

const wallsAmbientOcclusionTesture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const wallsColorTesture = textureLoader.load("/textures/bricks/color.jpg");
const wallsNormalTesture = textureLoader.load("/textures/bricks/normal.jpg");
const wallsRoughnessTesture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const grassAmbientOcclusionTesture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassColorTesture = textureLoader.load("/textures/grass/color.jpg");
const grassNormalTesture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTesture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

grassColorTesture.repeat.set(8, 8);
grassAmbientOcclusionTesture.repeat.set(8, 8);
grassNormalTesture.repeat.set(8, 8);
grassRoughnessTesture.repeat.set(8, 8);
grassColorTesture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTesture.wrapS = THREE.RepeatWrapping;
grassNormalTesture.wrapS = THREE.RepeatWrapping;
grassRoughnessTesture.wrapS = THREE.RepeatWrapping;
grassColorTesture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTesture.wrapT = THREE.RepeatWrapping;
grassNormalTesture.wrapT = THREE.RepeatWrapping;
grassRoughnessTesture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
// Temporary sphere
const house = new THREE.Group();
scene.add(house);

// walls 墙
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallsColorTesture,
    aoMap: wallsAmbientOcclusionTesture,
    normalMap: wallsNormalTesture,
    roughnessMap: wallsRoughnessTesture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 2.5 / 2;
house.add(walls);

// roof  屋顶
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);

roof.position.y = 2.5 + 1 / 2;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// door
/**
 * alphaMap  需要配合 transparent
 * aoMap  需要核外配置 uv   door.geometry.setAttribute("uv2",new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
 * displacementMap  需要 new THREE.PlaneGeometry(1.5, 2, 100, 100), 后两个参数
);
 */
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTesture,
    transparent: true,
    alphaMap: doorAlphaTesture,
    aoMap: doorAmbientOcclusionTesture,
    displacementMap: doorHeightTesture,
    displacementScale: 0.1,
    normalMap: doorNormalTesture,
    metalnessMap: doorMetalnessTesture,
    roughness: doorRoughnessTesture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 0.9;
door.position.z = 4 / 2 + 0.01;
house.add(door);

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

// bushes 灌木
const bushe1 = new THREE.Mesh(bushGeometry, bushMaterial);
bushe1.scale.set(0.5, 0.5, 0.5);
bushe1.position.set(1.7, -0.8, 1);
const bushe2 = new THREE.Mesh(bushGeometry, bushMaterial);
bushe2.scale.set(0.4, 1, 0.3);
bushe2.position.set(0, -0.8, 3);
const bushe3 = new THREE.Mesh(bushGeometry, bushMaterial);
bushe3.scale.set(0.4, 0.6, 0.4);
bushe3.position.set(-1.7, -0.8, 1);
door.add(bushe1, bushe2, bushe3);

// graves 墓碑
const graves = new THREE.Group();
scene.add(graves);

const gravesGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const gravesMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 60; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 8;
  const x = Math.sin(angle) * radius;
  const y = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(gravesGeometry, gravesMaterial);
//   grave.castShadow = true
  grave.position.set(x, 0.4, y);
  grave.rotation.y = (Math.random() - 0.5) * 0.5;
  grave.rotation.x = (Math.random() - 0.5) * 0.5;
  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({
    map: grassColorTesture,
    aoMap: grassAmbientOcclusionTesture,
    normalMap: grassNormalTesture,
    roughnessMap: grassRoughnessTesture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.3);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.1);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// door light
const doorLight = new THREE.PointLight("#ff7d46", 0.8, 8);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// ghosts
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
const ghost3 = new THREE.PointLight("#ffff00", 2, 3);

scene.add(ghost1, ghost2, ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 7;
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
renderer.setClearColor("#262837");

// shadows
renderer.shadowMap.enabled = true
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
bushe1.castShadow = true
bushe2.castShadow = true
bushe3.castShadow = true

floor.receiveShadow = true
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const ghost1Angle = elapsedTime * 0.2;
  ghost1.position.set(
    Math.cos(ghost1Angle) * 4,
    Math.sin(ghost1Angle) * 4,
    Math.sin(elapsedTime * 3)
  );
  const ghost2Angle = elapsedTime * 0.9;
  ghost2.position.set(
    Math.cos(ghost2Angle) * 5,
    Math.sin(ghost2Angle) * 5,
    Math.sin(elapsedTime * 2)
  );
  const ghost3Angle = elapsedTime * 0.5;
  ghost3.position.set(
    Math.sin(ghost3Angle) * 6,
    Math.cos(ghost3Angle) * 4,
    Math.sin(elapsedTime * 6)
  );

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
