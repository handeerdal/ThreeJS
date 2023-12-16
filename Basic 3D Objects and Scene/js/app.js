/* ----------------------------------------------------------
WebGL App, Vytautas Magnus University, faculty of Informatics
---------------------------------------------------------- */

// Import modules
import * as THREE from './build/three.module.js';
import Stats from './libs/stats.module.js';
import { OrbitControls } from './controls/OrbitControls.js';

// Global variables
const mainContainer = document.getElementById('webgl-scene');
const fpsContainer = document.getElementById('fps');
let stats = null;
let scene, camera, renderer = null;
let camControls = null;
let dirLight, spotLight, ambientLight = null;

let plane, box, sphere, wheel, trunk, leaves = null;

// Scene
function createScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb4d4ef); // http://www.colorpicker.com/
}

// FPS counter
function createStats() {
  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  fpsContainer.appendChild(stats.dom);
}

// Camera
function createPerspectiveCamera() {
	const fov = 45;
	const aspect = mainContainer.clientWidth / mainContainer.clientHeight;
	const near = 0.1;
	const far = 500; // meters
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	
	// Set camera position
	camera.position.x = 0; // Adjust the X position as needed
	camera.position.y = 10; // Adjust the Y position as needed
	camera.position.z = 50; // Adjust the Z position as needed
  
	// Rotate the entire scene 180 degrees around the Y-axis
	scene.rotation.y = Math.PI/2;
  
	camera.lookAt(new THREE.Vector3(0, 5, 10)); // Look at the front side of the house
  }
  

function createControls() {
  camControls = new OrbitControls(camera, mainContainer);
  camControls.autoRotate = false;
}

function createDirectionalLight(){
	dirLight = new THREE.DirectionalLight( 0xffffff);
	dirLight.position.set( -15, 20, -10);
	dirLight.intensity = 3;
	// set light coverage
	dirLight.shadow.camera.near = 0.5;      // default
	dirLight.shadow.camera.far = 50;      	// default
	dirLight.shadow.camera.left = -20;
	dirLight.shadow.camera.top = 20;
	dirLight.shadow.camera.right = 20;
	dirLight.shadow.camera.bottom = -20;
	// Makes the shadows with less blurry edges
	dirLight.shadow.mapSize.width = 1024;  	// default 512
	dirLight.shadow.mapSize.height = 1024; 	// default 512
	// enable shadows for light source
	dirLight.castShadow = true;
	scene.add( dirLight );

	// adds helping lines
	// const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 3, 0xcc0000 );
	// scene.add( dirLightHelper );
	// scene.add(new THREE.CameraHelper(dirLight.shadow.camera));
}

// Create spot-lamp light
function createSpotLight() {
  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-15, 25, 10);
  // lighting params
  spotLight.intensity = 5;
  spotLight.distance = 50;
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.4; // 0 - 1
  spotLight.decay = 0.2; // how quickly light diminishes
  // Makes the shadows with less blurry edges
  spotLight.shadow.mapSize.width = 1024; // default 512
  spotLight.shadow.mapSize.height = 1024; // default 512
  // enable shadows for the light source
  spotLight.castShadow = true;
  spotLight.receiveShadow = true;
  scene.add(spotLight);
  // set light target to sphere
  if (sphere != null) {
    spotLight.target = sphere;
    spotLight.target.updateMatrixWorld();
  }
}

// Create ambient light
function createAmbientLight() {
  ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // 0x111111 - 0xaaaaaa, 1 ; 0xffffff, 0.1 - 0.3; 0x404040
  scene.add(ambientLight);
}

/*function createAxes() {
  const axes = new THREE.AxesHelper(10);
  scene.add(axes);
}*/

function createPlane() {
	// create geometry
	const geometry = new THREE.PlaneGeometry(100, 80);
	// create material
	const material = new THREE.MeshLambertMaterial({ color: 0x4f7253, side: THREE.DoubleSide });
	// create mesh by combining geometry and material
	plane = new THREE.Mesh(geometry, material);
	// set plane position by moving and rotating
	plane.rotation.x = -0.5 * Math.PI;
	plane.position.x = 0;
	plane.position.y = 0;
	plane.position.z = 0;
	// make the plane receive shadows from other objects
	plane.receiveShadow = true; // Enable shadow receiving for the ground plane
	// add plane to the scene
	scene.add(plane);
  }

