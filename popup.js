function findTabThen(onTabFound, onError) {
    chrome.tabs.query({title: 'Looking Glass Viewer for Facebook 3D Photos'}, function(tabs) {
        if(tabs.length === 0) {
            if(onError) {
                onError();
            }
        } else {
            tabs.forEach(function(tab){
                onTabFound(tab);
            });
        }
    });
}

function findViewerThen(onViewerFound) {
    findTabThen(function(tab){
        var windows = chrome.extension.getViews({tabId: tab.id});
        onViewerFound(windows[0].viewer);
    });
}

function updatePopupState() {
    findTabThen(function(tab) {
        console.log("Tab was open, updating popup");
        document.querySelector('.opened').style.display = 'block';
        document.querySelector('.closed').style.display = 'none';
        updateNav();
    }, function() {
        console.log("Tab was closed, updating popup");
        document.querySelector('.opened').style.display = 'none';
        document.querySelector('.closed').style.display = 'block';
    })
}

let openViewer = document.getElementById('openViewer');

openViewer.onclick = function(element) {
    findTabThen(
        function(tab) {
            sendLatestPhotosToDisplay();
            updatePopupState();
        },
        // If there is no window...
        createViewerWindow);
};

function createViewerWindow() {
    // Find out what displays are available
    chrome.system.display.getInfo(function (info) {
        var holoplayDisplay;
        info.forEach(function (display) {
            if (display.bounds.height === 1600 && display.bounds.width === 2560) {
                // Looking Glass 8.9"
                holoplayDisplay = display;
            } else if (display.bounds.height === 2048 && display.bounds.width === 1536) {
                // Looking Glass Portrait
                holoplayDisplay = display;
            }
        });

        if (holoplayDisplay) {
            chrome.windows.create({
                url: chrome.extension.getURL("lkg-viewer/index.html"),
                left: holoplayDisplay.bounds.left,
                top: holoplayDisplay.bounds.top
            }, function (window) {
                // Since windows.create doesn't allow for positioning AND making a window full screen on creation...
                // After the window has been created, make it full-screen
                // Wait half a second though, because the calibration data for the display isn't available immediately
                setTimeout(function () {
                    chrome.windows.update(window.id, {state: "fullscreen"}, function () {

                        findTabThen(function(tab){
                            // Once it's full screen, display a 3D photo
                            sendLatestPhotosToDisplay();
                            updatePopupState();

                            // The viewer data isn't ready right away so update the popup again in a few milliseconds
                            setTimeout(function () {
                                updatePopupState();
                            }, 10)
                        });

                    });
                }, 500);
            })
        } else {
            console.error("No Looking Glass Display found!!!", info)
        }
    });
}

function sendLatestPhotosToDisplay() {
    chrome.storage.local.get('photoURIs', function(data) {
        var photoURIs = data.photoURIs;
        if(!photoURIs) {
            photoURIs = []
        }

        findViewerThen(function(viewer){viewer.updatePhotos(photoURIs)});
    });
}

let closeViewer = document.getElementById('closeViewer');
closeViewer.onclick = function(element) {
    findTabThen(function(tab){
        chrome.windows.remove(tab.windowId, function() {
            updatePopupState();
        });
    });
};

let nextPhoto = document.getElementById('nextPhoto');
nextPhoto.onclick = function(element) {
    findViewerThen(function(viewer){ viewer.nextPhoto()});
    updateNav();
};

let previousPhoto = document.getElementById('previousPhoto');
previousPhoto.onclick = function(element) {
    findViewerThen(function(viewer){ viewer.previousPhoto()});
    updateNav();
};

let downloadQuiltBtn = document.getElementById('downloadQuilt');
downloadQuiltBtn.onclick = function(element) {
    findViewerThen(function(viewer){ viewer.downloadQuilt(); });
};

let selectedPhoto = document.getElementById('selectedPhoto');
let totalPhotos = document.getElementById('totalPhotos');
let focalDistanceSlider = document.getElementById('focalDistance');

function updateNav() {
    findViewerThen(function(viewer) {
        console.log("Setting nav labels", viewer.selectedPhoto);
        selectedPhoto.innerText = viewer.selectedPhoto+1;
        totalPhotos.innerText = viewer.photos.length;
        focalDistanceSlider.value = viewer.dollyLocation;
    })
}

focalDistanceSlider.oninput = function(event) {
    let focalDistance = parseFloat(event.target.value);
    console.log("Setting focal distance to:", focalDistance);
    findViewerThen(function(viewer) {
        viewer.setDollyLocation(focalDistance);
    });

    return true;
};


updatePopupState();