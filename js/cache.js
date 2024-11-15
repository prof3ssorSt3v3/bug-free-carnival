const cacheName = 'FridayImages';
let cache = null;

caches.open(cacheName).then((_cache) => {
  cache = _cache;
});

async function findCachedFile(url) {
  let request;
  if (url) {
    request = new Request(url);
  } else {
    //go to the cache and pick the end of the list
    request = await cache.keys().then((keys) => {
      console.log(keys);
      return new Request(keys[keys.length - 1]);
    });
  }
  return cache
    .match(request)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((err) => {
      console.warn('Failed to access cache');
      return null;
    });
}

function cacheFile(url, response) {
  let request = new Request(url);

  return cache
    .put(request, response)
    .then(() => {
      //file is saved in cache
      return true;
    })
    .catch((err) => {
      return false;
    });
}

export { findCachedFile, cacheFile };
