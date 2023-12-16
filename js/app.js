// Import modules
import * as THREE from "./build/three.module.js";
import { OrbitControls } from "./examples/jsm/controls/OrbitControls.js";
import { Water } from "./examples/jsm/objects/Water2.js";
import { GLTFLoader } from "./examples/jsm/loaders/GLTFLoader.js";

// Global variables
const mainContainer = document.getElementById("webgl-scene");
let scene,
	camera,
	renderer = null;
let camControls = null;
let dirLight = null;
let plane = null;
let water = null;
let cloud = null;

// Scene
// Scene
function createScene(){
	scene = new THREE.Scene();
	// scene.background = new THREE.Color( 0xEEEEEE );	// http://www.colorpicker.com/
	 //scene.background = new THREE.TextureLoader().load( "textures/sky.jpg" );
	
	let loader = new THREE.CubeTextureLoader();
	loader.setPath( 'textures/cube/' );
	const background = loader.load( [
		'px.jpg', 'nx.jpg',
		'py.jpg', 'ny.jpg',
		'pz.jpg', 'nz.jpg'
	] );
	// background.format = THREE.RGBAFormat;
	// scene.background = background;

	// let skyGeometry = new THREE.SphereGeometry(300, 32, 32);
	// let skyMaterial = new THREE.MeshBasicMaterial({ envMap: background, side:THREE.BackSide });
  	// let skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	// skyBox.position.y=50;
  	// scene.add(skyBox);

	const background2 = new THREE.TextureLoader().load( 'textures/sky.jpg' );
	background2.colorSpace = THREE.SRGBColorSpace;
	let skyGeometry = new THREE.SphereGeometry(250, 100, 300);
	let skyMaterial = new THREE.MeshBasicMaterial({ map: background2, side: THREE.BackSide });
  	let skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	skyBox.position.y=50;
  	scene.add(skyBox);
}

// Camera
function createPerspectiveCamera() {
	const fov = 45;
	const aspect = mainContainer.clientWidth / mainContainer.clientHeight;
	const near = 0.1;
	const far = 500; // meters
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

	camera.position.x = 10;
	camera.position.y = 20;
	camera.position.z = 50;
	camera.lookAt(scene.position);
}

// Interactive controls
function createControls() {
	camControls = new OrbitControls(camera, mainContainer);
	camControls.autoRotate = false;
}

// Create directional - sun light
function createDirectionalLight() {
	dirLight = new THREE.DirectionalLight(0xffffff);
	dirLight.position.set(-10, 20, 10);
	dirLight.intensity = 3;
	dirLight.shadow.camera.near = 0.5;
	dirLight.shadow.camera.far = 50;
	dirLight.shadow.camera.left = -20;
	dirLight.shadow.camera.top = 20;
	dirLight.shadow.camera.right = 20;
	dirLight.shadow.camera.bottom = -20;
	dirLight.shadow.mapSize.width = 1024;
	dirLight.shadow.mapSize.height = 1024;
	dirLight.castShadow = true;
	scene.add(dirLight);
}

function createRiverPlane() {
	const texture = new THREE.TextureLoader().load("textures/river.jpg"); // load texture
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 16;
	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(2, 2);

	const geometry = new THREE.PlaneGeometry(300, 70);
	const material = new THREE.MeshStandardMaterial({
		map: texture,
		side: THREE.DoubleSide,
	});

	plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = -0.5 * Math.PI;
	plane.position.x = 0;
	plane.position.y = 0;
	plane.position.z = 70;
	plane.receiveShadow = true;
	scene.add(plane);
}

// Creates water effect
function createWater() {
	const waterGeometry = new THREE.PlaneGeometry(300, 70);
	water = new Water(waterGeometry, {
		color: 0xafdce0,
		scale: 0.5,
		flowDirection: new THREE.Vector2(0.6, 0.6),
		textureWidth: 1024,
		textureHeight: 1024,
	});
	water.position.y = 0.1;
	water.rotation.x = -0.5 * Math.PI;
	water.position.z = 70;
	scene.add(water);
}