// Create tree components
function createTrunk() {   //TRUNKCODE
  const geometry = new THREE.CylinderGeometry(1, 1, 10, 8);
  const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown 
  trunk = new THREE.Mesh(geometry, material);
  trunk.position.x = 5;
  trunk.position.y = 5;
  trunk.position.z = 0;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  scene.add(trunk);
}

function createFountain() {
	const fountainGroup = new THREE.Group();
  
	// Create fountain base
	const baseGeometry = new THREE.CylinderGeometry(5, 5, 1, 32);
	const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
	const base = new THREE.Mesh(baseGeometry, baseMaterial);
	base.position.set(0, 0.5, -10); // Adjust the position as needed
	base.castShadow = true;
	base.receiveShadow=true;
  
	// Create fountain water
	const waterGeometry = new THREE.CylinderGeometry(4.5, 0, 1, 32);
	const waterMaterial = new THREE.MeshLambertMaterial({ color: 0x87CEEB }); // Light blue
	const water = new THREE.Mesh(waterGeometry, waterMaterial);
	water.position.set(0, 1, -10); // Adjust the position as needed
	water.castShadow = true;
	water.receiveShadow = true;
  
	// Add base and water to the group
	fountainGroup.add(base);
	fountainGroup.add(water);
   fountainGroup.position.set(10, 0, 32);
	scene.add(fountainGroup);
  }
  

function createLeaves() { //LEAVESCODE
  const geometry = new THREE.SphereGeometry(5, 16, 16);
  const material = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Green color
  leaves = new THREE.Mesh(geometry, material);
  leaves.position.x =5;
  leaves.position.y = 15;
  leaves.position.z = 0;
  leaves.castShadow = true;
  leaves.receiveShadow = true;
  scene.add(leaves);
}
// Create a pine tree

  
  
  
  
  // Create a palm tree
  function createPalmTree() {
	const palmGroup = new THREE.Group();
  
	// Create the trunk
	const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 8); // Adjust the size as needed
	const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown color
	const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
	trunk.position.set(15, 5, 0); // Adjust the position of the trunk
	trunk.castShadow = true;
	trunk.receiveShadow = true;
	palmGroup.add(trunk);
  
	// Create the palm leaves (simple geometry for demonstration)
	const leavesGeometry = new THREE.ConeGeometry(5, 10, 8); // Adjust the size as needed
	const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Green color
	const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
	leaves.position.set(15, 15, 0); // Adjust the position of the leaves
	leaves.castShadow = true;
	leaves.receiveShadow=true;
	palmGroup.add(leaves);
    palmGroup.position.set(-5,0,-10);
	// Add the palm tree group to the scene
	scene.add(palmGroup);
  }
  
  
  




  
