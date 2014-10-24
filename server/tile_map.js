/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var negArr = new Array();
var posArr = new Array();

var xFirstNdx = 0;
var xLastNdx = 0;
var yFirstNdx = 0;
var yLastNdx = 0;

module.exports.xFirstNdx = xFirstNdx;
module.exports.xLastNdx = xLastNdx;
module.exports.yFirstNdx = yFirstNdx;
module.exports.yLastNdx = yLastNdx;

module.exports.put = function(x, y, val) {
	if (x < 0) {
		if (y < 0) {
			if (!negArr[-x])
				negArr[-x] = {
					negArr : new Array(-y+1),
					posArr : new Array()
				};
			negArr[-x].negArr[-y] = val;
		} else {
			if (!negArr[-x])
				negArr[-x] = {
					negArr : new Array(),
					posArr : new Array(y+1)
				};
			negArr[-x].posArr[y] = val;
		}
	} else {
		if (y < 0) {
			if (!posArr[x])
				posArr[x] = {
					negArr : new Array(-y+1),
					posArr : new Array()
				};
			posArr[x].negArr[-y] = val;
		} else {
			if (!posArr[x])
				posArr[x] = {
					negArr : new Array(),
					posArr : new Array(y+1)
				};
			posArr[x].posArr[y] = val;
		}
	}

	updateBounds(x, y);
}

var updateBounds = function(x, y) {
	if (x < xFirstNdx)
		xFirstNdx = x;
	if (x > xLastNdx)
		xLastNdx = x;
	if (y < yFirstNdx)
		yFirstNdx = y;
	if (y > yLastNdx)
		yLastNdx = y;
}

module.exports.get = function(x, y) {
	if (x < 0) {
		if (y < 0) {
			if (negArr[-x] && negArr[-x].negArr[-y])
				return negArr[-x].negArr[-y];
		} else {
			if (negArr[-x] && negArr[-x].posArr[y])
				return negArr[-x].posArr[y];
		}
	} else {
		if (y < 0) {
			if (posArr[x] && posArr[x].negArr[-y])
				return posArr[x].negArr[-y];
		} else {
			if (posArr[x] && posArr[x].posArr[y])
				return posArr[x].posArr[y];
		}
	}

	return undefined;
}

// TODO : updateBounds when removing something
module.exports.remove = function(x, y) {
	if (x < 0) {
		if (y < 0) {
			if (negArr[-x] && negArr[-x].negArr[-y])
				delete negArr[-x].negArr[-y];
		} else {
			if (negArr[-x] && negArr[-x].posArr[y])
				delete negArr[-x].posArr[y];
		}
	} else {
		if (y < 0) {
			if (posArr[x] && posArr[x].negArr[-y])
				delete posArr[x].negArr[-y];
		} else {
			if (posArr[x] && posArr[x].posArr[y])
				delete posArr[x].posArr[y];
		}
	}
}

module.exports.exists = function(x, y) {
	if (x < 0) {
		if (y < 0) {
			if (negArr[-x] && negArr[-x].negArr[-y])
				return true;
		} else {
			if (negArr[-x] && negArr[-x].posArr[y])
				return true;
		}
	} else {
		if (y < 0) {
			if (posArr[x] && posArr[x].negArr[-y])
				return true;
		} else {
			if (posArr[x] && posArr[x].posArr[y])
				return true;
		}
	}

	return false;
}


module.exports.toString = function() {
	var str = "_|";

	for (var x = xFirstNdx; x <= xLastNdx; x++)
		str += x + "_";
	str += "\n";

	for (var y = yFirstNdx; y <= yLastNdx; y++) {
		str += y + "|";
		for (var x = xFirstNdx; x <= xLastNdx; x++) {
			var val = exists(x,y) ? "X" : "-";
			str +=  val + "|";
		}
		str += "\n";
	}

	return str;
}
