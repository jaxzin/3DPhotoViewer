let openViewer = document.getElementById('openViewer');

openViewer.onclick = function(element) {
    chrome.tabs.query({title: 'Looking Glass Tutorial'}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'document.location = "https://jaxzin.github.io/Facebook3DPhotoViewer/src/main/web/index.html"'}
        );
        chrome.windows.update(tabs[0].windowId, { state: "fullscreen" })
    });
};

let viewPhoto = document.getElementById('viewPhoto');

viewPhoto.onclick = function(element) {
    chrome.storage.sync.get('photoURIs', function(data) {
        var photoURIs = data.photoURIs;
        if(!photoURIs) {
            photoURIs = []
        }

        chrome.tabs.query({title: 'Looking Glass Tutorial'}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {code: 'location.href = \'javascript:updatePhotos(' + JSON.stringify(photoURIs) + ')\''}
                // {code: 'loadGLB("https://scontent-iad3-1.xx.fbcdn.net/v/t39.14030-6/50018107_2143782685644499_4772261604240654336_n.glb?_nc_cat=108&_nc_ht=scontent-iad3-1.xx&oh=f4982515d10bc5d98cf69eea5a684c32&oe=5CE27537")'}
            );
        });

    });

};

let clearPhotos = document.getElementById('clearPhotos');

clearPhotos.onclick = function(element) {
    chrome.storage.sync.set({photoURIs: new Set()}, function(data) {
            console.log("Clear photos database");
        }
    );

};