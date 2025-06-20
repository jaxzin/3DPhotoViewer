let clearPhotos = document.getElementById('clearPhotos');

clearPhotos.onclick = function(element) {
    chrome.storage.local.set({photoURIs: []}, function(data) {
            console.log("Clear photos database");
            chrome.tabs.query({title: 'Looking Glass Viewer for Facebook 3D Photos'}, function(tabs) {
                if(tabs.length > 0) {
                    var windows = chrome.extension.getViews({tabId: tabs[0].id});
                    if(windows[0] && windows[0].viewer) {
                        windows[0].viewer.updatePhotos([]);
                    }
                }
            });
        }
    );
    caches.delete("lkgPhotoGLTFs");
};