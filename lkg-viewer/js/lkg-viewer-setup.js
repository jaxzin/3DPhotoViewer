
var viewer = new LKGPhotoViewer(document);

var holoplayGamepad = new HoloPlayGamePad();

holoplayGamepad.on('leftDown', function () {
    viewer.previousPhoto();
});

holoplayGamepad.on('rightDown', function () {
    viewer.nextPhoto();
});

holoplayGamepad.on('circlePressed', function () {
    viewer.dollyIn();
});

holoplayGamepad.on('squarePressed', function () {
    viewer.dollyOut();
});


//Game loop
function RunApp(){
    holoplayGamepad.tick();
    viewer.draw();

    // Setup a callback for the next animation tick.
    requestAnimationFrame(RunApp);
}
RunApp();