function createHouse() {
	
  
	// Create walls
	const wallGeometry = new THREE.BoxGeometry(10, 5, 10);
	const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xFF5733 }); // Orange color
	const walls = new THREE.Mesh(wallGeometry, wallMaterial);
	walls.position.set(0, 2.5, 10); // Adjust the position as needed
	walls.castShadow = true;
  
	// Create roof
	const roofGeometry = new THREE.ConeGeometry(7, 5, 4);
	const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x964B00 }); // Brown color
	const roof = new THREE.Mesh(roofGeometry, roofMaterial);
	roof.position.set(0, 7.5, 10); // Adjust the position as needed
	roof.rotation.set(0, Math.PI / 4, 0); // Rotate 45 degrees to align corners
	roof.scale.set(1.414, 1, 1.414); // Scale to match the square's diagonal

	roof.castShadow = true;
	roof.receiveShadow=true;
  
	// Create windows (you can add more windows as needed)
	const windowGeometry = new THREE.BoxGeometry(1, 2, 2);
	const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87CEEB }); // Light blue color
  
	const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
	window1.position.set(-5.5, 2.5,13); // Adjust the position as needed
	window1.castShadow = true;
  
	const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
	window2.position.set(-5.5, 2.5, 7); // Adjust the position as needed
	window2.castShadow = true;
	walls.receiveShadow = true;
	window1.receiveShadow = true;
	window2.receiveShadow = true;
		// Add house components to the group
	scene.add(walls);
	scene.add(roof);
	scene.add(window1);
	scene.add(window2);
  
	

	
  }

  function createFlower() {
	const flowerGroup = new THREE.Group();
  
	// Create flower stem
	const stemGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 8);
	const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Green color
	const stem = new THREE.Mesh(stemGeometry, stemMaterial);
	stem.position.set(0, 2.5,0); // Adjust the Z-axis position as needed
	stem.castShadow = true;
	stem.receiveShadow = true;
	flowerGroup.add(stem);
  

	// Create flower petals
	const petalGeometry = new THREE.SphereGeometry(1, 16, 16);
	const petalMaterial = new THREE.MeshLambertMaterial({ color: 0xFF1493 }); // Pink color
  
	for (let i = 0; i < 6; i++) {
	  const petal = new THREE.Mesh(petalGeometry, petalMaterial);
	  const angle = (i / 6) * Math.PI * 2;
	  const radius = 1.5;
	  const x = radius * Math.cos(angle);
	  const z = radius * Math.sin(angle);
	  petal.position.set(x, 4, z);
	  petal.rotation.x = Math.PI / 2; // Rotate to face up
	  petal.castShadow = true;
	  petal.receiveShadow = true;
	  flowerGroup.add(petal);

	}
  flowerGroup.position.set(0, 0, 0); // Adjust the position as needed
	flowerGroup.receiveShadow = true;
	scene.add(flowerGroup);
  }

  function createFlower2() {
	const flowerGroup = new THREE.Group();
  
	// Create flower stem
	const stemGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 8);
	const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Green color
	const stem = new THREE.Mesh(stemGeometry, stemMaterial);
	stem.position.set(0, 2.5,0); // Adjust the Z-axis position as needed
	stem.castShadow = true;
	stem.receiveShadow=true;
	flowerGroup.add(stem);
  

	// Create flower petals
	const petalGeometry = new THREE.SphereGeometry(1, 16, 16);
	const petalMaterial = new THREE.MeshLambertMaterial({ color: 0xffff }); // Pink color
  
	for (let i = 0; i < 6; i++) {
	  const petal = new THREE.Mesh(petalGeometry, petalMaterial);
	  const angle = (i / 6) * Math.PI * 2;
	  const radius = 1.5;
	  const x = radius * Math.cos(angle);
	  const z = radius * Math.sin(angle);
	  petal.position.set(x, 4, z);
	  petal.rotation.x = Math.PI / 2; // Rotate to face up
	  petal.castShadow = true;
	  petal.receiveShadow = true;
	  flowerGroup.add(petal);
	}
  flowerGroup.position.set(-15, 0, 2); // Adjust the position as needed
	flowerGroup.receiveShadow = true;
	scene.add(flowerGroup);

  }

  // Create a table
function createTable() {
	const tableGroup = new THREE.Group();
  
	// Create the table surface
	const tableSurfaceGeometry = new THREE.BoxGeometry(10, 1, 6);
	const tableSurfaceMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
	const tableSurface = new THREE.Mesh(tableSurfaceGeometry, tableSurfaceMaterial);
	tableSurface.position.set(0, 0.5, 0);
	tableSurface.castShadow = true;
	
	// Create table legs
	const legGeometry = new THREE.BoxGeometry(1, 5, 1);
	const legMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
	const leg1 = new THREE.Mesh(legGeometry, legMaterial);
	const leg2 = new THREE.Mesh(legGeometry, legMaterial);
	const leg3 = new THREE.Mesh(legGeometry, legMaterial);
	const leg4 = new THREE.Mesh(legGeometry, legMaterial);
	leg1.castShadow = true;
	leg2.castShadow = true;
	leg3.castShadow = true;
	leg4.castShadow = true;
	leg1.receiveShadow = true;
	leg2.receiveShadow = true;
	leg3.receiveShadow = true;
	leg4.receiveShadow = true;

  
	leg1.position.set(-4, -2.5, 2);
	leg2.position.set(4, -2.5, 2);
	leg3.position.set(-4, -2.5, -2);
	leg4.position.set(4, -2.5, -2);
  
	tableGroup.add(tableSurface);
	tableGroup.add(leg1);
	tableGroup.add(leg2);
	tableGroup.add(leg3);
	tableGroup.add(leg4);
	tableGroup.receiveShadow = true;
	scene.add(tableGroup);
	tableGroup.position.set (-15,5,-14);
	
  }

  // Create a realistic bench
