const CACHE_NAME = "halaqa-v3"; // غيّر الرقم كل ما رفعت نسخة جديدة
const URLS_TO_CACHE = ["./", "./index.html"];

// وقت التثبيت: نحفظ الملفات الأساسية ونفعل الـ SW مباشرة
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

// استراتيجية: الشبكة أولاً، ولو ما فيه نت نرجع للكاش
self.addEventListener("fetch", (event) => {
  // ✅ لا نتدخل في أي طلب مو GET (مثل POST للـ Firebase)
  if (event.request.method !== "GET") {
    return; // يروح مباشرة للنت بدون كاش
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // نخزن نسخة في الكاش (GET فقط)
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
