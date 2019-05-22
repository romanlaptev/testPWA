var func = sharedFunc();
//console.log("func:", func);

var support=false;
const FILES_TO_CACHE = [
"css/bootstrap335.min.css"//,
//"pages/",
//"pages/index.html",
//"pages/style.css",
//"pages/app.js",
//"pages/image-list.js",
//"pages/star-wars-logo.jpg",
//"pages/gallery/bountyHunters.jpg",
//"pages/gallery/myLittleVader.jpg",
//"pages/gallery/snowTroopers.jpg"
];

var logMsg;
logMsg = navigator.userAgent;
func.logAlert(logMsg, "info");

var test =  typeof window.Promise !== "undefined";
logMsg = "Promise support:" + test;
if( test ){
	func.logAlert(logMsg, "success");
} else {
	func.logAlert(logMsg, "error");
}

if( window.location.protocol !== "https:"){
	logMsg = "error,  serviceWorker requires 'https:' protocol....";
	logMsg += "but used: " + window.location.protocol;
	func.logAlert(logMsg, "error");
}


registerServiceWorker();
defineEvents();

function registerServiceWorker() {
	var test = "serviceWorker" in navigator;
//console.log(test);	
	if (!test) {
		logMsg = "CLIENT: service worker is not supported."
		func.logAlert(logMsg, "error");
		return false;
	}
	
	logMsg = "CLIENT: service worker registration in progress.";
	func.logAlert(logMsg, "info");
	
	window.addEventListener('load', function() {
		navigator.serviceWorker.register("sw.js").then(function(reg) {
			logMsg = "Registration succeeded. Scope is " + reg.scope;
func.logAlert(logMsg, "success");
			
			if(reg.installing) {
logMsg="Service worker installing";
func.logAlert( logMsg, "info" );
			}
			if(reg.waiting) {
logMsg="Service worker waiting";
func.logAlert( logMsg, "info" );
			}
			if(reg.active) {
logMsg="Service worker active";
func.logAlert( logMsg, "info" );
			}
			
			support = true;
			_getListCaches();
		}, 

		function(err) {
logMsg="ServiceWorker registration failed";
func.logAlert( logMsg, "error" );
console.log(err);
		})
		
		.catch( function(error) {
logMsg = "Registration failed."
func.logAlert(logMsg, "error");
console.log(error);
		});
	 
	});//end event

}//end registerServiceWorker()

