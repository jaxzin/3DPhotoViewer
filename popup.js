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

let openViewer = document.getElementById('openViewer');

openViewer.onclick = function(element) {
    findTabThen(
        function(tab) {
            sendLatestPhotosToDisplay();
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
                // Wait 1 second though, because the calibration data for the display isn't available immediately
                setTimeout(function () {
                    chrome.windows.update(window.id, {state: "fullscreen"}, function () {

                        // Remove the "Make Full Screen button"
                        chrome.tabs.query({title: 'Looking Glass Viewer for Facebook 3D Photos'}, function (tabs) {
                            var windows = chrome.extension.getViews({tabId: tabs[0].id});
                            windows[0].document.querySelector("#fullscreen").style.display = 'none';
                        });

                        sendLatestPhotosToDisplay();

                    });
                }, 500)
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
        chrome.windows.remove(tab.windowId)
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

let selectedPhoto = document.getElementById('selectedPhoto');
let totalPhotos = document.getElementById('totalPhotos');

function updateNav() {
    findViewerThen(function(viewer) {
        selectedPhoto.innerText = viewer.selectedPhoto+1;
        totalPhotos.innerText = viewer.photos.length;
    })
}

updateNav();