let canvas, context;

(() => {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  console.log('canvas.js loaded');
})();

function loadImage(imgElement) {
  let w = imgElement.naturalWidth; //clientWidth, width
  let h = imgElement.naturalHeight; //clientHeight, height
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  context.drawImage(imgElement, 0, 0);
}

function getImageBlob(type) {
  //convert the canvas data into a blob
  //let's wrap it in a promise for fun
  return new Promise((resolve, reject) => {
    canvas.toBlob(callback, type, 1.0);
    function callback(blob) {
      //blob is null or a blob
      if (blob != null) resolve(blob);
      //null is error
      reject(new Error('Could not extract image'));
    }
  });
}

//no need to export canvas and context
export { loadImage, getImageBlob };
