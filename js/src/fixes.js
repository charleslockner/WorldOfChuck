if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function() {
 
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			window.setTimeout( callback, 1000 / 60 );
		};
	})();
}

var POINTER_LOCK_CHANGE = null;
if ("onpointerlockchange" in document) {
	POINTER_LOCK_CHANGE = 'pointerlockchange';
} else if ("onmozpointerlockchange" in document) {
	POINTER_LOCK_CHANGE = 'mozpointerlockchange';
} else if ("onwebkitpointerlockchange" in document) {
	POINTER_LOCK_CHANGE = 'webkitpointerlockchange';
}

var PI = 3.14159;