function createBoat() {
	const boatGroup = new THREE.Group();
    const bumpMapBoat = new THREE.TextureLoader().load("textures/boat.jpg");
	// Create the hull of the boat (a box) and scale it
	const hullGeometry = new THREE.BoxGeometry(6, 1, 2);
	const hullMaterial = new THREE.MeshStandardMaterial({ color: 0x964b00, bumpMap:bumpMapBoat, });
	const hull = new THREE.Mesh(hullGeometry, hullMaterial);

	// Scale the hull
	hull.scale.set(4, 4, 4); // Adjust the scale as needed
 
	boatGroup.add(hull);

	// Create the mast (a cylinder) and scale it
	const mastGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
	const mastMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513,bumpMap:bumpMapBoat, });
	const mast = new THREE.Mesh(mastGeometry, mastMaterial);

	// Scale the mast
	mast.scale.set(4, 4, 4); // Adjust the scale as needed

	mast.position.set(0, 6, 0); // Adjust the position relative to the scaled hull
	boatGroup.add(mast);

	// Position the boat in the middle of the river
	boatGroup.position.set(0, 2, 70); // Adjust the position as needed

	scene.add(boatGroup);
}

function createMeadowPlane() {
	const texture = new THREE.TextureLoader().load("textures/meadow.jpg"); // load texture
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 16;
	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(2, 2);

	const geometry = new THREE.PlaneGeometry(300, 140);
	const material = new THREE.MeshStandardMaterial({
		map: texture,
		side: THREE.DoubleSide,
	});

	plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = -0.5 * Math.PI;
	plane.position.x = 0;
	plane.position.y = 0;
	plane.position.z = -35;
	plane.receiveShadow = true;
	scene.add(plane);
}

function createBird(){
	const cloudTexture = new THREE.TextureLoader().load( "textures/220.png" );
	cloudTexture.colorSpace = THREE.SRGBColorSpace;
	const cloudMaterial = new THREE.SpriteMaterial( { map: cloudTexture, color: 0xffffff } );
	// const cloudMaterial = new THREE.SpriteMaterial( { map: cloudTexture, color: 0xffffff, transparent:true, opacity:0.7 } );
	cloud = new THREE.Sprite(cloudMaterial);
	cloud.scale.set(50, 30, 1);
	cloud.position.set(-30,30,-40);
	scene.add(cloud);
}

function createPicnicMat() {
	// Load the picnic mat texture
	const texture = new THREE.TextureLoader().load("textures/picnicMat.jpg");
	texture.anisotropy = 16;
	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(4, 4); // Adjust the repeat values

	// Create a picnic mat plane
	const matWidth = 10; // Adjust the width of the picnic mat
	const matLength = 20; // Adjust the length of the picnic mat
	const geometry = new THREE.PlaneGeometry(matWidth, matLength);
	const material = new THREE.MeshStandardMaterial({
		map: texture,
		side: THREE.DoubleSide,
	});

	const picnicMat = new THREE.Mesh(geometry, material);

	// Position the picnic mat as needed
	picnicMat.rotation.x = -0.5 * Math.PI; // Lay it flat
	picnicMat.position.set(0, 0.1, 0); // Adjust the position

	// Allow the picnic mat to receive shadows if your scene has shadows
	picnicMat.receiveShadow = true;

	// Add the picnic mat to the scene
	scene.add(picnicMat);
}
function createFlower() {
	const flowerGroup = new THREE.Group();
	const bumpMapLeaf = new THREE.TextureLoader().load("textures/leaf.jpg");

	// Create flower stem
	const stemGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 8);
	const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22,bumpMap:bumpMapLeaf, }); // Green color
	const stem = new THREE.Mesh(stemGeometry, stemMaterial);
	stem.position.set(0, 2.5,0); // Adjust the Z-axis position as needed
	//stem.castShadow = true;
	flowerGroup.add(stem);
  

	// Create flower petals
	const petalGeometry = new THREE.SphereGeometry(1, 16, 16);
	const petalMaterial = new THREE.MeshLambertMaterial({ color: 0xFF1493,bumpMap:bumpMapLeaf, }); // Pink color
  
	for (let i = 0; i < 6; i++) {
	  const petal = new THREE.Mesh(petalGeometry, petalMaterial);
	  const angle = (i / 6) * Math.PI * 2;
	  const radius = 1.5;
	  const x = radius * Math.cos(angle);
	  const z = radius * Math.sin(angle);
	  petal.position.set(x, 4, z);
	  petal.rotation.x = Math.PI / 2; // Rotate to face up
	  //petal.castShadow = true;
	  flowerGroup.add(petal);
	}
  flowerGroup.position.set(-10, 0, -5); // Adjust the position as needed

	scene.add(flowerGroup);
  }

