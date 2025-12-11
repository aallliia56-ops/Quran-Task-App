const CACHE_NAME = "halaqa-v5";
const URLS_TO_CACHE = ["./", "./index.html"];

// وقت التثبيت: نحفظ الملفات الأساسية
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// وقت التفعيل: نحذف أي كاش قديم
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// الفetch:
// - طلبات GET نطبق عليها كاش بسيط
// - أي شيء غير GET (POST إلى فايربيس مثلاً) نرسله للنت مباشرة بدون كاش
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // لو مو GET → خله يروح للنت عادي
  if (req.method !== "GET") {
    event.respondWith(fetch(req));
    return;
  }

  // GET → كاش + نت
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkResp) => {
          const respClone = networkResp.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, respClone);
          });
          return networkResp;
        })
        .catch(() => cached || Promise.reject());

      // لو فيه نسخة في الكاش رجّعها مباشرة، وإلا استنى الشبكة
      return cached || fetchPromise;
    })
  );
});
