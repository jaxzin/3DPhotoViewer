import { GLTFLoader } from './deps/three/examples/jsm/loaders/GLTFLoader.js';
import * as HoloPlay from './deps/holoplay/holoplay.module.js';

class LKGPhotoViewer {

    constructor(document) {

        this.photos = [];
        this.selectedPhoto = -1;
        this.dollyLocation = 0.0;

        // Instantiate a loader
        this._loader = new GLTFLoader();

        this.scene = new THREE.Scene();

        this.camera = new HoloPlay.Camera();
        this.camera.position.set(0,0,20);

        this.renderer = new HoloPlay.Renderer({
            disableFullscreenUi: true,
        });
        this.renderer.gammaOutput = true;
        this.renderer.gammaFactor = 2.2;
        document.body.appendChild(this.renderer.domElement);

        this.frameMaterial = new THREE.MeshLambertMaterial({depthTest: false});
        this.frameMaterial.emissive = new THREE.Color( 'white' );
        this.frameGeo = new THREE.PlaneGeometry(2,10,1);

        this.leftFrame = new THREE.Mesh(this.frameGeo, this.frameMaterial);
        this.leftFrame.position.set(-3,0,1);
        this.leftFrame.renderOrder = 1;

        this.rightFrame = new THREE.Mesh(this.frameGeo, this.frameMaterial);
        this.rightFrame.position.set(3,0,1);
        this.rightFrame.renderOrder = 2;

        this.scene.add(this.leftFrame);
        this.scene.add(this.rightFrame);

        // Set the renderer and camera to a local variable so the event listener can access it.
        var renderer = this.renderer;
        var camera = this.camera;

        //Resize window on size change
        // window.addEventListener('resize', function(){
        //     var width = window.innerWidth;
        //     var height = window.innerHeight;
        //
        //     renderer.setSize(width, height);
        //
        //     camera.aspect = width/height;
        //     camera.updateProjectionMatrix();
        // });


        // Set the clear function and scene to a local variable so the event listener can access it.
        var clear = this._clear;
        var scene = this.scene;
        var leftFrame = this.leftFrame;
        var rightFrame = this.rightFrame;
        var viewer = this;
        this._fbPhotoLoaded = function ( gltf ){

            gltf.scene.translateZ(8.5);
            gltf.scene.scale.set(7,7,7);

            clear(scene, leftFrame, rightFrame);
            scene.add( gltf.scene );

            viewer.selectedPhotoMatrix = new THREE.Matrix4();
            console.log(viewer.selectedPhotoMatrix);
            viewer.updateLoadedPhoto();
        };

    }

    updateLoadedPhoto() {
        var loadedPhoto = this.scene.children[2];
        // Don't recalculate the matrix automatically, we're going to do some magic
        loadedPhoto.matrixAutoUpdate = false;
        // Magic numbers to distort a Facebook 3D Photo properly for the HoloPlay.Camera
        loadedPhoto.matrix.makePerspective(0.5,-0.5,-0.5,0.5,-3,2.5).multiply(this.selectedPhotoMatrix);
        loadedPhoto.matrix.elements[10] = LKGPhotoViewer._DEFAULT_DOLLY + this.dollyLocation;
    }

    updatePhotos(newPhotos) {
        let oldPhotoCount = this.photos.length;
        this.photos = newPhotos;

        // Only load a scene if there is a new photo available
        if(this.photos.length !== oldPhotoCount) {
            this.lastPhoto();
        }
    }

    reloadPhoto() {
        this.loadGLB(this.photos[this.selectedPhoto]);
    }

    loadPhoto(index) {
        this.selectedPhoto = index;
        this.reloadPhoto();
    }

    firstPhoto() {
        this.loadPhoto(0);
    }

    lastPhoto() {
        this.loadPhoto(this.photos.length - 1);
    }

    nextPhoto() {
        this.selectedPhoto = (this.selectedPhoto + 1) % this.photos.length;
        this.reloadPhoto();
    }

    previousPhoto() {
        // one-liner that wraps the index around to the end of the array if we hit -1
        this.selectedPhoto = --this.selectedPhoto < 0 ? this.photos.length - 1 : this.selectedPhoto;
        this.reloadPhoto();
    }



    _fbPhotoLoading ( xhr ) {
        //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    };

    _fbPhotoError ( error ) {
        console.log( 'An error happened', error );
    };

    clear() {
        this._clear(this.scene, this.leftFrame, this.rightFrame);
    }

    _clear(scene, leftFrame, rightFrame) {
        while(scene.children.length > 0){
            scene.remove(scene.children[0]);
        }
        scene.add(leftFrame);
        scene.add(rightFrame);
    }


    loadGLB(url) {
        this.clear();

        let request = new Request(url);
        let gltfLoader = this._loader;
        let onLoaded = this._fbPhotoLoaded;
        let onError = this._fbPhotoError;
        let onBufferFulfilled = function(buffer) {
            gltfLoader.parse(buffer, null, onLoaded, onError);
        };

        caches.open('lkgPhotoGLTFs').then(cache=>{
            cache.match(request).then(response=> {
                if(response) {
                    console.log("Reading gltf from cache: ", request.url);
                    response.arrayBuffer().then(onBufferFulfilled);

                } else {
                    console.log("Downloading gltf: ", request.url);
                    cache.add(request).then(response => {
                        if(response) {
                            response.arrayBuffer().then(onBufferFulfilled);
                        } else {
                            cache.match(request).then(response=> {
                                if(response) {
                                    response.arrayBuffer().then(onBufferFulfilled);
                                } else {
                                    console.error("Unable to download gltf: ", url);
                                }
                            });
                        }
                    })
                }
            })
        });
    }


// ======= Dolly Handler ========
    getLoadedPhotoFromScene() {
        return this.scene.children[2];
    }

    dollyIn() {
        this.setDollyLocation(this.dollyLocation + LKGPhotoViewer._DOLLY_STEP);
    }

    dollyOut() {
        this.setDollyLocation(this.dollyLocation - LKGPhotoViewer._DOLLY_STEP);
    }

    setDollyLocation(z) {
        console.log(z);
        this.dollyLocation = z;
        this.updateLoadedPhoto();
    }


    //Render the scene
    draw(time){
        this.renderer.render(this.scene, this.camera);
    }

    downloadQuilt() {
        const prevRender2d = this.renderer.render2d;
        const prevRenderQuilt = this.renderer.renderQuilt;

        this.renderer.render2d = false;
        this.renderer.renderQuilt = true;
        this.renderer.render(this.scene, this.camera);

        const dataUrl = this.renderer.webglRenderer.domElement.toDataURL('image/png');

        this.renderer.renderQuilt = prevRenderQuilt;
        this.renderer.render2d = prevRender2d;
        this.renderer.render(this.scene, this.camera);

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'quilt.png';
        link.click();
    }

}

LKGPhotoViewer._DEFAULT_DOLLY = 2.9;
LKGPhotoViewer._DOLLY_STEP = 0.01;

export default LKGPhotoViewer;