function createFruitJuice() {
	// Create a simple juice box (vertical rectangle)
	const bumpMapJuice = new THREE.TextureLoader().load("textures/box.jpg");

	const juiceBoxGeometry = new THREE.BoxGeometry(1, 2, 0.5); // Adjust the dimensions
	const juiceBoxMaterial = new THREE.MeshStandardMaterial({ color: 0xceaa4d, bumpMap:bumpMapJuice}); // Red color for the juice box
	const juiceBox = new THREE.Mesh(juiceBoxGeometry, juiceBoxMaterial);

	// Position the juice box on the picnic mat
	juiceBox.position.set(0, 1.1, 0); // Adjust the position

	// Create a straw (small pipe)
	const strawGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32); // Adjust the dimensions
	const strawMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Gray color for the straw
	const straw = new THREE.Mesh(strawGeometry, strawMaterial);

	// Position the straw on top of the juice box
	straw.position.set(0, 2.4, 0); // Adjust the position

	// Combine the juice box and straw into a single group
	const juiceGroup = new THREE.Group();
	juiceGroup.add(juiceBox);
	juiceGroup.add(straw);

	// Add the juice group to the scene
	scene.add(juiceGroup);
}

function createTree() {
	const texture = new THREE.TextureLoader().load("textures/trunk.jpg"); // Load the tree texture
	texture.anisotropy = 16; // for scale details
	texture.magFilter = THREE.LinearFilter; // for sharpness
	texture.minFilter = THREE.LinearMipMapLinearFilter; // for sharpness
	texture.wrapS = THREE.RepeatWrapping; // for repeating the texture
	texture.wrapT = THREE.RepeatWrapping; // for repeating the texture
	texture.repeat.set(1, 1); // Adjust the repeat values
    const bumpMapLeaves = new THREE.TextureLoader().load("textures/leaves.jpg");
	const trunkGeometry = new THREE.CylinderGeometry(4, 4, 30, 16); // Adjust the dimensions
	const bumpMapTrunk = new THREE.TextureLoader().load("textures/trunkmap.jpg");
	const trunkMaterial = new THREE.MeshStandardMaterial({
		map: texture,
		bumpMap:bumpMapTrunk,
		side: THREE.DoubleSide,
	}); // Brown color for the trunk
	const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
	trunk.position.set(10, 15, 10); // Adjust the position

	const leavesGeometry = new THREE.SphereGeometry(10, 32, 16); // Adjust the dimensions
	const leavesMaterial = new THREE.MeshStandardMaterial({ 
		color: 0x228b22,
		bumpMap: bumpMapLeaves,
	}); // Green color for the leaves
	const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
	leaves.position.set(10, 30, 10); // Adjust the position

	// Combine the trunk and leaves into a single group
	const treeGroup = new THREE.Group();
	//trunk.castShadow=true;
	//leaves.castShadow=true;
	treeGroup.add(trunk);
	treeGroup.add(leaves);
	
	//treeGroup.castShadow = true;
	//treeGroup.receiveShadow = true;
	//treeGroup.position.set(-30,0,10);

	scene.add(treeGroup);
}

