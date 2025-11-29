import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {TextureLoader} from 'three';




let scene, canvas, camera, renderer, controls;

let floor, floorMaterial, skyColor = 0x000001;

let deskMaterials, deskSideMaterials, deskTopTexture, deskFrontTexture, deskSideOutTexture, deskSideInTexture, deskFloorMaterials;

let desk, leftSide, rightSide, deskFloor; 

let geometry;

let bulbLight, cylinder;

let bulbMat;

let earth, plant;

let sunlight;

let raycaster, pointer, plane;

let boxCollinder;

let play;

let objects = [], cardboardList = [], shadowList = [], cardboardBoxList = [];

let isPlaced = true;

let emisiveColor = new THREE.Color(0xffee88);

let addBlock;

let earthList = [], plantList = [];

const params = {
  shadows: true,
  exposure: 1,
  bulbPower: 500000,
  hemiIrradiance: 1
};


init();
function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 65, 80);


  canvas = document.getElementById('cvs');
  
  // Disable page scrolling
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
  });
  renderer.setClearColor(skyColor, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = params.exposure; 
  renderer.shadowMap.enabled = params.shadows;
  


  // red green blue | x y z 
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  geometry = new THREE.BoxGeometry();

  //Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI / 2.2;
  controls.minPolarAngle = Math.PI / 8;
  controls.rotateSpeed = 0.4; 
  controls.maxDistance = 100;
  controls.minDistance = 30;

  //Environement
  //Light
  const cylinderMaterial = new THREE.MeshBasicMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
  });
  cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 10, 25, 20, 32,1,true), cylinderMaterial);
  cylinder.position.set(0,65,0);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  scene.add( cylinder );
    const circle = new THREE.Mesh(
    new THREE.CircleGeometry(10, 32),
    new THREE.MeshBasicMaterial({ color: 0x555555})
  );
  circle.rotation.x = - Math.PI / 2;
  circle.position.set(0, 75, 0);
  scene.add(circle);

  const bulbGeometry = new THREE.SphereGeometry( 5, 16, 8 );
  bulbLight = new THREE.PointLight( 0xffee88, 1, 0, 2 );
  bulbLight.power = params.bulbPower;

  bulbMat = new THREE.MeshStandardMaterial( {
    emissive: emisiveColor,
    emissiveIntensity: 10,
    color: 0x000000
  } );
  bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
  bulbLight.position.set( 0, 65, 0 );
  bulbLight.castShadow = true;
  scene.add( bulbLight );

  const light = new THREE.HemisphereLight( 0xbbbbff, 0x444422, params.hemiIrradiance );
  light.position.set( 0, 65, 0 );
  scene.add( light );

  sunlight = new THREE.DirectionalLight(0xffffff, 10);
  sunlight.position.set(0, 200, 0);
  sunlight.castShadow = true;


  //Floor
  floorMaterial = new THREE.MeshStandardMaterial( { 
    color: 0x8B4513,
    roughness: 0.8,
    metalness: 0.1,
    bumpScale: 0.3
  } );
  floor = new THREE.Mesh( geometry, floorMaterial );
  floor.scale.set(2000,1,2000);
  floor.position.set(0,-104,0);
  floor.receiveShadow = true;
  scene.add( floor );

  //Desktop
  deskTopTexture = new THREE.MeshStandardMaterial({ 
    color: 0xe6ccb2,
    roughness: 0.7,
    metalness: 0.2,
    bumpScale: 1
  });
  deskFrontTexture = new THREE.MeshStandardMaterial({ 
    color: 0xddb892,
    roughness: 0.7,
    metalness: 0.2,
    bumpScale: 1
  });
  deskSideOutTexture = new THREE.MeshStandardMaterial({ 
    color: 0xb08968,
    roughness: 0.7,
    metalness: 0.2,
    bumpScale: 1
  });
  deskSideInTexture = new THREE.MeshStandardMaterial({ 
    color: 0x7f5539,
    roughness: 0.7,
    metalness: 0.2,
    bumpScale: 1
  });

  //Top Plank
  deskMaterials = [
    deskSideOutTexture, // right
    deskSideOutTexture, // left
    deskTopTexture,     // top
    deskSideInTexture,     // bottom
    deskFrontTexture, // front
    deskFrontTexture  // back
  ];
  desk = new THREE.Mesh(geometry, deskMaterials);
  desk.scale.set(100,5,100);
  desk.position.set(0,-2.5,0);
  desk.castShadow = true;
  scene.add( desk );

  plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ visible: false }) );
  plane.scale.set(1000,1,1000);
  plane.position.set(0,-2.5,0);
  plane.receiveShadow = true;
  plane.castShadow = true;
  scene.add( plane );
  objects.push( plane );

  //Side Planks
  deskSideMaterials = [
    deskSideOutTexture, // right
    deskSideOutTexture, // left
    deskTopTexture,     // top
    deskSideInTexture,     // bottom
    deskFrontTexture, // front
    deskFrontTexture  // back
  ];
  leftSide = new THREE.Mesh( geometry, deskSideMaterials );
  leftSide.scale.set(5,100,100);
  leftSide.position.set(-47.5,-55,0);
  leftSide.castShadow = true;
  scene.add(leftSide);

  rightSide = new THREE.Mesh( geometry, deskSideMaterials );
  rightSide.scale.set(5,100,100);
  rightSide.position.set(47.5,-55,0);
  rightSide.castShadow = true;
  scene.add(rightSide);

  //Floor Plank
  deskFloorMaterials = new THREE.MeshBasicMaterial({ color: 0x8B4514 });
  deskFloor = new THREE.Mesh( geometry, deskFloorMaterials );
  deskFloor.scale.set(140,1,140);
  deskFloor.position.set(0,-103,0);
  //scene.add(deskFloor);



  //RayCaster and Pointer
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  //Box Collinder
  boxCollinder = new THREE.Box3();
  window.addEventListener( 'pointermove', onPointerMove );
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener( 'resize', onWindowResize );
  onWindowResize();

}

