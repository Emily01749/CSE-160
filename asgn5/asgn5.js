import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/*
------------------
Camera
------------------
*/

function cameraSetUp(scene){
    //const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const fov = 75;
    //const aspect = 2;  // the canvas default
    const aspect =  window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 500000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;

    return camera;
}

// https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_orbit.html

function cameraControls(scene, camera, renderer){
    //var camera = cameraSetUp(scene);
    var controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
	controls.maxDistance = 1000;
    controls.cursorStyle = 'grab';
    controls.maxPolarAngle = Math.PI / 2;

    return controls;
}


/*
------------------
Mesh
------------------
*/

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
    cube.position.set(-1, 0, 0)
    scene.add(cube);

    return cube;
}

function addSkyBox(scene){
    const loader = new THREE.TextureLoader();
    const texture = loader.load('wall.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;
 
    const material = new THREE.MeshBasicMaterial({
        color: 0xFF8844,
        map: texture,
        side: THREE.DoubleSide
    });
    const geometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
    /*const material = new THREE.MeshPhongMaterial(
        //{color: 0x44aa88}
        {map : texture}
    );*/
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(0, 0, 0)
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
    sphere.position.set(1, 2, 0)
	scene.add(sphere);

    return sphere;
}

function addCylinder(scene){
    const geometry = new THREE.CylinderGeometry( 1, 1, 1, 32 );
	const material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

	const cylinder = new THREE.Mesh( geometry, material );
	cylinder.castShadow = true;
	cylinder.receiveShadow = true;

    cylinder.position.set(2, -1, 1)
	scene.add( cylinder );

    return cylinder;
}

/* 
----------------
Lights
----------------
*/

function addDirectionalLight(scene){
    const color = 0xFF0000;
    const intensity = 3;
    const directLight = new THREE.DirectionalLight(color, intensity);
    directLight.position.set(1, 1, 3);
    scene.add(directLight);

    return directLight;
}

function addSpotlightLight(scene){
    const spotLight = new THREE.SpotLight( 0xff2fff, 100 );
	spotLight.name = 'spotLight';
    //spotLight.map = textures[ 'file.jpg' ];
    spotLight.position.set( 1, 1, 5 );
    scene.add( spotLight );

    return spotLight;
}

function addHemisphereLight(scene){
    const hemisphereLight = new THREE.HemisphereLight( 0xfff000, 0xffffff, 3);
	hemisphereLight.position.set( 0, 1, 0 );
	scene.add( hemisphereLight );

    return hemisphereLight;
}

function loadGlFModel(texture_glb_file, scene){
    const loader = new GLTFLoader();
    loader.load( texture_glb_file, (glb) => {
        glb.scene.position.set(0, -2, 0);    
        scene.add(glb.scene);
    });
}

function main(){
    const scene = new THREE.Scene();
    const camera = cameraSetUp(scene);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var cube = addCube(scene)
    var sphere = addSphere(scene)
    var cylinder = addCylinder(scene);

    var sky = addSkyBox(scene);

    var directLight = addDirectionalLight(scene);
    var spotLight = addSpotlightLight(scene);
    var hemisphrLight = addHemisphereLight(scene);

    var plantModel = loadGlFModel('./resources/DiffuseTransmissionPlant/DiffuseTransmissionPlant.glb', scene)

    var camcontrols = cameraControls(scene, camera, renderer);

    /*
    --------------
    Animation
    ---------------
    */
    function animate(time) {
        //cube.rotation.x = time / 2000;
        //cube.rotation.y = time / 1000;
        //sphere.position.x = Math.cos(time) * 0.25
        //cylinder.position.y = Math.sin(time) * 0.5
        //plantModel.position.x = time / 10;
        
        camcontrols.update()
        
        renderer.render( scene, camera );
    }

    renderer.setAnimationLoop( animate );

}

main()