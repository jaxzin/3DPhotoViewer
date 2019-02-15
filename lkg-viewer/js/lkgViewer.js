
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
    requestAnimationFrame(RunApp);
    holoplayGamepad.tick();
    viewer.draw();
}
RunApp();