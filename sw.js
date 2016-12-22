// Install the service worker
this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            // The cache will fail if any of these resources can't be saved
            return cache.addAll(
                [
                    // Path is relative to the origin,
                    // not the app directory
                    '/',
                    '/index.html',
                    '/css/styles.css',
                    '/css/container.css',
                    '/css/loading-screen.css',
                    '/css/main-menu.css',
                    '/css/credits.css',
                    '/css/message.css',
                    '/css/menu-top.css',
                    '/css/menu-bottom.css',
                    '/css/map.css',
                    '/css/status.css',
                    '/css/stage.css',
                    '/css/skill-icon.css',
                    '/css/players.css',
                    '/css/players-status.css',
                    '/css/enemies.css',
                    '/sw.js',
                    '/js/vendor/jquery-2.2.3.min.js',
                    '/js/vendor/preloadjs-0.6.2.min.js',
                    '/js/vendor/soundjs-0.6.2.min.js',
                    '/js/utils.js',
                    '/js/loading-screen.js',
                    '/js/enemy-registry.js',
                    '/js/map-registry.js',
                    '/js/status.js',
                    '/js/status-registry.js',
                    '/js/skill-data.js',
                    '/js/class-data.js',
                    '/js/data.js',
                    '/js/skill.js',
                    '/js/player-render.js',
                    '/js/player.js',
                    '/js/enemy-render.js',
                    '/js/enemy.js',
                    '/js/message.js',
                    '/js/audio.js',
                    '/js/top-menu.js',
                    '/js/status-menu.js',
                    '/js/map-menu.js',
                    '/js/stage.js',
                    '/js/battle.js',
                    '/js/content.js',
                    '/js/api.js',
                    '/js/controls.js',
                    '/js/credits.js',
                    '/js/main-menu.js',
                    '/js/main.js',
                    '/img/favicon.ico',
                    '/img/favicon.png',
                    '/img/favicon-16x16.png',
                    '/img/favicon-32x32.png',
                    '/img/android-chrome-96x96.png',
                    '/img/apple-touch-icon.png',
                    '/img/safari-pinned-tab.svg',
                    '/assets/start.jpg',
                    '/assets/audio/01. Title.mp3',
                    '/assets/audio/01. One Step Closer.mp3',
                    '/assets/audio/05. Tread On The Ground.mp3',
                    '/assets/audio/10. Splendid Dreams.mp3',
                    '/assets/audio/11. Rag All Night Long.mp3',
                    '/assets/audio/12. Streamside.mp3',
                    '/assets/map/map.png',
                    '/assets/message/corner.png',
                    '/assets/icons/atk.gif',
                    '/assets/icons/def.gif',
                    '/assets/icons/exp.gif',
                    '/assets/icons/items.gif',
                    '/assets/icons/zeny.gif',
                    '/assets/icons/shop.gif',
                    '/assets/icons/lvl_out.gif',
                    '/assets/icons/lvl_over.gif',
                    '/assets/item/carrot.gif',
                    '/assets/character/archer.png',
                    '/assets/character/healer.png',
                    '/assets/character/mage.png',
                    '/assets/character/swordsman.png',
                    '/assets/class/archer/ac_double.gif',
                    '/assets/class/archer/ac_shower.gif',
                    '/assets/class/archer/ac_vulture.gif',
                    '/assets/class/acolyte/al_heal.gif',
                    '/assets/class/acolyte/al_angelus.gif',
                    '/assets/class/acolyte/al_blessing.gif',
                    '/assets/class/mage/mg_firebolt.gif',
                    '/assets/class/mage/wz_meteor.gif',
                    '/assets/class/mage/mg_srecovery.gif',
                    '/assets/class/swordsman/sm_bash.gif',
                    '/assets/class/swordsman/sm_magnum.gif',
                    '/assets/class/swordsman/sm_recovery.gif',
                    '/assets/enemy/poring.gif',
                    '/assets/enemy/poporing.gif',
                    '/assets/enemy/drops.gif',
                    '/assets/enemy/marine.gif',
                    '/assets/enemy/poring_king.gif',
                    '/assets/enemy/fabre.gif',
                    '/assets/enemy/lunatic.gif',
                    '/assets/enemy/rodra.gif',
                    '/assets/enemy/rocker.gif',
                    '/assets/enemy/eclipse.gif',
                    '/assets/map/map.png',
                    '/assets/message/corner.png',
                    '/manifest.json',
                ]
            ).then(
                function() {
                    // Now available offline!
                }
            );
        })
    );
});

// Define what happens when a resource is requested.
// For our app, we can do a cache-first approach.
self.addEventListener('fetch', function(event) {
    event.respondWith(
        // Try the cache
        caches.match(event.request).then(
            function(response) {
                // Fallback to network if resource is not stored in cache.
                return response || fetch(event.request);
            }
        )
    );
});