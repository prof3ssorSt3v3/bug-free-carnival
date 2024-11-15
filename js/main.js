import { getImageBlob, loadImage } from './canvas.js';
import { findCachedFile, cacheFile } from './cache.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
  let img = document.querySelector('img');
  img.addEventListener('load', (ev) => {
    console.log('image loaded on page');
    loadImage(ev.target);
  });
  img.addEventListener('error', (ev) => {
    console.warn('Image failed to load.');
  });
  //load the image now so we have time to listen for the load event
  img.src = './img/puppy.jpg';
  //to load an image on to the canvas is must pass the CORS rules (be from the same origin)

  document.getElementById('btnBlob').addEventListener('click', getBlob);
  document.getElementById('btnLoad').addEventListener('click', findImageFromCache);
  document.querySelector('form').addEventListener('submit', handleSubmit);
}

function handleSubmit(ev) {
  ev.preventDefault();
  let input = document.getElementById('imgfile');
  let file = input.files[0];
  if (file) {
    console.log(file.name);
    let response = new Response(file, {
      status: 200,
      headers: {
        'content-type': file.type,
        'content-length': file.size,
      },
    });
    cacheFile(file.name, response).then((result) => {
      if (result) {
        console.log('File image saved in cache');
      } else {
        console.log('Failed to save image in cache');
      }
    });
  }
}

function getBlob() {
  let type = 'image/webp';
  getImageBlob(type)
    .then((blob) => {
      //we have a blob which could be turned into a file
      let file = new File([blob], 'mycanvasimage.webp', { size: blob.size });
      let response = new Response(file, {
        status: 200,
        headers: {
          'content-type': type,
          'content-length': blob.size,
        },
      });
      console.log(blob);
      console.log(file);
      console.log(response);
      cacheFile('/puppy-cached.webp', response).then((result) => {
        if (result) {
          console.log('Puppy image saved in cache');
        } else {
          console.log('Failed to save image in cache');
        }
      });
    })
    .catch((err) => {
      console.warn(err.message);
    });
}

function findImageFromCache() {
  let url = '/puppy-cached.webp'; //or leave empty to get the first thing in the cache
  findCachedFile()
    .then((response) => {
      if (!response) throw new Error('could not get image from cache');
      return response.blob();
    })
    .then((blob) => {
      //put on page
      let url = URL.createObjectURL(blob);
      let p = document.createElement('p');
      let img = document.createElement('img');
      img.src = url;
      p.append(img);
      document.body.append(p);
    });
}
