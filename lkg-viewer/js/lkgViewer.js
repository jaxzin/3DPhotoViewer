

//Basic elements for a Three.js/HoloPlay scene
var scene, camera, renderer, holoplay;

// Instantiate a loader
var loader = new THREE.GLTFLoader();


var fbPhotoLoaded = function ( gltf ){

    gltf.scene.translateZ(8.5);
    gltf.scene.scale.set(7,7,7);

    clearViewer();
    scene.add( gltf.scene );
};

var fbPhotoLoading = function ( xhr ) {
    //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
};

var fbPhotoError = function ( error ) {
    console.log( 'An error happened' );
};

function clearViewer() {
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    scene.add(leftFrame);
    scene.add(rightFrame);
}

function loadGLB(url) {
    clearViewer();

    loader.load(
        // resource URL
        url,
        // called when the resource is loaded
        fbPhotoLoaded,
        // called while loading is progressing
        fbPhotoLoading,
        // called when loading has errors
        fbPhotoError
    );
}

//Initialize our variables
function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0,0,10);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    holoplay = new HoloPlay(scene, camera, renderer);

    frameMaterial = new THREE.MeshLambertMaterial({depthTest: false});
    frameMaterial.emissive = new THREE.Color( 'white' );
    frameGeo = new THREE.PlaneGeometry(2,10,1);

    leftFrame = new THREE.Mesh(frameGeo, frameMaterial);
    leftFrame.position.set(-3,0,1);
    leftFrame.renderOrder = 1;

    rightFrame = new THREE.Mesh(frameGeo, frameMaterial);
    rightFrame.position.set(3,0,1);
    rightFrame.renderOrder = 2;

    scene.add(leftFrame);
    scene.add(rightFrame);

}

//Resize window on size change
window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;

    renderer.setSize(width, height);

    camera.aspect = width/height;
    camera.updateProjectionMatrix();
});


// ======= Photo Handler ========

var photos = [];
var selectedPhoto = 0;

function updatePhotos(newPhotos) {
    let oldPhotoCount = photos.length;
    photos = newPhotos;

    // Only load a scene if there is a new photo available
    if(photos.length !== oldPhotoCount) {
        lastPhoto();
    }
}

function reloadPhoto() {
    loadGLB(photos[selectedPhoto]);
}

function loadPhoto(index) {
    selectedPhoto = index;
    reloadPhoto();
}

function firstPhoto() {
    loadPhoto(0);
}

function lastPhoto() {
    loadPhoto(photos.length - 1);
}

function nextPhoto() {
    selectedPhoto = (selectedPhoto + 1) % photos.length;
    reloadPhoto();
}

function previousPhoto() {
    // one-liner that wraps the index around to the end of the array if we hit -1
    selectedPhoto = --selectedPhoto < 0 ? photos.length - 1 : selectedPhoto;
    reloadPhoto();
}

// ======= Dolly Handler ========
function getLoadedPhotoFromScene() {
    return scene.children[2];
}

function dollyIn() {
    getLoadedPhotoFromScene().translateZ(0.1);
}

function dollyOut() {
    getLoadedPhotoFromScene().translateZ(-0.1);
}

//Render the scene
function draw(){
    holoplay.render();
}


var holoplayGamepad = new HoloPlayGamePad();

holoplayGamepad.on('leftDown', function () {
    previousPhoto();
});

holoplayGamepad.on('rightDown', function () {
    nextPhoto();
});

holoplayGamepad.on('circlePressed', function () {
    dollyIn();
});

holoplayGamepad.on('squarePressed', function () {
    dollyOut();
});


//Game loop
function RunApp(){

    holoplayGamepad.tick();

    requestAnimationFrame(RunApp);
    draw();
}

init();
RunApp();