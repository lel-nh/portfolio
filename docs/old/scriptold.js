import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {TextureLoader} from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 640 / 640, 0.1, 1000);

// Fetch the canvas element created in index.html, replace 'canvas' with the id of your canvas
const canvas = document.getElementById('cvs');

// Create a WebGLRenderer and set its width and height
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // Antialiasing is used to smooth the edges of what is rendered
    antialias: true
});

//white background
renderer.setClearColor(0x00ffff, 1);


/*let mtlLoader = new MTLLoader();
mtlLoader.setPath('../asset/textures/'); 
//mtlLoader.setTexturePath('../ressources/');
mtlLoader.load('xxx.mtl', function(materials){
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setPath('../ressources/');
    objLoader.setMaterials(materials);
    objLoader.load('table.obj', function(object){
        object.position.y = -10;
        
        
        scene.add(object);
    });
}); */




renderer.setSize(640, 640);
renderer.setPixelRatio( window.devicePixelRatio );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 5, 5, 5 ).normalize();
scene.add( light );


camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);


const animate = () => {
    // Call animate recursively
    requestAnimationFrame(animate);

    // Update the controls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

// Call animate for the first time
animate();
