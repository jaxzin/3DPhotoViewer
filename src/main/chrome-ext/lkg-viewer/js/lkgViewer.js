GamePad.VERBOSE = true;
// GamePadDevice.VERBOSE = true;


var pad = new GamePad(function connect(player) {
    console.log("connected. player: " + player);
});

//Basic elements for a Three.js/HoloPlay scene
var scene, camera, renderer, holoplay;

//Lighting elements
var directionalLight;
var ambientLight;

//Scene objects
var cubeGeometry;
var cubeMaterial;
var cubes;

// Instantiate a loader
var loader = new THREE.GLTFLoader();


var fbPhotoLoaded = function ( gltf ){
    gltf.scene.translateZ(8.5);

    gltf.scene.scale.set(7,7,7);

    clearViewer();
    scene.add( gltf.scene );
};

var fbPhotoLoading = function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
};

var fbPhotoError = function ( error ) {
    console.log( 'An error happened' );
};

//var lkgViewer = window.open('', 'lkg')
// lkgViewer.postMessage(findGlbUri(), '*')
// window.open('', 'lkg').postMessage(function(){var alltext = document.body.innerHTML;
//     var glbURLIndex = alltext.indexOf('glbURI');
//     var startIndex = alltext.indexOf('"', glbURLIndex + 'glbURI"'.length)+1;
//     var endIndex = alltext.indexOf('"', startIndex);
//     return alltext.substring(startIndex, endIndex).replace(new RegExp("\\\\", 'g'), "");}(), '*')

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

/*
window.open("data:text/html;charset=utf-8,"+html, "", "_blank")
javascript:
    if(!window.lkgViewer){
        window.lkgViewer=window.open('','lkg','_blank');
        try {
            window.lkgViewer.document.write('<html><body><h1>Drag this window to your Looking Glass</h1><h2><a href="https://jaxzin.github.io/Facebook3DPhotoViewer/src/main/web/index.html">Ready</a></h2></body></html>')
        } catch(ignored){}
    };
    window.lkgViewer.postMessage(function(){
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
}(), '*')
*/

// Load a glTF resource
// loader.load(
//     // resource URL
//     // '3dassets/49775912_229306017972112_6048810233474580480_n.glb',
//     // '3dassets/49997742_1418295718304068_6085803272126332928_n.glb',
//     // '3dassets/51492175_1398325346975453_4549678226955304960_n.glb',
//     // '3dassets/51557274_366009057569569_1877388131305521152_n.glb',
//     // '3dassets/51613249_431258084345256_2544211177290858496_n.glb',
//     // 'https://scontent-iad3-1.xx.fbcdn.net/v/t39.14030-6/50018107_2143782685644499_4772261604240654336_n.glb?_nc_cat=108&_nc_ht=scontent-iad3-1.xx&oh=f4982515d10bc5d98cf69eea5a684c32&oe=5CE27537',
//     // 'https://scontent-iad3-1.xx.fbcdn.net/v/t39.14030-6/51893802_545409929278556_2288381175426711552_n.glb?_nc_cat=110&_nc_ht=scontent-iad3-1.xx&oh=4ef9f6cb0e81b08eb5cef4429ba24480&oe=5CB33CF5',
//     'https://scontent-iad3-1.xx.fbcdn.net/v/t39.14030-6/52152401_404053507021041_9202039445396652032_n.glb?_nc_cat=110&_nc_ht=scontent-iad3-1.xx&oh=2348ec42f9e522178853e0d24c17ca6f&oe=5CB32F01',
//     // called when the resource is loaded
//     fbPhotoLoaded,
//     // called while loading is progressing
//     fbPhotoLoading,
//     // called when loading has errors
//     fbPhotoError
// );

function clearViewer() {
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    scene.add(leftFrame);
    scene.add(rightFrame);
    scene.add(caption);
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
    //camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 1000);
    camera.position.set(0,0,10);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    holoplay = new HoloPlay(scene, camera, renderer);

    // directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    // directionalLight.position.set (0, 1, 2);
    // scene.add(directionalLight);
    //
    // ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
    // scene.add(ambientLight);

    // cubes = [];
    //
    // cubeGeometry = new THREE.BoxGeometry(1,1,1);
    // cubeMaterial = new THREE.MeshLambertMaterial();
    //
    // for(var i = 0; i < 3; i++){
    //     cubes.push(new THREE.Mesh(cubeGeometry, cubeMaterial));
    //     cubes[i].position.set(1 - i, 1 - i, 1 - i);
    //     scene.add(cubes[i]);
    // }

    frameMaterial = new THREE.MeshLambertMaterial({depthTest: false});
    frameMaterial.emissive = new THREE.Color( 'white' );
    frameGeo = new THREE.PlaneGeometry(2,10,1);

    leftFrame = new THREE.Mesh(frameGeo, frameMaterial);
    leftFrame.position.set(-3,0,1);
    leftFrame.renderOrder = 1;

    rightFrame = new THREE.Mesh(frameGeo, frameMaterial);
    rightFrame.position.set(3,0,1);
    rightFrame.renderOrder = 2;

    var fontLoader = new THREE.FontLoader();

    fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        var captionGeo = new THREE.TextGeometry( 'Facebook', {
            font: font,
            size: 1,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false
        } );

        captionMaterial = new THREE.MeshLambertMaterial({depthTest: false});
        captionMaterial.emissive = new THREE.Color( 'gray' );
        caption = new THREE.Mesh(captionGeo, captionMaterial);
        caption.renderOrder = 3;

        caption.scale.set(0.5,0.5,0.5);
        caption.position.set(-3.5,-2,1);

        scene.add(caption);
    } );


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

    if(photos.length > 0) {
        if (diffs[GAMEPAD_KEY_A] && values[GAMEPAD_KEY_A]) {
            console.log("Left");
            selectedPhoto--;
            if (selectedPhoto < 0) {
                selectedPhoto = photos.length-1;
            }
            loadGLB(photos[selectedPhoto]);
        } else if (values[GAMEPAD_KEY_B]) {
            console.log("Square");
            scene.children[2].translateZ(-0.1);
        } else if (values[GAMEPAD_KEY_X]) {
            console.log("Circle");
            scene.children[2].translateZ(0.1);
        } else if (diffs[GAMEPAD_KEY_Y] && values[GAMEPAD_KEY_Y]) {
            console.log("Right");
            selectedPhoto++;
            if (selectedPhoto >= photos.length) {
                selectedPhoto = 0;
            }
            loadGLB(photos[selectedPhoto]);
        }
    }
}