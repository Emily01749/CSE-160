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
    camera.position.z = 30;

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
    //cube.position.set(-1, 0, 0)
    scene.add(cube);

    return cube;
}

function addSkyBox(scene){
    const loader = new THREE.TextureLoader();
    const texture = loader.load('resources/hubblelLegionGalaxy.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;
 
    const material = new THREE.MeshBasicMaterial({
        //color: 0xFF8844,
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
    const geometry = new THREE.SphereGeometry( 1, 74, 32 );
    /*const material = new THREE.MeshPhongMaterial({
        color: 0x44aa88,
        specular: 0xffffff,
        shininess: 100,
        opacity: 0.5
    });*/
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xaaaa88,
        roughness: 0.1,
        transmission: 0.95,
        metalness: 0.1,
        thickness: 1.0,
        specularIntensity: 7.0,
        ior: 1.3
    });
    const sphere = new THREE.Mesh( geometry, material );
    //sphere.position.set(1, 2, 0);
    sphere.scale.set(3, 3, 3);
	scene.add(sphere);

    return sphere;
}

function addCylinder(scene){
    const geometry = new THREE.CylinderGeometry( 1, 1, 1, 32 );
	const material = new THREE.MeshPhongMaterial( {
        color: 0xff0000,
        specular: 0xffffff
    });

	const cylinder = new THREE.Mesh( geometry, material );
	cylinder.castShadow = true;
	cylinder.receiveShadow = true;

    cylinder.position.set(2, -1, 1)
	scene.add( cylinder );

    return cylinder;
}

function addDodecahedron(scene){
    const geometry = new THREE.DodecahedronGeometry();
    const material = new THREE.MeshPhongMaterial( { 
        color: 0xffff00,
        specular: 0xffffff
    });

    const dodecahedron = new THREE.Mesh( geometry, material );
    scene.add( dodecahedron );

    return dodecahedron;
}
/* 
----------------
Lights
----------------
*/

function addDirectionalLight(scene){
    const color = 0xFFFF33;
    const intensity = 3;
    const directLight = new THREE.DirectionalLight(color, intensity);
    directLight.position.set(1, 1, 0);
    scene.add(directLight);

    return directLight;
}

function addSpotlightLight(scene){
    const spotLight = new THREE.SpotLight( 0x222fff, 100 );
	spotLight.name = 'spotLight';
    //spotLight.map = textures[ 'file.jpg' ];
    spotLight.position.set( 1, 1, 5 );
    scene.add( spotLight );

    return spotLight;
}

function addHemisphereLight(scene){
    const hemisphereLight = new THREE.HemisphereLight( 0x7777ff, 0x77ff77, 0.9);
	hemisphereLight.position.set( 0, 1, 0 );
	scene.add( hemisphereLight );

    return hemisphereLight;
}

function addPointLight(scene){
    const pointLight = new THREE.PointLight( 0x7777ff, 2000, 100);
	pointLight.position.set(-1, 1, 1 );
	scene.add( pointLight );

    return pointLight;

}

function loadGlFModel(texture_glb_file, scene){
    const loader = new GLTFLoader();
    loader.load( texture_glb_file, (glb) => {
        glb.scene.position.set(0, 3, 0);    
        glb.scene.scale.set(4,4,4);
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
    //var cylinder = addCylinder(scene);

    var sky = addSkyBox(scene);

    var directLight = addDirectionalLight(scene);
    var spotLight = addSpotlightLight(scene);
    var hemisphrLight = addHemisphereLight(scene);
    var point = addPointLight(scene);

    var plantModel = loadGlFModel('./resources/DiffuseTransmissionPlant/DiffuseTransmissionPlant.glb', scene)

    var camcontrols = cameraControls(scene, camera, renderer);

    /*
    --------------
    Animation
    ---------------
    */

    var arrayOfOrbitObj = [];

    // location
    var x = [];
    var y = [];
    var z = [];

    // speed
    var dx = [];
    var dy = [];
    var dz = [];

    for(var i = 0; i < 20; i++){
        var obj;

        if((i % 3) == 0){
            obj = addCube(scene);
        }
        else if((i % 3) == 1){
            obj = addDodecahedron(scene);
        }
        else{
            obj = addCylinder(scene);
        }

        var angle = Math.random() * 200;

        arrayOfOrbitObj.push(obj);
        x.push(Math.sin(angle) * (10 + i/20));
        y.push(Math.cos(angle) * (10 + i/20));
        z.push((Math.random() - 0.5) * 10);

        dx.push(Math.cos(angle) / 30);
        dy.push(-Math.sin(angle) / 30);
        dz.push(0);

    }

    function animate(time) {
        //cube.rotation.x = time / 2000;
        //cube.rotation.y = time / 1000;

        point.position.x = Math.sin(time / 1000) * 6;
        point.position.y = Math.cos(time / 1000) * 6;

        for(var i = 0; i < arrayOfOrbitObj.length; i++){
            var obj = arrayOfOrbitObj[i];

            //var radius = i * 3;
            var radius = Math.sqrt(x[i]**2 + y[i]**2 + z[i]**2);

            var accelerateX = x[i] / (radius**3) / 100;
            var accelerateY = y[i] / (radius**3) / 100;
            var accelerateZ = z[i] / (radius**3) / 100;

            dx[i] -= accelerateX;
            dy[i] -= accelerateY;
            dz[i] -= accelerateZ;

            x[i] += dx[i];
            y[i] += dy[i];
            z[i] += dz[i];

            var angularVelocity = 20 * Math.sqrt(1/radius**3);

            var t = time + 100000000;
            var s = Math.sin(t / 1000 * angularVelocity);
            var c = Math.cos(t / 1000 * angularVelocity);
            
            //obj.position.x = radius * s;
            //obj.position.y = radius * c;
            obj.position.x = x[i];
            obj.position.y = y[i];
            obj.position.z = z[i];
        }
        //sphere.position.x = Math.cos(time) * 0.25
        //cylinder.position.y = Math.sin(time) * 0.5
        //plantModel.position.x = time / 10;
        
        camcontrols.update()
        
        renderer.render( scene, camera );
    }

    renderer.setAnimationLoop( animate );

}

main()