function addBlockButton() {
    addBlock = document.createElement("addButton");
    addBlock.style.position = "absolute";
    addBlock.style.top = `10%`;
    addBlock.style.right = "10%";
    addBlock.style.padding = "10px 20px";
    addBlock.style.fontSize = "16px";
    addBlock.style.borderRadius = "8px";
    addBlock.style.border = "none";
    addBlock.style.background = "#28a745";
    addBlock.style.color = "#fff";
    addBlock.style.cursor = "pointer";
    addBlock.style.fontFamily = "Avenir, sans-serif";
    addBlock.innerHTML = `Add Block`;
    addBlock.style.visibility = 'visible';
    
    document.body.appendChild(addBlock);

    addBlock.addEventListener("click", () => {
      isPlaced = false;
      addBlock.style.visibility = 'hidden';
      addCardboardBlock();
    });
}

function indicationText() {
  const indication = document.createElement("indicationText");
  indication.style.position = "fixed";
  indication.style.bottom = "30px";
  indication.style.left = "50%";
  indication.style.transform = "translateX(-50%)";
  indication.style.padding = "10px 20px";
  indication.style.fontSize = "16px";
  indication.style.borderRadius = "8px";
  indication.style.border = "none";
  indication.style.background = "rgba(0, 0, 0, 0.5)";
  indication.style.color = "#fff";
  indication.style.fontFamily = "Avenir, sans-serif";
  indication.style.zIndex = "9999";
  indication.innerHTML = `Use mouse to move the block. Press 'Space' to place it, 'R' to rotate.`;

  document.body.appendChild(indication);
}
indicationText();

addBlockButton();

function nightModeButton() {
    const nightMode = document.createElement("nightButton");
    nightMode.style.position = "absolute";
    nightMode.style.top = `10%`;
    nightMode.style.left = "10%";
    nightMode.style.padding = "10px 20px";
    nightMode.style.fontSize = "16px";
    nightMode.style.borderRadius = "8px";
    nightMode.style.border = "none";
    nightMode.style.background = "#343a40";
    nightMode.style.color = "#fff";
    nightMode.style.cursor = "pointer";
    nightMode.style.fontFamily = "Avenir, sans-serif";
    nightMode.innerHTML = `<span id="nightModeText">Day Mode</span>`;

    document.body.appendChild(nightMode);

    nightMode.addEventListener("click", () => {
      if(skyColor == 0x87ceeb){
        skyColor = 0x000001;
      //params.shadows = false;
        params.exposure = 1;
        params.bulbPower = 50000;
        params.hemiIrradiance = 0;
        console.log('night');
        scene.remove(sunlight);
        scene.remove(deskFloor);
        emisiveColor = new THREE.Color(0xffee88);
        document.getElementById("nightModeText").innerText = "Day Mode";
      }
      else{
        skyColor = 0x87ceeb;
        params.shadows = true;
        params.exposure = 1;
        params.bulbPower = 0;
        scene.add(sunlight);
        scene.add(deskFloor);
        emisiveColor = new THREE.Color(0x000000);
        document.getElementById("nightModeText").innerText = "Night Mode";
      }
      renderer.setClearColor(skyColor, 1);
      renderer.shadowMap.enabled = params.shadows;
      renderer.toneMappingExposure = params.exposure;
      bulbLight.power = params.bulbPower;

      render();
    });
  }
//nightModeButton();

