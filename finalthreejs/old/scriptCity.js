// script.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

let scene, camera, renderer, controls, clock;
let plantMeshes = [];
let cityGroundCircle = null; // Store the gray city ground
let ambientLight, dirLight; // Store lights to update them

init();
animate();

let level = 1;
let price = 1;
let productivity = 0;
let dollars = 0;
let _lastMoneyTick = performance.now();
const city = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let firstCity = false;

function init() {
  
  const canvas = document.getElementById("cvs");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfe3ff);
  scene.fog = new THREE.FogExp2(0xbfe3ff, 0.002);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );
  camera.position.set(40, 40, 70);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.minPolarAngle = 0; // Allow looking straight down
  controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below horizon (slightly above 90 degrees)
  controls.minDistance = 5; // Minimum zoom distance
  controls.maxDistance = 200; // Maximum zoom distance
  controls.update();

  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(60, 8, 100);
  dirLight.color.setHex(0xffcc88);
  dirLight.intensity = 1.2;
  dirLight.castShadow = true;
  scene.add(dirLight);  

  const groundGeo = new THREE.PlaneGeometry(200, 200);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x55aa55,
    side: THREE.DoubleSide
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  createSliders();

  generateVegetation();

  window.addEventListener("resize", onWindowResize);
  clock = new THREE.Clock();
}


// Model loading and level configuration
const modelCache = {};
const levelConfigurations = [
  { campfires: 1, shelters: 0, houses: 0, offices: 0, hotels: 0, skies: 0 }, // Level 1
  { campfires: 2, shelters: 0, houses: 0, offices: 0, hotels: 0, skies: 0 }, // Level 2
  { campfires: 3, shelters: 1, houses: 0, offices: 0, hotels: 0, skies: 0 }, // Level 3
  { campfires: 2, shelters: 3, houses: 0, offices: 0, hotels: 0, skies: 0 }, // Level 4
  { campfires: 1, shelters: 5, houses: 2, offices: 0, hotels: 0, skies: 0 }, // Level 5
  { campfires: 0, shelters: 4, houses: 6, offices: 0, hotels: 0, skies: 0 }, // Level 6
  { campfires: 0, shelters: 3, houses: 10, offices: 1, hotels: 0, skies: 0 }, // Level 7
  { campfires: 1, shelters: 2, houses: 15, offices: 3, hotels: 0, skies: 0 }, // Level 8
  { campfires: 0, shelters: 1, houses: 20, offices: 6, hotels: 1, skies: 0 }, // Level 9
  { campfires: 0, shelters: 0, houses: 25, offices: 10, hotels: 2, skies: 0 }, // Level 10
  { campfires: 0, shelters: 0, houses: 30, offices: 15, hotels: 4, skies: 1 }, // Level 11
  { campfires: 0, shelters: 0, houses: 30, offices: 18, hotels: 5, skies: 2 }, // Level 12
  { campfires: 0, shelters: 0, houses: 30, offices: 20, hotels: 6, skies: 3 }, // Level 13
  { campfires: 0, shelters: 0, houses: 32, offices: 22, hotels: 7, skies: 4 }, // Level 14
  { campfires: 0, shelters: 0, houses: 34, offices: 23, hotels: 7, skies: 4 }, // Level 15
  { campfires: 0, shelters: 0, houses: 36, offices: 24, hotels: 8, skies: 5 }, // Level 16
  { campfires: 0, shelters: 0, houses: 38, offices: 25, hotels: 8, skies: 5 }, // Level 17
  { campfires: 0, shelters: 0, houses: 40, offices: 26, hotels: 9, skies: 6 }, // Level 18
  { campfires: 0, shelters: 0, houses: 42, offices: 27, hotels: 9, skies: 6 }, // Level 19
  { campfires: 0, shelters: 0, houses: 44, offices: 28, hotels: 10, skies: 7 }, // Level 20
  { campfires: 0, shelters: 0, houses: 46, offices: 29, hotels: 11, skies: 8 }, // Level 21
  { campfires: 0, shelters: 0, houses: 48, offices: 30, hotels: 12, skies: 9 }, // Level 22
  { campfires: 0, shelters: 0, houses: 50, offices: 31, hotels: 13, skies: 10 }, // Level 23
  { campfires: 0, shelters: 0, houses: 52, offices: 32, hotels: 14, skies: 11 }, // Level 24
  { campfires: 0, shelters: 0, houses: 54, offices: 33, hotels: 15, skies: 12 }, // Level 25
  { campfires: 0, shelters: 0, houses: 56, offices: 34, hotels: 16, skies: 13 }, // Level 26
  { campfires: 0, shelters: 0, houses: 58, offices: 35, hotels: 17, skies: 14 }, // Level 27
  { campfires: 0, shelters: 0, houses: 60, offices: 36, hotels: 18, skies: 15 }, // Level 28
  { campfires: 0, shelters: 0, houses: 60, offices: 37, hotels: 19, skies: 16 }, // Level 29
  { campfires: 0, shelters: 0, houses: 60, offices: 40, hotels: 22, skies: 18 }  // Level 30
];

