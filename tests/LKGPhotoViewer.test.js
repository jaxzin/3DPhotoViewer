import { jest } from "@jest/globals";
import LKGPhotoViewer from "../lkg-viewer/js/LKGPhotoViewer.js";

describe('LKGPhotoViewer photo navigation', () => {
  test('nextPhoto wraps to first photo', () => {
    const viewer = Object.create(LKGPhotoViewer.prototype);
    viewer.photos = ['1', '2', '3'];
    viewer.selectedPhoto = 2;
    viewer.reloadPhoto = jest.fn();

    viewer.nextPhoto();

    expect(viewer.selectedPhoto).toBe(0);
  });

  test('previousPhoto wraps to last photo', () => {
    const viewer = Object.create(LKGPhotoViewer.prototype);
    viewer.photos = ['1', '2', '3'];
    viewer.selectedPhoto = 0;
    viewer.reloadPhoto = jest.fn();

    viewer.previousPhoto();

    expect(viewer.selectedPhoto).toBe(2);
  });
});
