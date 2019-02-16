
var viewer = new LKGPhotoViewer(document);

var popup = chrome.extension.getViews({type: 'popup'})[0];

var holoplayGamepad = new HoloPlayGamePad();

holoplayGamepad.on('leftDown', function () {
    viewer.previousPhoto();
    popup.updatePopupState();
});

holoplayGamepad.on('rightDown', function () {
    viewer.nextPhoto();
    popup.updatePopupState();
});

holoplayGamepad.on('circlePressed', function () {
    viewer.dollyIn();
    popup.updatePopupState();
});

holoplayGamepad.on('squarePressed', function () {
    viewer.dollyOut();
    popup.updatePopupState();
});


//Game loop
function RunApp(){
    holoplayGamepad.tick();
    viewer.draw();

    // Setup a callback for the next animation tick.
    requestAnimationFrame(RunApp);
}
RunApp();