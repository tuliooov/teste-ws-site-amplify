// importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');
// importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js');


// importScripts(`https://clientefielsp.s3-sa-east-1.amazonaws.com/firebaseWeb/${location.hostname}/firebase-messaging-sw.js`);


// console.log('firebaseConfigfirebaseConfigfirebaseConfigfirebaseConfigfirebaseConfig', firebaseConfig)

var CACHE_NAME = 'clientefiel';

var urlsToCache = [
   // '/',
    // '/static/js/bundle.js',
    // '/static/js/main.chunk.js',
    // '/static/js/1.chunk.js',
    // '/static/js/0.chunk.js',
    // '/favicon.ico',
    // '/css?family=Open+Sans',
    // '/icon?family=Material+Icons'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// self.addEventListener('push', function(event) {
//     console.log('Received a push message', event);
    
//     var title = 'Yay a message.';
//     var body = 'We have received a push message.';
//     var icon = 'YOUR_ICON';
//     var tag = 'simple-push-demo-notification-tag';
//     var data = {
//         doge: {
//             wow: 'such amaze notification data'
//         }
//     };
    
//     event.waitUntil(
//         self.registration.showNotification(title, {
//         body: body,
//         icon: icon,
//         tag: tag,
//         data: data
//         })
//     );
// });

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});  


if( (location.hostname).includes("pablodelivery") ){
    var myRequest = new Request(`https://ws.appclientefiel.com.br/rest/clientefiel/FirebaseWeb/${location.hostname}`);
    // var myRequest = new Request(`https://ws.appclientefiel.com.br/rest/clientefiel/FirebaseWeb/pablodelivery.clientefiel.app`);
    fetch(myRequest).then(function(response) {
        return response.text().then(function(text) {
            if(text !== ""){
                console.log('FIREBASE MESSAGING SW >>', text)
                firebase.initializeApp(JSON.parse(text));
                const messaging = firebase.messaging();
    
                messaging.onBackgroundMessage(function (payload) {
                    console.log('sw', payload);
                    const notificationOption={
                        body:payload.notification.body,
                        icon:payload.notification.icon
                    };

                    self.registration.showNotification(payload.notification.title,notificationOption);
                    self.registration.onclick=function (ev) {
                        ev.preventDefault();
                        self.open(payload.notification.click_action,'_blank');
                        self.registration.close();
                    }

                    // self.registration.update();
                    
                });

                // messaging.setBackgroundMessageHandler(function (payload) {
                //     return self.registration.showNotification("[BG] " + payload.data.title,
                //         Object.assign({data: payload.data}, payload.data));
                // });

                
            }
            
        });
    }).catch(console.error);
}