async function loadModel(type) {
  if (modelCache[type]) return modelCache[type].clone();
  
  const mtlLoader = new MTLLoader();
  const objLoader = new OBJLoader();
  
  try {
    const materials = await new Promise((resolve, reject) => {
      mtlLoader.load(`../finalthreejs/ressources/tex/${type}.mtl`, resolve, undefined, reject);
    });
    
    materials.preload();
    objLoader.setMaterials(materials);
    
    const object = await new Promise((resolve, reject) => {
      objLoader.load(`../finalthreejs/ressources/${type}.obj`, resolve, undefined, reject);
    });
    
    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    modelCache[type] = object;
    return object.clone();
  } catch (error) {
    console.error(`Error loading ${type}:`, error);
    return null;
  }
}

function getRandomPositions(count, centerPos, customRadius = null, buildingType = null) {
  const positions = [];
  const groundSize = 200;
  const groundLimit = groundSize / 2 - 10; // keep margin from the edge

  // City radius progression (matches city ground visual)
  const maxRadius = 80;
  const minRadius = 15;
  const maxLevel = 30;
  let radius = customRadius !== null ? customRadius :
    minRadius + (maxRadius - minRadius) * (Math.min(level, maxLevel) / maxLevel);

  // Per-type minimum clearance (footprint radius approx)
  const getMinDist = (t) => {
    switch (t) {
      case 'sky': return 40;
      case 'office':
      case 'hotel': return 25;
      case 'house':
      case 'medieval_house':
      case 'shelter': return 15;
      case 'campfire': return 10;
      default: return 35;
    }
  };
  let minDistanceBetweenBuildings = getMinDist(buildingType);

  // Existing building positions
  const existingPositions = city.filter(c => c.position).map(c => c.position);

  // Greedy candidate sampling with radius expansion and slight backoff on minDist
  let rounds = 0;
  const maxRounds = 18;
  while (positions.length < count && rounds < maxRounds) {
    rounds++;
    const needed = count - positions.length;
    const candidates = Math.max(800, needed * 800); // denser sampling

    for (let i = 0; i < candidates && positions.length < count; i++) {
      // Uniform sample in disk (sqrt for uniform radial density)
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      let x = centerPos.x + Math.cos(angle) * r;
      let z = centerPos.z + Math.sin(angle) * r;

      // Keep inside ground bounds
      if (Math.abs(x) > groundLimit || Math.abs(z) > groundLimit) continue;

      const testPos = new THREE.Vector3(x, 0, z);

      // Check against existing buildings
      let ok = true;
      for (let e of existingPositions) {
        if (testPos.distanceTo(e) < minDistanceBetweenBuildings) { ok = false; break; }
      }
      if (!ok) continue;

      // Check against positions chosen in this batch
      for (let p of positions) {
        if (testPos.distanceTo(p) < minDistanceBetweenBuildings) { ok = false; break; }
      }
      if (!ok) continue;

      positions.push(testPos);
    }

    if (positions.length < count) {
      // Expand search radius up to the ground limit, then slightly relax spacing
      if (radius < groundLimit - 5) {
        radius = Math.min(groundLimit - 5, radius * 1.2);
      } else {
        // Relax spacing gradually if we've already hit the bounds
        minDistanceBetweenBuildings *= 0.9; // 10% relax per round at bounds
      }
    }
  }

  return positions;
}

