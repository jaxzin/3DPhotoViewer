import LKGPhotoViewer from './LKGPhotoViewer.js';

export let viewer = new LKGPhotoViewer(document);
window.viewer = viewer;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'updatePhotos') {
        viewer.updatePhotos(message.photoURIs);
    }
});


// var holoplayGamepad = new HoloPlayGamePad();
//
// holoplayGamepad.on('leftDown', function () {
//     viewer.previousPhoto();
//     updatePopup();
// });
//
// holoplayGamepad.on('rightDown', function () {
//     viewer.nextPhoto();
//     updatePopup();
// });
//
// holoplayGamepad.on('circlePressed', function () {
//     viewer.dollyIn();
//     updatePopup();
// });
//
// holoplayGamepad.on('squarePressed', function () {
//     viewer.dollyOut();
//     updatePopup();
// });

function updatePopup() {
    // Find and update the Chrome extensions popup if it's open
    var popups = chrome.extension.getViews({type: 'popup'});
    if(popups && popups.length > 0 && !popups[0].closed) {
        popups[0].updatePopupState();
    }
}

//Game loop
function RunApp(time){
    // Setup a callback for the next animation tick.
    requestAnimationFrame(RunApp);

    //holoplayGamepad.tick();
    viewer.draw(time);
}
requestAnimationFrame(RunApp);