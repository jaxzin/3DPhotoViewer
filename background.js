// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'www.facebook.com'},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        console.log(details.url);
        if(details.url.indexOf(".glb") != -1) {
            chrome.storage.local.get('photoURIs', function(data) {
                    var photoURIs = data.photoURIs;
                    if(!Array.isArray(photoURIs)) {
                        photoURIs = [];
                    }

                    if(!photoURIs.includes(details.url)) {
                        photoURIs.push(details.url);
                    }
                    chrome.storage.local.set({photoURIs: photoURIs}, function () {
                        console.log("Updated photoURIs: ", photoURIs);
                    });

                    chrome.tabs.query({title: 'Looking Glass Viewer for Facebook 3D Photos'}, function(tabs) {
                        var windows = chrome.extension.getViews({tabId: tabs[0].id});
                        windows[0].viewer.updatePhotos(photoURIs);
                    });
                })
        }
        return {cancel: false};
    },
    {urls: ["*://*.fbcdn.net/*.glb*"]},
    []);