function updateCityGround() {
  // Remove old city ground if it exists
  if (cityGroundCircle) {
    scene.remove(cityGroundCircle);
  }
  
  // Calculate city radius based on level
  const maxRadius = 95;
  const minRadius = 30;
  const maxLevel = 30;
  const cityRadius = minRadius + (maxRadius - minRadius) * (Math.min(level, maxLevel) / maxLevel);
  
  // Create thick gray cylinder for city ground (like a concrete slab)
  const thickness = 0.1; // Thickness is 10% of the radius
  const groundGeo = new THREE.CylinderGeometry(cityRadius, cityRadius, thickness, 64);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x666666,
    roughness: 0.9,
    metalness: 0.1
  });
  cityGroundCircle = new THREE.Mesh(groundGeo, groundMat);
  cityGroundCircle.position.y = thickness / 2; // Position so top is at ground level
  cityGroundCircle.receiveShadow = true;
  cityGroundCircle.castShadow = true;
  cityGroundCircle.position.x = groundHit.point.x;
  cityGroundCircle.position.z = groundHit.point.z;
  scene.add(cityGroundCircle);
}

function updateLighting() {
  // Progressive darkening as levels increase
  const maxLevel = 30;
  const progress = Math.min(level, maxLevel) / maxLevel;
  
  // Ambient light: starts at 0.5, decreases to 0.15 at max level
  const ambientIntensity = 0.5 - (progress * 0.35);
  ambientLight.intensity = ambientIntensity;
  
  // Directional light: starts at 1.2, decreases to 0.4 at max level
  const dirIntensity = 1.2 - (progress * 0.8);
  dirLight.intensity = dirIntensity;
  
  // Sky color: transitions from bright blue to darker blue/gray
  const skyColor = new THREE.Color(0xbfe3ff).lerp(new THREE.Color(0x4a5a6a), progress * 0.7);
  scene.background = skyColor;
  scene.fog.color = skyColor;
}