function defineEvents(){

	var btn_clear_log = document.querySelector("#btn-clear-log");
	btn_clear_log.onclick = function(){
		log.innerHTML = "";
	};
	
	var cacheNameField = document.querySelector("#cache-name");
	var cacheKeyField = document.querySelector("#cache-key");
	
	var btn_list_cache_keys = document.querySelector("#btn-list-cache-keys");
	btn_list_cache_keys.onclick = function(e){
//console.log(e);
		if(!support){
			return false;
		}
		
		var cacheName = cacheNameField.value;
//console.log(cacheName);
		if( !cacheName || cacheName.length===0 ){
logMsg="<b>Object cache name</b> is empty....";
func.logAlert( logMsg, "warning" );
			return false;
		}

		caches.has( cacheName ).then(function(res){
//console.log(res);	
			if( !res){
logMsg="Cache object " +cacheName+ " not found....";
func.logAlert( logMsg, "warning" );
				return false;
			} else {
				_getKeys( cacheName );
			}
		});
	}//end event

	var btn_list_caches = document.querySelector("#btn-list-caches");
	btn_list_caches.onclick = function(e){
		_getListCaches();
	}//end event

	var btn_delete_cache = document.querySelector("#btn-delete-cache");
	btn_delete_cache.onclick = function(e){
		if(!support){
			return false;
		}
		var cacheName = cacheNameField.value;
//console.log(cacheName);
		if( !cacheName || cacheName.length===0 ){
logMsg="<b>Object cache name</b> is empty....";
func.logAlert( logMsg, "warning" );
			return false;
		}
		caches.delete( cacheName ).then( function( res ){
//console.log(res);
			if(res){
logMsg="Cache object " +cacheName+ " was removed....";
func.logAlert( logMsg, "success" );
				_getListCaches();
			} else {
logMsg="Cache object " +cacheName+ " not found....";
func.logAlert( logMsg, "warning" );
			}
		},
		function(err) {
console.log(err);
		});

	}//end event


	var btn_add_all_cache = document.querySelector("#btn-add-all-cache");
	btn_add_all_cache.onclick = function(e){
		if(!support){
			return false;
		}
		var cacheName = cacheNameField.value;
//console.log(cacheName);
		if( !cacheName || cacheName.length===0 ){
logMsg="<b>Object cache name</b> is empty....";
func.logAlert( logMsg, "warning" );
			return false;
		}
		caches.open(cacheName).then(function( cache ){// add all caching resource URLs
		
			cache.addAll( FILES_TO_CACHE ).then(function(){
logMsg="Pre-caching offline recources: " + FILES_TO_CACHE.toString();
func.logAlert( logMsg, "success" );
console.log(FILES_TO_CACHE.toString() );
				_getKeys( cacheName );
			});
			//return _cache;
		});
		
	}//end event


	var btn_delete_key = document.querySelector("#btn-delete-key");
	btn_delete_key.onclick = function(e){
		if(!support){
			return false;
		}
		var cacheName = cacheNameField.value;
//console.log(cacheName);
		if( !cacheName || cacheName.length===0 ){
logMsg="<b>Object cache name</b> is empty....";
func.logAlert( logMsg, "warning" );
			return false;
		}
		
		//var cacheKey = "css/bootstrap335.min.css";
		var cacheKey = cacheKeyField.value;
//console.log(cacheKey);
		if( !cacheKey || cacheKey.length===0 ){
logMsg="<b>cache key</b> is empty....";
func.logAlert( logMsg, "warning" );
			return false;
		}

		caches.open( cacheName ).then(function( cache ){
			cache.delete( cacheKey ).then(function( res ){
				if(res){
logMsg=cacheKey + " was removed....";
func.logAlert( logMsg, "success" );
				} else {
logMsg=cacheKey + " not found....";
func.logAlert( logMsg, "warning" );
				}
				
			});
		});
	}//end event


	var btn_match_key = document.querySelector("#btn-match-key");
	btn_match_key.onclick = function(e){
		if(!support){
			return false;
		}
		var cacheName = cacheNameField.value;
//console.log(cacheName);
		if( !cacheName || cacheName.length===0 ){
logMsg="<b>Object cache name</b> is empty....";
func.logAlert( logMsg, "warning" );
			return false;
		}
		
		var cacheKey = cacheKeyField.value;
//console.log(cacheKey);
		if( !cacheKey || cacheKey.length===0 ){
logMsg="<b>cache key</b> is empty....";
func.logAlert( logMsg, "warning" );
			return false;
		}

		caches.open( cacheName ).then(function( cache ){
			cache.match( cacheKey ).then(function( response ){
console.log(response);				
				if( response ){
logMsg=cacheKey + " was cached...";
func.logAlert( logMsg, "success" );
				} else {
logMsg=cacheKey + " not found in cache....";
func.logAlert( logMsg, "warning" );
				}
				
			});
		});
	}//end event


	var btn_addKey = document.querySelector("#btn-add-key");
	btn_addKey.onclick = function(e){
		if(!support){
			return false;
		}
		var cacheName = cacheNameField.value;
//console.log(cacheName);
		if( !cacheName || cacheName.length===0 ){
logMsg="<b>Object cache name</b> is empty....";
func.logAlert( logMsg, "warning" );
			return false;
		}
		
		var url = cacheKeyField.value;
//console.log(cacheKey);
		if( !url || url.length===0 ){
logMsg="<b>URL</b> is empty (field cache key)....";
func.logAlert( logMsg, "warning" );
			return false;
		}

		caches.open( cacheName ).then(function( cache ){
			cache.add( url ).then(function( response ) {//https://developer.mozilla.org/ru/docs/Web/API/Cache/add			
console.log( response );
logMsg="<b>URL " +url+ "</b> loaded and added to cache " +cacheName;
func.logAlert( logMsg, "success" );
			});
		});
	}//end event


	var btn_test = document.querySelector("#btn-test");
	btn_test.onclick = function(e){
		if(!support){
			return false;
		}
		var cacheName = cacheNameField.value;
//console.log(cacheName);
		if( !cacheName || cacheName.length===0 ){
logMsg="<b>Object cache name</b> is empty....";
func.logAlert( logMsg, "warning" );
			return false;
		}
		
		cacheKeyField.value = "pages/_star-wars-logo.jpg";//url for load image
		var key = "pages/star-wars-logo.jpg";//cache image under different name
		
		var url = cacheKeyField.value;
//console.log(url);

		caches.open( cacheName ).then(function( cache ){
			
			fetch( url ).then(function (response){
console.log( response );
				if (!response.ok) {
					throw new TypeError('bad response status');
				} else {
logMsg="Image by url "+url+" cached under name " + key+", reload page and see image....";
func.logAlert( logMsg, "success" );
				}
				return cache.put( key, response);
			})				

		});
	}//end event


	var btn_swUnReg = document.querySelector("#btn-sw-unregister");
	btn_swUnReg.onclick = function(e){
		navigator.serviceWorker.getRegistrations().then(function(registrations) {
console.log( registrations );
			 // for(let registration of registrations) {
			  // registration.unregister()
			// }//next
		})
	}//end event

	var btn_swUpd = document.querySelector("#btn-sw-update");
	btn_swUpd.onclick = function(e){
		navigator.serviceWorker.getRegistrations().then(function(registrations) {
console.log( registrations );
			 // for(let registration of registrations) {
			  // registration.unregister()
			// }//next
		})
	}//end event


}//end defineEvents()

function _getListCaches(){
		if(!support){
			return false;
		}

		caches.keys().then( function(keyList) {
console.log( keyList);
			if( keyList.length > 0){
				
func.log("<h4>List cache objects</h4>");
			var html = "<ul class='list-unstyled'>{{list}}</ul>";
			var listHtml = "";
			for( var n = 0; n < keyList.length; n++){
				listHtml += "<li class='list-group-item'>" + keyList[n] + "</li>";					
			}//next
			html = html.replace("{{list}}", listHtml);
func.log(html);
					// return Promise.all( keyList.map( function (key) {
		// console.log(key);
								// //return caches.delete(key);
						// })
					// );
	
			} else {
logMsg="not found cache objects...";
func.logAlert( logMsg, "warning" );
			}
			
		});
}//end _getListCaches()		

function _getKeys( cacheName ){
	caches.open( cacheName ).then( function(cache) {
//console.log("TEST:", cache);	
		cache.keys().then( function(keyList) {
				if( keyList.length > 0){
console.log("CACHE key list:", keyList);
func.log("<h4>Key list, cache object <b>"+cacheName+"</b></h4>");
						var html = "<ol class='list-unstyled'>{{list}}</ol>";
						var listHtml = "";
						for( var n = 0; n < keyList.length; n++){
							listHtml += "<li class='list-group-item'>" + keyList[n]["url"] + "</li>";
						}//next
						html = html.replace("{{list}}", listHtml);
func.log(html);
				} else {
logMsg="no keys found in object cache " + cacheName;
func.logAlert( logMsg, "warning" );
				}
			});
	});
}//end _getKeys()
