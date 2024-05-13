// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import 'jest-canvas-mock';
fetchMock.enableMocks();
require('jest-fetch-mock').enableMocks()

HTMLCanvasElement.prototype.getContext = () => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: (x, y, w, h) => ({
        data: new Array(w * h * 4).fill(0) // Fills the array with zeros
    }),
    putImageData: () => {},
    createImageData: () => ({ width: 0, height: 0, data: [] }),
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    strokeText: (text, x, y, maxWidth) => {}, // Mocking strokeText as well
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
});

// console.log("Setup file is loaded!");
