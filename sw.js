  const ToCacheFileList=[
    "./",
    "./index.html",
    "./manifest.json",
    "./e.png"
  ],CacheName='pwa-v5';;
  
  
  self.addEventListener('install',(event)=>{
    event.waitUntil(
      caches.open(CacheName).then((cache)=>{
        return cache.addAll(ToCacheFileList);
      }).then(()=>{
        return self.skipWaiting();
      })
    )
  });
  
  self.addEventListener('active',(event)=>{
    event.waitUntil(
      caches.open(CacheName).then((cache)=>{
        return cache.keys().then((cachekey)=>{
          return Promise.all(
            cachekey.filter((CacheKey)=>{
              return ToCacheFileList.indexOf(CacheKey) === -1;
            }).map((CacheKey)=>{
              return caches.delete(CacheKey);
            })
          )
        }).then(()=>{
          return self.clients.claim();
        })
      })
    )
  });
  
  /*
  self.addEventListener('fetch',(event)=>{
    if(event.request.method === 'GET'){
      const url=event.request.url.indexOf(self.location.origin) !== -1 ?
      event.request.url.split(`${self.location.origin}/`)[1] :
      event.request.url;
      const IsFileCached=ToCacheFileList.indexOf(url) !== -1;
      
      if(IsFileCached){
        event.respondWith(
          caches.open(CacheName).then((cache)=>{
            return cache.match(url).then((response)=>{
              if(response){
                return response;
              }
              // no url find!
            })
          }).catch((err)=>{
            return fetch(event.request);
          })
        );
      }
    }
  });
  */
  
  self.addEventListener('fetch',(event)=>{
    event.respondWith(
      caches.match(event.request).then((response)=>{
        return response || fetch(event.request);
      })
    )
  })
  
  