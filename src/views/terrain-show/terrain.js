getDem('/json/places.json', (dem) => {
  console.log(dem);
  postMessage({ ready: true });
});

function getDem(url, cbk) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300 && xhr.response) {
      cbk(xhr.response);
    }
  };
  xhr.send();
}
