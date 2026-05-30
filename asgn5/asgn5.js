import * as THREE from 'three';

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
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    return cube;
}

function main(){
    const scene = new THREE.Scene();
    const camera = cameraSetUp(scene);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var cube = addCube(scene)

    function animate(time) {
        cube.rotation.x = time / 2000;
        cube.rotation.y = time / 1000;
        renderer.render( scene, camera );
    }

    renderer.setAnimationLoop( animate );

    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
}

main()