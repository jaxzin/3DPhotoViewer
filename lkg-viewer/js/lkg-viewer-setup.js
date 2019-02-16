
var viewer = new LKGPhotoViewer(document);


var holoplayGamepad = new HoloPlayGamePad();

holoplayGamepad.on('leftDown', function () {
    viewer.previousPhoto();
    updatePopup();
});

holoplayGamepad.on('rightDown', function () {
    viewer.nextPhoto();
    updatePopup();
});

holoplayGamepad.on('circlePressed', function () {
    viewer.dollyIn();
    updatePopup();
});

holoplayGamepad.on('squarePressed', function () {
    viewer.dollyOut();
    updatePopup();
});

function updatePopup() {
    var popups = chrome.extension.getViews({type: 'popup'});
    if(popups && popups.length > 0 && !popups[0].closed) {
        popups[0].updatePopupState();
    }
}

//Game loop
function RunApp(){
    holoplayGamepad.tick();
    viewer.draw();

    // Setup a callback for the next animation tick.
    requestAnimationFrame(RunApp);
}
RunApp();