function onPointerMove( event ) {

  pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

  raycaster.setFromCamera( pointer, camera );

  const intersects = raycaster.intersectObjects( objects, false );
  if(!isPlaced){

  if ( intersects.length > 0 && !isPlaced && cardboardList.length > 0 ) {
    

    const intersect = intersects[ 0 ];

    // Clamp the cardboard position within desk boundaries
    const deskMinX = -40;
    const deskMaxX = 40;
    const deskMinZ = -40;
    const deskMaxZ = 40;

    cardboardList[cardboardList.length - 1].position.x = Math.max(deskMinX, Math.min(deskMaxX, intersect.point.x));
    cardboardList[cardboardList.length - 1].position.z = Math.max(deskMinZ, Math.min(deskMaxZ, intersect.point.z));
    
    const cardboardPosition = cardboardList[cardboardList.length - 1].position;
    const coef = 35;

    shadowList[shadowList.length - 1].position.copy( new THREE.Vector3(cardboardPosition.x + cardboardPosition.x/coef, 0.1, cardboardPosition.z + cardboardPosition.z/coef) );
    
    if(cardboardList.length > 1){
      boxCollinder.setFromObject(cardboardList[cardboardList.length - 1], true);
      let maxY = 0;
      let hasIntersection = false;
      
      for (let i = 0; i < cardboardBoxList.length; i++){  
        if(boxCollinder.intersectsBox(cardboardBoxList[i])){
          hasIntersection = true;
          const intersectingBoxY = cardboardList[i].position.y;
          const intersectingBoxHeight = 3; // Adjust based on your box height
          const newY = intersectingBoxY + intersectingBoxHeight;
          if(newY > maxY){
            maxY = newY;
          }
        }
      }
      
      if(hasIntersection){
        cardboardList[cardboardList.length - 1].position.y = maxY;
      } else {
        cardboardList[cardboardList.length - 1].position.y = 0;
      }


    }
      earthList[earthList.length - 1].position.y = cardboardList[cardboardList.length - 1].position.y + 0.1;
      earthList[earthList.length - 1].position.x = cardboardList[cardboardList.length - 1].position.x;
      earthList[earthList.length - 1].position.z = cardboardList[cardboardList.length - 1].position.z;

      plantList[plantList.length - 1].position.x = cardboardList[cardboardList.length - 1].position.x;
      plantList[plantList.length - 1].position.z = cardboardList[cardboardList.length - 1].position.z;
      plantList[plantList.length - 1].position.y = cardboardList[cardboardList.length - 1].position.y + 2.8;
    

    render();
    }
  }

}

function onWindowResize(event) {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}

function playButton() {
    play = document.createElement("playButton");
    play.style.position = "absolute";
    play.style.top = `10%`;
    play.style.left = "50%";
    play.style.transform = "translateX(-50%)";
    play.style.padding = "10px 20px";
    play.style.fontSize = "16px";
    play.style.borderRadius = "8px";
    play.style.border = "none";
    play.style.background = "#007bff";
    play.style.color = "#fff";
    play.style.cursor = "pointer";
    play.style.fontFamily = "Avenir, sans-serif";
    play.innerHTML = `Play`;

    document.body.appendChild(play);

    play.addEventListener("click", () => {
      if(play.innerHTML == 'Play'){
        for(let i = 0; i < earthList.length; i++){
        scene.add( earthList[i] );
        scene.add( plantList[i] );
        }
      play.innerHTML = `Construction`;
      addBlock.style.visibility = 'hidden';
      }
      else{
        for(let i = 0; i < earthList.length; i++){
          scene.remove( earthList[i] );
          scene.remove( plantList[i] );
        }
        play.innerHTML = `Play`;
        if(isPlaced){
          addBlock.style.visibility = 'visible';
        }
      }
      if(skyColor == 0x87ceeb){
        skyColor = 0x000001;
      //params.shadows = false;
        params.exposure = 1;
        params.bulbPower = 50000;
        params.hemiIrradiance = 0;
        scene.remove(sunlight);
        scene.remove(deskFloor);
        emisiveColor = new THREE.Color(0xffee88);
      }
      else{
        skyColor = 0x87ceeb;
        params.shadows = true;
        params.exposure = 1;
        params.bulbPower = 0;
        scene.add(sunlight);
        scene.add(deskFloor);
        emisiveColor = new THREE.Color(0x000000);
      }
      renderer.setClearColor(skyColor, 1);
      renderer.shadowMap.enabled = params.shadows;
      renderer.toneMappingExposure = params.exposure;
      bulbLight.power = params.bulbPower;

      render();
    });
}

playButton();

