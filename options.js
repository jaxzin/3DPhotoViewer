let clearPhotos = document.getElementById('clearPhotos');

clearPhotos.onclick = function(element) {
    chrome.storage.local.set({photoURIs: []}, function(data) {
            console.log("Clear photos database");
            chrome.tabs.query({title: 'Looking Glass Viewer for Facebook 3D Photos'}, function(tabs) {
                var windows = chrome.extension.getViews({tabId: tabs[0].id});
                windows[0].updatePhotos([]);
            });
        }
    );
    caches.delete("lkgPhotoGLTFs");
};