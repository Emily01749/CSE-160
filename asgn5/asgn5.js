import * as THREE from 'three';

//import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
//import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
//import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function cameraSetUp(scene){
    //const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const fov = 75;
    //const aspect = 2;  // the canvas default
    const aspect =  window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;

    return camera;
}

function addCube(scene){

    const loader = new THREE.TextureLoader();
    const texture = loader.load('wall.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;
 
    //const material = new THREE.MeshBasicMaterial({
    //    color: 0xFF8844,
    //    map: texture,
    //});
    const geometry = new THREE.BoxGeometry( 2, 1, 1 );
    const material = new THREE.MeshPhongMaterial(
        //{color: 0x44aa88}
        {map : texture}
    );
    const cube = new THREE.Mesh( geometry, material );
    scene.add(cube);

    return cube;
}

function addSphere(scene){
    const geometry = new THREE.SphereGeometry( 1, 64, 32 );
    const material = new THREE.MeshPhongMaterial(
        {color: 0x44aa88}
        //{map : texture}
    );
    const sphere = new THREE.Mesh( geometry, material );
	scene.add(sphere);

    return sphere;
}

function addCylinder(scene){
    const geometry = new THREE.CylinderGeometry( 1, 1, 1, 32 );
	const material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

	const cylinder = new THREE.Mesh( geometry, material );
	cylinder.castShadow = true;
	cylinder.receiveShadow = true;
	scene.add( cylinder );

    return cylinder;
}

function main(){
    const scene = new THREE.Scene();
    const camera = cameraSetUp(scene);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //var cube = addCube(scene)
    //var sphere = addSphere(scene)
    //var cylinder = addCylinder(scene);

    function animate(time) {
        //cube.rotation.x = time / 2000;
        //cube.rotation.y = time / 1000;
        renderer.render( scene, camera );
    }

    renderer.setAnimationLoop( animate );

    // Directional Light
    // TODO: Might want to make this a function
    // ---
    /*const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);*/
    // ---

    // Spotlight Light
    // TODO: Might want to make this a function
    // ---
    /*var spotLight = new THREE.SpotLight( 0xff2fff, 100 );
	spotLight.name = 'spotLight';
    //spotLight.map = textures[ 'file.jpg' ];
    spotLight.position.set( 1, 1, 5 );
    scene.add( spotLight );*/
    // ---

    // TODO: Might want to make this a function
    // ---
    const hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 3);
	hemisphereLight.position.set( 0, 1, 0 );
	scene.add( hemisphereLight );
    // ---

    // Textures not loaded correctly
    // ----------------------------------
    /*const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('resources/indoorPlant/Low-Poly Plant_.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
    objLoader.load('resources/indoorPlant/Low-Poly Plant_.obj', (root) => {
        scene.add(root);
    });
    });*/
    // ----------------------------------

    const loader = new GLTFLoader();
    loader.load( './resources/DiffuseTransmissionPlant/DiffuseTransmissionPlant.glb', (glb) => {
        scene.add(glb.scene); 
    });
}

main()