async function updateCityLevel() {
  const config = levelConfigurations[Math.min(level - 1, levelConfigurations.length - 1)];
  
  // Update lighting based on level
  updateLighting();
  
  // Update the city ground circle based on level
  if (level> 4){
      updateCityGround();
  };
  console.log(city.filter(c => c.position).map(c => c.position));
  
  
  // Get the main position (center of the city or 0,0,0 if first time)
  const mainPos = city.length > 0 ? city[0].group.position : new THREE.Vector3(0, 0, 0);
  
  // Count existing buildings by type
  const existingCounts = {
    campfire: city.filter(c => c.type === 'campfire').length,
    medieval_house: city.filter(c => c.type === 'medieval house').length,
    house: city.filter(c => c.type === 'house').length,
    office: city.filter(c => c.type === 'office').length,
    hotel: city.filter(c => c.type === 'hotel').length,
    sky: city.filter(c => c.type === 'sky').length
  };
  
  // Calculate differences (how many to add or remove)
  const buildingTypes = [
    { type: 'campfire', modelName: 'campfire', target: config.campfires, current: existingCounts.campfire },
    { type: 'shelters', modelName: 'medieval_house', target: config.shelters, current: existingCounts.medieval_house },
    { type: 'houses', modelName: 'house', target: config.houses, current: existingCounts.house },
    { type: 'offices', modelName: 'office', target: config.offices, current: existingCounts.office },
    { type: 'hotels', modelName: 'hotel', target: config.hotels, current: existingCounts.hotel },
    { type: 'skies', modelName: 'sky', target: config.skies, current: existingCounts.sky }
  ];
  
  for (let buildingInfo of buildingTypes) {
    const diff = buildingInfo.target - buildingInfo.current;
    
    if (diff < 0) {
      // Remove excess buildings of this type
      const toRemove = Math.abs(diff);
      const buildingsOfType = city.filter(c => c.type === buildingInfo.modelName);
      for (let i = 0; i < toRemove && i < buildingsOfType.length; i++) {
        scene.remove(buildingsOfType[i].group);
        const index = city.indexOf(buildingsOfType[i]);
        if (index > -1) city.splice(index, 1);
      }
    } else if (diff > 0) {
      // Add new buildings of this type
      const newPositions = getRandomPositions(diff, mainPos, null, buildingInfo.modelName);
      
      for (let i = 0; i < diff; i++) {
        if (buildingInfo.modelName === 'campfire') {
          // Special handling for campfires
          createCampfireAt(newPositions[i]);
        } else {
          // Load and place other building types
          const model = await loadModel(buildingInfo.modelName);
          if (model) {
            // Clear area around building
            const clearRadius = 15;
            for (let j = plantMeshes.length - 1; j >= 0; j--) {
              const p = plantMeshes[j];
              if (p && p.position && p.position.distanceTo(newPositions[i]) < clearRadius) {
                scene.remove(p);
                plantMeshes.splice(j, 1);
              }
            }
            
            // Add to city array for tracking
            city.push({
              group: model,
              type: buildingInfo.modelName,
              position: newPositions[i].clone()
            });

            model.position.copy(newPositions[i]);
            
            // Scale buildings appropriately
            const scales = {
              medieval_house: 1.0,
              house: 0.5,
              office: 0.007,
              hotel: 0.3,
              sky: 0.9
            };
            const scale = scales[buildingInfo.modelName] || 1.0;
            model.scale.setScalar(scale);
            if (buildingInfo.modelName === 'office') {
             // model.position.y += 3; // Adjust office height
              model.rotation.x = - Math.PI / 2; // Rotate office by 90 degrees
            }

            scene.add(model);
          }
        }
      }
    }
    // If diff === 0, do nothing (keep existing buildings)
  }
}


// Money Display
const moneyDisplay = document.createElement("div");
moneyDisplay.style.position = "absolute";
moneyDisplay.style.top = "5%";
moneyDisplay.style.right = "5%";
moneyDisplay.style.background = "rgba(0,0,0,0.6)";
moneyDisplay.style.color = "#fff";
moneyDisplay.style.padding = "8px 12px";
moneyDisplay.style.borderRadius = "8px";
moneyDisplay.style.fontFamily = "sans-serif";
moneyDisplay.style.fontSize = "16px";
moneyDisplay.style.zIndex = "9999999999";
moneyDisplay.innerHTML = `💵 <span id="money-amt">$0.000</span><br>`;
document.body.appendChild(moneyDisplay);
const moneyAmtEl = document.getElementById("money-amt");

const sliderUI = Array.from(document.querySelectorAll("div")).find((d) =>
    d.querySelector("#water"));
if (sliderUI) {
    sliderUI.style.left = "5%"; // move sliders to the right so money HUD stays top-left
    sliderUI.style.top = "5%";
    sliderUI.style.zIndex = "9999";
}

function moneyTick() {
  const now = performance.now();
  const dt = (now - _lastMoneyTick) / 1000;
  _lastMoneyTick = now;
  dollars += 10000 * productivity * dt;
  moneyAmtEl.textContent = `${dollars.toFixed(2)}`;
  requestAnimationFrame(moneyTick);
}
_lastMoneyTick = performance.now();
requestAnimationFrame(moneyTick);

