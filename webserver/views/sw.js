/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v1.0';
const RUNTIME = 'runtime-v1.0';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  '/index.html',
  '/contact.html',
  '/privacy.html',
  '/public/favicon.ico',
  '/public/favicon.png',
  '/public/ogimage.jpg',
  '/public/manifest.json',
  '/public/servers.json',
  '/shared/Util.js',
  '/public/js/game/Drawing.js',
  '/public/js/game/Game.js',
  '/public/js/game/Input.js',
  '/public/js/client.js',
  '/public/js/vanilla-picker.min.js',
  '/public/js/joy.js',
  '/socket.io/socket.io.js',
  '/node_modules/jquery/dist/jquery.min.js'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// When the browser requests a resource
addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      // Look in the cache for the resource
      caches.match(event.request).then(async response => {
        if (response) {
          return response;
        }
        // If not found fetch it from the network
        const networkResponse = await fetch(event.request);
        // Response needs to be cloned if going to be used more than once
        const clonedResponse = networkResponse.clone();
        // Save response to runtime cache for later use
        const runtimeCache = await caches.open(RUNTIME);
        runtimeCache.put(event.request, networkResponse);
        // Respond with the cloned network response
        return Promise.resolve(clonedResponse);
      })
    );
  }
});