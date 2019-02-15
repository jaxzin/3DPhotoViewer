class LKGPhotoViewer {
    constructor(document) {

        this.photos = [];

        // Instantiate a loader
        this._loader = new THREE.GLTFLoader();

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.camera.position.set(0,0,10);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.gammaOutput = true;
        this.renderer.gammaFactor = 2.2;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.holoplay = new HoloPlay(this.scene, this.camera, this.renderer);

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
        window.addEventListener('resize', function(){
            var width = window.innerWidth;
            var height = window.innerHeight;

            renderer.setSize(width, height);

            camera.aspect = width/height;
            camera.updateProjectionMatrix();
        });


        // Set the clear function and scene to a local variable so the event listener can access it.
        var clear = this._clear;
        var scene = this.scene;
        var leftFrame = this.leftFrame;
        var rightFrame = this.rightFrame;
        this._fbPhotoLoaded = function ( gltf ){

            gltf.scene.translateZ(8.5);
            gltf.scene.scale.set(7,7,7);

            clear(scene, leftFrame, rightFrame);
            scene.add( gltf.scene );
        };

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

        this._loader.load(
            // resource URL
            url,
            // called when the resource is loaded
            this._fbPhotoLoaded,
            // called while loading is progressing
            this._fbPhotoLoading,
            // called when loading has errors
            this._fbPhotoError
        );
    }


// ======= Dolly Handler ========
    getLoadedPhotoFromScene() {
        return this.scene.children[2];
    }

    dollyIn() {
        this.getLoadedPhotoFromScene().translateZ(0.1);
    }

    dollyOut() {
        this.getLoadedPhotoFromScene().translateZ(-0.1);
    }


    //Render the scene
    draw(){
        this.holoplay.render();
    }

}