function createSliders() {
  const ui = document.createElement("div");
  ui.style.position = "absolute";
  ui.style.top = "5%";
  ui.style.left = "5%";
  ui.style.background = "rgba(255,255,255,0.8)";
  ui.style.padding = "10px";
  ui.style.borderRadius = "8px";
  ui.style.fontFamily = "sans-serif";
  ui.innerHTML = `
    <label>💧 Water <input id="water" type="range" min="0" max="1" step="0.01" value="0.6"></label><br>
    <label>☀️ Sun <input id="sun" type="range" min="0" max="1" step="0.01" value="0.6"></label><br>
    <label>🌡️ Temperature <input id="temp" type="range" min="0" max="1" step="0.01" value="0.5"></label><br>
    <label>💨 Humidity <input id="hum" type="range" min="0" max="1" step="0.01" value="0.6"></label>
  `;
  document.body.appendChild(ui);

  ui.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => generateVegetation());
  });
}

// Update HUD to show price and level
function updatePriceEvo() {
    const priceEl = document.getElementById("price-amt");
    const prodEl = document.getElementById("prod-amt");
    
    if (!priceEl || !prodEl) return; // Exit if elements don't exist yet
    
    priceEl.textContent = `$${(10 * level * level*1.5).toFixed(2)}`;
    prodEl.textContent = `${(productivity).toFixed(2)}%`;
}

// === Create Upgrade Button for each campfire ===
function createUpgradeButton() {

    const upgradeBtn = document.createElement("button");
    upgradeBtn.style.position = "absolute";
    upgradeBtn.style.top = `calc(10% + 5%)`;
    upgradeBtn.style.right = "5% ";
    upgradeBtn.style.padding = "10px 20px";
    upgradeBtn.style.fontSize = "16px";
    upgradeBtn.style.borderRadius = "8px";
    upgradeBtn.style.border = "none";
    upgradeBtn.style.background = "#28a745";
    upgradeBtn.style.color = "#fff";
    upgradeBtn.style.cursor = "pointer";
    upgradeBtn.innerHTML = `Upgrade city | <span id="prod-amt">${productivity.toFixed(2)} %</span> | <span id="price-amt">$${price.toFixed(1)}</span>`;


    document.body.appendChild(upgradeBtn);

    upgradeBtn.addEventListener("click", () => {
      price = parseFloat(document.getElementById("price-amt").textContent.slice(1));
      console.log(price);
        if (dollars < price) {
            // Show alert on screen instead of browser alert
            const alertDiv = document.createElement("div");
            alertDiv.style.position = "fixed";
            alertDiv.style.top = "10%";
            alertDiv.style.left = "50%";
            alertDiv.style.transform = "translate(-50%, -50%)";
            alertDiv.style.background = "rgba(255, 0, 0, 0.9)";
            alertDiv.style.color = "#fff";
            alertDiv.style.padding = "20px 30px";
            alertDiv.style.borderRadius = "10px";
            alertDiv.style.fontSize = "18px";
            alertDiv.style.fontFamily = "sans-serif";
            alertDiv.style.zIndex = "999999";
            alertDiv.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
            alertDiv.textContent = "Not enough money!";
            document.body.appendChild(alertDiv);
            
            // Remove alert after 2 seconds
            setTimeout(() => {
                document.body.removeChild(alertDiv);
            }, 2000);
            return;
        }
        
        productivity += 0.1*level;
        dollars -= price;
        price = Math.floor(10 * Math.pow(1.5, level));
        updateCityLevel();
        updatePriceEvo();
        moneyAmtEl.textContent = `$${dollars.toFixed(2)}`;
        level++;
    });
}



// Campfire click + behavior
let groundHit = null;

renderer.domElement.addEventListener("dblclick", onDbClick, false);
function onDbClick(event) {
    if(!firstCity){
      productivity = 0.05;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    if (!intersects.length) return;

    // find the firstCity intersection with the ground plane
    groundHit = intersects.find((i) => {
        return (
            i.object &&
            i.object.geometry &&
            i.object.geometry.type &&
            i.object.geometry.type.toLowerCase().includes("plane")
        );
    });


    if (!groundHit) return;

    createCampfireAt(groundHit.point);
    console.log(productivity);
    createUpgradeButton();
    firstCity = true;

    // Disable sliders UI - make them read-only
    const sliderUI = document.querySelector('div');
    if (sliderUI && sliderUI.querySelector('#water')) {
        const sliders = sliderUI.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            slider.disabled = true;
            slider.style.opacity = '0.5';
            slider.style.cursor = 'not-allowed';
        });
    }
  }

}


