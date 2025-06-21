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

  test('updatePhotos loads last photo when new photo is added', () => {
    const viewer = Object.create(LKGPhotoViewer.prototype);
    viewer.photos = ['1'];
    viewer.lastPhoto = jest.fn();

    viewer.updatePhotos(['1', '2']);

    expect(viewer.lastPhoto).toHaveBeenCalled();
    expect(viewer.photos).toEqual(['1', '2']);
  });

  test('updatePhotos does not reload when photo count unchanged', () => {
    const viewer = Object.create(LKGPhotoViewer.prototype);
    viewer.photos = ['1', '2'];
    viewer.lastPhoto = jest.fn();

    viewer.updatePhotos(['3', '4']);

    expect(viewer.lastPhoto).not.toHaveBeenCalled();
    expect(viewer.photos).toEqual(['3', '4']);
  });

  test('setDollyLocation updates value and calls updateLoadedPhoto', () => {
    const viewer = Object.create(LKGPhotoViewer.prototype);
    viewer.updateLoadedPhoto = jest.fn();

    viewer.setDollyLocation(1);

    expect(viewer.dollyLocation).toBe(1);
    expect(viewer.updateLoadedPhoto).toHaveBeenCalled();
  });

  test('dollyIn and dollyOut adjust dollyLocation', () => {
    const viewer = Object.create(LKGPhotoViewer.prototype);
    viewer.dollyLocation = 0;
    viewer.setDollyLocation = jest.fn();

    viewer.dollyIn();
    expect(viewer.setDollyLocation).toHaveBeenCalledWith(LKGPhotoViewer._DOLLY_STEP);

    viewer.setDollyLocation.mockClear();
    viewer.dollyLocation = 0.02;
    viewer.dollyOut();
    expect(viewer.setDollyLocation).toHaveBeenCalledWith(0.02 - LKGPhotoViewer._DOLLY_STEP);
  });
});