function createRock() {
	const texture = new THREE.TextureLoader().load("textures/rock.jpg"); // Load the rock texture
	const bumpMapRock= new THREE.TextureLoader().load("textures/rockbump.jpg");

	texture.anisotropy = 16;
	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(1, 1);

	const geometry = new THREE.BoxGeometry(15, 15, 15); // Adjust the size as needed
	const material = new THREE.MeshStandardMaterial({
		map: texture, //call material
		bumpMap: bumpMapRock,
		side: THREE.DoubleSide, //show both sides
	});

	const rock = new THREE.Mesh(geometry, material); // connect geometry and material
	rock.position.x = 50; // Adjust the position as needed
	rock.position.y = 7.5; // Adjust the position as needed
	rock.position.z = 33; // Adjust the position as needed
	rock.castShadow = true;
	rock.receiveShadow = true;
	scene.add(rock);
}

function createBench() {
	const texture = new THREE.TextureLoader().load("textures/bench.jpg"); // Load the bench texture
	const bumpMapBench= new THREE.TextureLoader().load("textures/bench2.jpg");

	texture.anisotropy = 16;
	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(1, 1);

	const material = new THREE.MeshStandardMaterial({
		map: texture,
		side: THREE.DoubleSide,
		bumpMap: bumpMapBench,
	});

	const geometry = new THREE.BoxGeometry(10, 2, 2); // Adjust the size as needed
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 1, 10); // Adjust the position as needed
	scene.add(mesh);
}

function loadPenguinModel() {
	const loader = new GLTFLoader();

	loader.load("textures/penguin.gltf", (gltf) => {
		const penguin = gltf.scene;
		penguin.scale.set(5, 5, 5); // Adjust the scale
		penguin.position.set(0, -0.1, -5); // Adjust the position
		scene.add(penguin);
	});
}

function loadCarModel() {
	const loader = new GLTFLoader();
	loader.load("textures/car.gltf", (gltf) => {
		const car = gltf.scene;
		
		car.scale.set(1, 1, 1); // Adjust the scale
		car.position.set(0, 0, 5); // Adjust the position
		scene.add(car);
	});
}




function loadBarrelModel() {
	const loader = new GLTFLoader();

	loader.load("textures/Barrel.glb", (gltf) => {
		const barrel = gltf.scene;
		barrel.scale.set(5, 5, 5); // Adjust the scale
		barrel.position.set(30, 7, -5); // Adjust the position
		scene.add(barrel);
	});
}

// Renderer object and features
function createRenderer() {
	renderer = new THREE.WebGLRenderer({ antialias: true });

	renderer.outputColorSpace = THREE.SRGBColorSpace;

	renderer.setSize(mainContainer.clientWidth, mainContainer.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	mainContainer.appendChild(renderer.domElement);
}

// Animations
function update() {}

function init() {
	// https://threejs.org/docs/index.html#manual/en/introduction/Color-management
	THREE.ColorManagement.enabled = true;
	// Create scene
	createScene();

	// Create camera:
	createPerspectiveCamera();

	// Create interactive controls:
	createControls();

	// Create lights:
	createDirectionalLight();

	// Create meshes and other visible objects:
	//createPlane();

	createRiverPlane();
	createBird();
	createWater();
	createBoat();
	createFlower();
	createRock();
	createTree();
	createPicnicMat();
	createFruitJuice();
	createBench();
	loadPenguinModel();
	loadCarModel();
	loadBarrelModel();
	createMeadowPlane();

	// Render elements
	createRenderer();

	// Create animations
	renderer.setAnimationLoop(() => {
		update();
		renderer.render(scene, camera);
	});
}

init();

// Auto resize window
window.addEventListener("resize", (e) => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