// Create a realistic bench with correct leg placement
function createBench() {
	const benchGroup = new THREE.Group();
  
	// Create the bench seat
	const seatGeometry = new THREE.BoxGeometry(12, 1, 3);
	const seatMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
	const seat = new THREE.Mesh(seatGeometry, seatMaterial);
	seat.position.set(15, 2, 0);
	seat.castShadow = true;
  
	// Create bench legs
	const legGeometry = new THREE.BoxGeometry(1, 2, 1);
	const legMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
  
	// Create and position the legs correctly under the bench seat
	const leg1 = new THREE.Mesh(legGeometry, legMaterial);
	leg1.position.set(14.5, 1, 1);
	leg1.castShadow = true;
  
	const leg2 = new THREE.Mesh(legGeometry, legMaterial);
	leg2.position.set(14.5, 1, -1);
	leg2.castShadow = true;
  
	const leg3 = new THREE.Mesh(legGeometry, legMaterial);
	leg3.position.set(15.5, 1, 1);
	leg3.castShadow = true;
  
	const leg4 = new THREE.Mesh(legGeometry, legMaterial);
	leg4.position.set(15.5, 1, -1);
	leg4.castShadow = true;
	leg1.receiveShadow = true;
	leg2.receiveShadow = true;
	leg3.receiveShadow = true;
	leg4.receiveShadow = true;
  
	benchGroup.add(seat);
	benchGroup.add(leg1);
	benchGroup.add(leg2);
	benchGroup.add(leg3);
	benchGroup.add(leg4);
	benchGroup.receiveShadow = true;
	benchGroup.position.set(-30, 0, -5);
	scene.add(benchGroup);
  }
  
  
  
  

  
  
 
  // Create a car
  function createCar() {
	const carGroup = new THREE.Group();
  
	// Create car body
	const bodyGeometry = new THREE.BoxGeometry(10, 2, 4);
	const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x0077ff });
	const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
	body.position.set(0, 1, 0);
	body.castShadow = true; 
	body.receiveShadow=true; // Enable shadow casting for the car body
	carGroup.add(body);
  
	// Create car roof
	const roofGeometry = new THREE.BoxGeometry(6, 2, 3);
	const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
	const roof = new THREE.Mesh(roofGeometry, roofMaterial);
	roof.position.set(0, 3, 0);
	roof.castShadow = true; // Enable shadow casting for the car roof
	carGroup.add(roof);
  
	// Create car wheels
	const wheelGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 16);
	const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
	const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	const rearLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	const rearRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  
	frontLeftWheel.position.set(-3, 0, 2.5);
	frontRightWheel.position.set(3, 0, 2.5);
	rearLeftWheel.position.set(-3, 0, -2.5);
	rearRightWheel.position.set(3, 0, -2.5);
  
	frontLeftWheel.rotation.x = Math.PI / 2;
	frontRightWheel.rotation.x = Math.PI / 2;
	rearLeftWheel.rotation.x = Math.PI / 2;
	rearRightWheel.rotation.x = Math.PI / 2;
  
	frontLeftWheel.castShadow = true;
	frontRightWheel.castShadow = true;
	rearLeftWheel.castShadow = true;
	rearRightWheel.castShadow = true;
  
	frontLeftWheel.receiveShadow=true;
	rearLeftWheel.receiveShadow=true;
	rearRightWheel.receiveShadow=true;
	frontRightWheel.receiveShadow=true;

	
	carGroup.add(frontLeftWheel);
	carGroup.add(frontRightWheel);
	carGroup.add(rearLeftWheel);
	carGroup.add(rearRightWheel);
	carGroup.scale.set(1, 1, 1); // Ensure uniform scale

	carGroup.position.set (-18,2,10);;
	carGroup.receiveShadow = true;
	scene.add(carGroup);
  }

  function createFence() {
	const fenceGroup = new THREE.Group();
  
	// Create fence posts
	const postGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);
	const postMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
	const numberOfPosts = 10; // Adjust the number of posts as needed
  
	for (let i = 0; i < numberOfPosts; i++) {
	  const post = new THREE.Mesh(postGeometry, postMaterial);
	  post.position.set(i * 2 - 10, 2.5, 30); // Adjust the positions as needed
	  post.castShadow = true;
	  post.receiveShadow=true;
	  fenceGroup.add(post);
	}
  
	// Create fence rails
	const railGeometry = new THREE.BoxGeometry(20, 0.5, 0.5);
	const railMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
	const numberOfRails = 5; // Adjust the number of rails as needed
  
	for (let i = 0; i < numberOfRails; i++) {
	  const rail = new THREE.Mesh(railGeometry, railMaterial);
	  rail.position.set(0, i * 2, 30); // Adjust the positions as needed
	  rail.castShadow = true;
	  fenceGroup.add(rail);
	}

  
	fenceGroup.castShadow=true;
	fenceGroup.rotation.y = Math.PI/4;
	fenceGroup.position.set(-21, 0.5, -32);
	fenceGroup.receiveShadow = true;
	scene.add(fenceGroup);
	
  }
  

  // Create a 3D well