function createCampfireAt(position) {
    // remove nearby trees (and other plant meshes) within radius
    const clearRadius = 6;
    for (let i = plantMeshes.length - 1; i >= 0; i--) {
        const p = plantMeshes[i];
        if (p && p.position && p.position.distanceTo(position) < clearRadius) {
            scene.remove(p);
            plantMeshes.splice(i, 1);
        }
    }

    // Build a small camp group
    const group = new THREE.Group();
    group.position.copy(position);

    // Logs (two crossing cylinders)
    const logGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
    const logMat = new THREE.MeshStandardMaterial({
        color: 0x6b3b1b,
        roughness: 0.9,
        metalness: 0.1,
    });
    const logA = new THREE.Mesh(logGeo, logMat);
    logA.rotation.z = Math.PI / 6;
    logA.position.y = 0.12;
    logA.castShadow = true;
    const logB = logA.clone();
    logB.rotation.z = -Math.PI / 6;
    group.add(logA, logB);

    // Flame meshes: outer orange and inner yellow core (emissive)
    const flameGeo = new THREE.SphereGeometry(0.25, 10, 8);
    const flameMat = new THREE.MeshStandardMaterial({
        color: 0xff6a00,
        emissive: 0xff3300,
        emissiveIntensity: 1.8,
        transparent: true,
        opacity: 0.95,
        roughness: 0.5,
    });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 0.45;
    flame.castShadow = false;

    const coreGeo = new THREE.SphereGeometry(0.12, 8, 6);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffff88,
        emissive: 0xffffcc,
        emissiveIntensity: 2.4,
        transparent: true,
        opacity: 0.95,
        roughness: 0.2,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.52;
    core.castShadow = false;

    group.add(flame, core);

    // Warm point light that will flicker
    const light = new THREE.PointLight(0xffaa66, 2.0, 20, 2);
    light.position.set(0, 0.9, 0);
    group.add(light);

    // Simple particle "embers" using Points
    const emberCount = 40;
    const emberPositions = new Float32Array(emberCount * 3);
    const emberSpeeds = new Float32Array(emberCount);
    for (let i = 0; i < emberCount; i++) {
        emberPositions[i * 3 + 0] = (Math.random() - 0.5) * 0.6;
        emberPositions[i * 3 + 1] = Math.random() * 0.6 + 0.2;
        emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
        emberSpeeds[i] = 0.2 + Math.random() * 0.6;
    }
    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPositions, 3));
    emberGeo.setAttribute("aSpeed", new THREE.BufferAttribute(emberSpeeds, 1));
    const emberMat = new THREE.PointsMaterial({
        color: 0xffcc66,
        size: 0.06,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
    });
    const embers = new THREE.Points(emberGeo, emberMat);
    embers.position.y = 0.25;
    group.add(embers);

    scene.add(group);

    // keep state for animation
    city.push({
        group,
        type: 'campfire',
        position: position.clone(), // Add position for collision detection
        light,
        flame,
        core,
        embers,
        emberGeo,
        seed: Math.random() * 1000,
        born: performance.now(),
    });
}

