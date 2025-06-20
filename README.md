# 3D Photo Viewer for Looking Glass
A Chrome Extension to display 3D Photos on your Looking Glass display.

Published in the Chrome Web Store: https://chrome.google.com/webstore/detail/3d-photo-viewer-for-looki/dmanadldhmolbbmmabgeodpbinjnijjf

The Looking Glass: https://lookingglassfactory.com/

A write-up on how to use it: http://www.jaxzin.com/2019/02/3d-photo-viewer-for-looking-glass.html

## Quilt Export

You can now export the quilt views used by the Looking Glass renderer. Click the
**Download Quilt** button in the popup to save a PNG of the current photo. The
viewer preserves its render settings while capturing and redraws the scene
afterward so you can continue browsing normally. These quilts are suitable for
creating lenticular prints.

## Contributing

To develop changes locally you'll need to install the external dependencies like HoloPlay.js, three.js, and GamePad.js.
These will be downloaded and installed to `lkg-viewer/js/deps/`

Please [install Yarn](https://yarnpkg.com/lang/en/docs/install/) first. 
Yarn will install Grunt.
Grunt will install the dependencies.
```
yarn install
grunt install
```
