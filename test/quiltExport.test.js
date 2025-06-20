import fs from 'fs';
import assert from 'assert';

const viewerSource = fs.readFileSync('lkg-viewer/js/LKGPhotoViewer.js', 'utf8');
assert(/downloadQuilt\(\)/.test(viewerSource), 'downloadQuilt method missing');
assert(/toDataURL\('image\/png'\)/.test(viewerSource), 'PNG export missing');
assert(/renderQuilt = prevRenderQuilt/.test(viewerSource) && /render2d = prevRender2d/.test(viewerSource), 'state restoration missing');

const popupHtml = fs.readFileSync('popup.html', 'utf8');
assert(/id="downloadQuilt"/.test(popupHtml), 'download button not found in popup.html');

const popupJs = fs.readFileSync('popup.js', 'utf8');
assert(/viewer.downloadQuilt/.test(popupJs), 'downloadQuilt hook missing in popup.js');

console.log('Quilt export tests passed');