// Independent tick to animate campfires (flicker, embers)
(function campfireTick() {
    requestAnimationFrame(campfireTick);
    const t = performance.now() * 0.001;
    for (let c of city) {
        // flicker flame and light
        const flick = 1 + Math.sin(t * 12 + c.seed) * 0.18 + (Math.random() - 0.5) * 0.05;
        c.flame.scale.set(1 * flick, 1.2 * flick, 1 * flick);
        c.core.scale.set(0.6 * flick, 0.6 * flick, 0.6 * flick);
        c.light.intensity = 1.2 + Math.sin(t * 20 + c.seed) * 0.9 + Math.random() * 0.3;
        c.light.color.setHSL(0.07 + Math.random() * 0.02, 1, 0.5 + Math.random() * 0.05);

        // animate embers: move upward and respawn when above threshold
        const posAttr = c.emberGeo.getAttribute("position");
        const speedAttr = c.emberGeo.getAttribute("aSpeed");
        for (let i = 0; i < posAttr.count; i++) {
            let x = posAttr.getX(i);
            let y = posAttr.getY(i);
            let z = posAttr.getZ(i);
            const spd = speedAttr.getX(i) || 0.4;
            y += (0.4 + spd * 0.6) * 0.016;
            x += (Math.random() - 0.5) * 0.003;
            z += (Math.random() - 0.5) * 0.003;
            if (y > 1.6 || Math.random() < 0.002) {
                // respawn near fire base
                x = (Math.random() - 0.5) * 0.6;
                y = 0.2 + Math.random() * 0.2;
                z = (Math.random() - 0.5) * 0.6;
            }
            posAttr.setXYZ(i, x, y, z);
        }
        posAttr.needsUpdate = true;
    }
})();

function generateVegetation() {
  // Remove old
  for (let mesh of plantMeshes) scene.remove(mesh);
  plantMeshes = [];

  // Read slider values
  const water = parseFloat(document.getElementById("water").value);
  const sun = parseFloat(document.getElementById("sun").value);
  const temp = parseFloat(document.getElementById("temp").value);
  const hum = parseFloat(document.getElementById("hum").value);

  // Determine environment factors
  const fertility = Math.min(1, (water*5 + hum*2 + sun * 3) / 2);
  let treeDensity = fertility * 0.3;
  const grassDensity = fertility * 1.5;

  const groundSize = 150;

  // Trees
  const trunkGeo = new THREE.CylinderGeometry(0.1, 0.2, 1.5);
  const canopyGeo = new THREE.SphereGeometry(0.8, 6, 6);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
  const canopyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(
  // HUE : vert de base, avec légères variations selon temp et eau
  0.33                                   // vert pur
  - temp * 0.1                         // chaleur → un peu plus jaune/rouge
  - Math.max(0, 0.3 - water) * 0.2,      // manque d’eau → tirant vers jaune
  // SATURATION : légèrement réduite si trop sec ou trop humide
  0.75 - Math.abs(hum - 0.5) * 0.2,      // stable au centre, terni aux extrêmes
  // LIGHTNESS : influencée par le soleil et la température
  0.5 + sun * 0.3 - temp * 0.1         // peu de soleil → sombre ; chaud → légèrement terni
),
    flatShading: true,
  });

  const treeCount = Math.floor(20000 * treeDensity);
  for (let i = 0; i < treeCount; i++) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.75;
    trunk.castShadow = true;
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.y = 1.8;
    canopy.castShadow = true;
    tree.add(trunk, canopy);
    // Use a deterministic grid of positions that fills the ground instead of random placement
    if (!generateVegetation.positions || generateVegetation.positions.length === 0) {
      generateVegetation.positions = [];
      const count = treeCount;
      const cols = Math.ceil(Math.sqrt(count));
      const rows = Math.ceil(count / cols);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ((c + 0.5) / cols - 0.5) * groundSize - 25; // spread across groundSize
          const z = ((r + 0.5) / rows - 0.5) * groundSize - 25;
          generateVegetation.positions.push(new THREE.Vector3(x + Math.random() * 50, 0, z + Math.random() * 50));
        }
      }
    }

    // Assign a predefined position from the grid (one per tree). If there are more trees than positions,
    // positions will repeat in row-major order.
    const pos = generateVegetation.positions[i % generateVegetation.positions.length];
    tree.position.copy(pos);
    const scale = 1 + (Math.random() * fertility * 2)*(hum + temp);
    tree.scale.set(scale, scale, scale);
    scene.add(tree);
    plantMeshes.push(tree);
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  
  // Prevent camera from going below ground level
  const minHeight = 1; // Minimum height above ground
  if (camera.position.y < minHeight) {
    camera.position.y = minHeight;
  }
  
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
