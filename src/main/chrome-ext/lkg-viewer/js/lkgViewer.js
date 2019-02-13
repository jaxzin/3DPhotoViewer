GamePad.VERBOSE = true;
// GamePadDevice.VERBOSE = true;


var pad = new GamePad(function connect(player) {
    console.log("connected. player: " + player);
});

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

function findGlbUri() {
    var alltext = document.body.innerHTML;
    var glbURLIndex = alltext.indexOf('glbURI');
    var startIndex = alltext.indexOf('"', glbURLIndex + 'glbURI"'.length)+1;
    var endIndex = alltext.indexOf('"', startIndex);
    return alltext.substring(startIndex, endIndex).replace(new RegExp("\\\\", 'g'), "");
}

function findGlbUriInElement(element) {
    var alltext = element.innerHTML;
    var glbURLIndex = alltext.indexOf('glbURI');
    var startIndex = alltext.indexOf('"', glbURLIndex + 'glbURI"'.length)+1;
    var endIndex = alltext.indexOf('"', startIndex);
    return alltext.substring(startIndex, endIndex).replace(new RegExp("\\\\", 'g'), "");
}

function findAllGlbUris() {
    var alltext = document.body.innerHTML;
    var glbURIs = [];
    var searchIndex = 0;
    while( searchIndex >= 0 ) {
        var glbURLIndex = alltext.indexOf('glbURI', searchIndex);
        var startIndex = alltext.indexOf('"', glbURLIndex + 'glbURI"'.length) + 1;
        var endIndex = alltext.indexOf('"', startIndex);
        glbURIs.push(alltext.substring(startIndex, endIndex).replace(new RegExp("\\\\", 'g'), ""));

        searchIndex = alltext.indexOf('glbURI', endIndex+1);
    }
    return glbURIs;
}

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

var photos = [];
var selectedPhoto = 0;

function updatePhotos(newPhotos) {
    let oldPhotoCount = photos.length;
    photos = newPhotos;

    // Only load a scene if there is a new photo available
    if(photos.length !== oldPhotoCount) {
        selectedPhoto = photos.length-1;
        loadGLB(photos[selectedPhoto]);
    }
}

window.addEventListener("message", function(event) {
    updatePhotos(event.data);
});

//Render the scene
function draw(){
    holoplay.render();
}

//Game loop
function RunApp(){

    if (pad.connected) {
        pad.input();

        for(var i = 0; i < pad.length; i++) {
            let gamepad = pad[i];
            if(gamepad != null && gamepad.device === "HoloPlay") {
                input(gamepad.values, gamepad.diffs);
            }
        }
    }


    requestAnimationFrame(RunApp);
    draw();
}

init();
RunApp();


function input(values,  // @arg Uint8Array - current values
               diffs) { // @arg Uint8Array - diff values

    // logic for how these inputs translate to an event
    //   if values[MY_BUTTON] --> onButtonPressed
    //   if values[MY_BUTTON] && diffs[MY_BUTTON] --> onButtonDown
    //   if !values[MY_BUTTON] && diffs[MY_BUTTON] --> onButtonUp

    if(photos.length > 0) {
        if (diffs[GAMEPAD_KEY_A] && values[GAMEPAD_KEY_A]) {
            // onButtonDown "Left"
            selectedPhoto--;
            if (selectedPhoto < 0) {
                selectedPhoto = photos.length-1;
            }
            loadGLB(photos[selectedPhoto]);
        } else if (values[GAMEPAD_KEY_B]) {
            // onButtonPressed "Square"
            scene.children[2].translateZ(-0.1);
        } else if (values[GAMEPAD_KEY_X]) {
            // onButtonPressed "Circle"
            scene.children[2].translateZ(0.1);
        } else if (diffs[GAMEPAD_KEY_Y] && values[GAMEPAD_KEY_Y]) {
            // onButtonDown "Right"
            selectedPhoto++;
            if (selectedPhoto >= photos.length) {
                selectedPhoto = 0;
            }
            loadGLB(photos[selectedPhoto]);
        }
    }
}