/*function createWell() {
	const wellGroup = new THREE.Group();
  
	// Create the well base (cylinder)
	const baseGeometry = new THREE.CylinderGeometry(5, 5, 5, 32);
	const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
	const base = new THREE.Mesh(baseGeometry, baseMaterial);
	base.castShadow = true;
  
	// Create the well walls (cylinder)
	const wallGeometry = new THREE.CylinderGeometry(5, 4.5, 9, 32);
	const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xbb001e }); // Brown
	const wellWalls = new THREE.Mesh(wallGeometry, wallMaterial);
	wellWalls.position.y = 5; // Adjust the height of the walls
	wellWalls.castShadow = true;
  
	// Create the well roof (conical roof)
	const roofGeometry = new THREE.ConeGeometry(6, 2, 32);
	const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x964B00 }); // Brown
	const wellRoof = new THREE.Mesh(roofGeometry, roofMaterial);
	wellRoof.position.y = 10; // Adjust the height of the roof
	wellRoof.castShadow = true;
  
	wellGroup.add(base);
	wellGroup.add(wellWalls);
	wellGroup.add(wellRoof);
  
	// Position the well in the scene
	wellGroup.position.set( 20, 0, 2); // Adjust the position as needed
	// Add the well to the scene
	scene.add(wellGroup);
  }
  
  

*/
function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(mainContainer.clientWidth, mainContainer.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.shadowMap.enabled = true;
  // choose shadow type
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap

  mainContainer.appendChild(renderer.domElement);
}

// Animations
function update() {}

function init() {
  // https://threejs.org/docs/index.html#manual/en/introduction/Color-management
  THREE.ColorManagement.enabled = true;

  // Create scene
  createScene();

  // FPS counter
  createStats();

  // Create camera:
  createPerspectiveCamera();

  // Create interactive controls:
  createControls();

  // Create lights:
  createDirectionalLight();
  // createSpotLight();
  // createAmbientLight();

  // Create meshes and other visible objects:
  //createAxes(); // add axes (red – x, green – y, blue - z)
  createPlane();

  // Add the tree components
  createTrunk();
  createLeaves();
 // Add the house
 createHouse();
 createBench();
 createTable();
 createFlower();
 createFlower2();
 createCar();
 createPalmTree();
//createWell();
 createFence();
 createFountain();
 
  // Render elements
  createRenderer();

  // Create animations
  renderer.setAnimationLoop(() => {
    update();
    stats.begin();
    renderer.render(scene, camera);
    stats.end();
  });
}

init();

// Auto resize window
window.addEventListener('resize', (e) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