//Helper to print log
function onKeyDown (event) {
    if (event.code === 'Space') {
      if(!isPlaced){
        

        isPlaced = true;
        const boxCollinder = new THREE.Box3();
        boxCollinder.setFromObject(cardboardList[cardboardList.length - 1],true);
        cardboardBoxList.push(boxCollinder);
        addBlock.style.visibility = 'visible';

      }
      else{
        isPlaced = false;
      }
      
    }
    if(event.code === 'KeyR'){
      if(cardboardList.length > 0 && !isPlaced){
        cardboardList[cardboardList.length - 1].rotation.z += Math.PI / 4;
        shadowList[shadowList.length - 1].rotation.y += Math.PI / 4;
        earthList[earthList.length - 1].rotation.y += Math.PI / 4;
        plantList[plantList.length - 1].rotation.y += Math.PI / 4;
        boxCollinder.setFromObject(cardboardList[cardboardList.length - 1], true);
      }
    } 
    if(event.code === 'KeyC'){
      //console.log('objects:', objects);
      controls.maxPolarAngle = Math.PI;
      controls.minPolarAngle = -Math.PI ;
      controls.maxDistance = 1000;
      controls.minDistance = 0;
    }
    render();
}; 

async function addCardboardBlock(){
  const loader = new OBJLoader();
  const object = await loader.loadAsync( 'ressources/obj/Box.obj' );
  object.scale.set(100,100,100);
  object.rotation.x = -Math.PI / 2;
  cardboardList.push(object);
  //on cree un rectangle arrondie
  const shadowGeometryR = new THREE.PlaneGeometry(6, 12);
  const shadowR = new THREE.Mesh(shadowGeometryR, new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0.5}));
  shadowR.rotation.x = -Math.PI / 2;
  shadowR.position.y = 0.1;
  // scene.add(shadowR);
  // shadowList.push(shadowR);

  const shadowGeometryCU = new THREE.CircleGeometry(3, 40);
  const shadowCU = new THREE.Mesh(shadowGeometryCU, new THREE.MeshBasicMaterial({color: 0x000000}));
  shadowCU.rotation.x = -Math.PI / 2;
  shadowCU.position.y = 0.1;
  shadowCU.position.z = shadowR.position.z + 6;
  // scene.add(shadowCU);
  // shadowUList.push(shadowCU);

  const shadowGeometryCD = new THREE.CircleGeometry(3, 40);
  const shadowCD = new THREE.Mesh(shadowGeometryCD, new THREE.MeshBasicMaterial({color: 0x000000}));
  shadowCD.rotation.x = -Math.PI / 2;
  shadowCD.position.z = shadowR.position.z - 6;
  shadowCD.position.y = 0.1;
  // scene.add(shadowCD);
  // shadowDList.push(shadowCD);

  const objectGroup = new THREE.Group();
  objectGroup.add(object);
  objectGroup.add(shadowR);
  objectGroup.add(shadowCU);
  objectGroup.add(shadowCD);

  shadowList.push(objectGroup);
  scene.add(objectGroup);



  //controls.enabled = false;
  scene.add( object );
  objects.push( object );

  const earthGroup = new THREE.Group();

  const geometryEarth = new THREE.BoxGeometry( 4, 2.5, 10 );
  const materialEarth = new THREE.MeshBasicMaterial( { color: 0x582900 } );
  earth = new THREE.Mesh( geometryEarth, materialEarth );
  earth.position.set(0,2,0);
  //scene.add( earth );

  const geometryEarthCircle = new THREE.ConeGeometry( 2, 2.5, 32 );
  const coneT = new THREE.Mesh(geometryEarthCircle, materialEarth );
  coneT.rotation.x = Math.PI;
  coneT.position.set(0,2,-5);
  //scene.add( coneT );

  const coneB = new THREE.Mesh(geometryEarthCircle, materialEarth );
  coneB.rotation.x = Math.PI;
  coneB.position.set(0,2,5);
  //scene.add( coneB );

  earthGroup.add( earth );
  earthGroup.add( coneT );
  earthGroup.add( coneB );

  earthList.push(earthGroup);

  const plantGroup = new THREE.Group();

  // Create grass blades on a 4x10 surface
  const grassGeometry = new THREE.ConeGeometry(0.3, 1, 4);
  const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });

  for (let x = -1.6; x <= 1.7; x += 0.3) {
    for (let z = -6.5; z <= 6.5; z += 0.3) {
      const grassBlade = new THREE.Mesh(grassGeometry, grassMaterial);
      grassBlade.position.set(
        x + (Math.random() - 0.5) * 0.2,
        Math.random() * 0.5 + 0.5,
        z + (Math.random() - 0.5) * 0.2
      );
      grassBlade.rotation.x = (Math.random() - 0.2) * 0.2;
      grassBlade.rotation.z = (Math.random() - 0.2) * 0.2;
      grassBlade.scale.y = Math.random() * 0.5 + 0.5;
      plantGroup.add(grassBlade);
    }
  }
  plantGroup.position.set(0,2.5,0);

  plant = plantGroup;
  plantList.push(plant);
}

function render(){
  renderer.render(scene, camera);
} 


function animate() {
  requestAnimationFrame( animate );
  controls.update();
  render(); 
}
animate();