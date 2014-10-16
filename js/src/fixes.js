/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

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

var launchIntoFullscreen = function(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

var PI = 3.14159;
