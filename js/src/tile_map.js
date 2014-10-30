/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var TileMap = function() {
	this.negArr = new Array();
	this.posArr = new Array();

	this.xFirstNdx = 0;
	this.xLastNdx = 0;
	this.yFirstNdx = 0;
	this.yLastNdx = 0;
}

TileMap.prototype.put = function(x, y, val) {
	if (x < 0) {
		if (y < 0) {
			if (!this.negArr[-x])
				this.negArr[-x] = {
					negArr : new Array(-y+1),
					posArr : new Array()
				};
			this.negArr[-x].negArr[-y] = val;
		} else {
			if (!this.negArr[-x])
				this.negArr[-x] = {
					negArr : new Array(),
					posArr : new Array(y+1)
				};
			this.negArr[-x].posArr[y] = val;
		}
	} else {
		if (y < 0) {
			if (!this.posArr[x])
				this.posArr[x] = {
					negArr : new Array(-y+1),
					posArr : new Array()
				};
			this.posArr[x].negArr[-y] = val;
		} else {
			if (!this.posArr[x])
				this.posArr[x] = {
					negArr : new Array(),
					posArr : new Array(y+1)
				};
			this.posArr[x].posArr[y] = val;
		}
	}

	this.updateBounds(x, y);
}

TileMap.prototype.updateBounds = function(x, y) {
	if (x < this.xFirstNdx)
		this.xFirstNdx = x;
	if (x > this.xLastNdx)
		this.xLastNdx = x;
	if (y < this.yFirstNdx)
		this.yFirstNdx = y;
	if (y > this.yLastNdx)
		this.yLastNdx = y;
}

TileMap.prototype.get = function(x, y) {
	if (x < 0) {
		if (y < 0) {
			if (this.negArr[-x] && this.negArr[-x].negArr[-y])
				return this.negArr[-x].negArr[-y];
		} else {
			if (this.negArr[-x] && this.negArr[-x].posArr[y])
				return this.negArr[-x].posArr[y];
		}
	} else {
		if (y < 0) {
			if (this.posArr[x] && this.posArr[x].negArr[-y])
				return this.posArr[x].negArr[-y];
		} else {
			if (this.posArr[x] && this.posArr[x].posArr[y])
				return this.posArr[x].posArr[y];
		}
	}

	return null;
}

// TODO : updateBounds when removing something
TileMap.prototype.remove = function(x, y) {
	if (x < 0) {
		if (y < 0) {
			if (this.negArr[-x] && this.negArr[-x].negArr[-y])
				delete this.negArr[-x].negArr[-y];
		} else {
			if (this.negArr[-x] && this.negArr[-x].posArr[y])
				delete this.negArr[-x].posArr[y];
		}
	} else {
		if (y < 0) {
			if (this.posArr[x] && this.posArr[x].negArr[-y])
				delete this.posArr[x].negArr[-y];
		} else {
			if (this.posArr[x] && this.posArr[x].posArr[y])
				delete this.posArr[x].posArr[y];
		}
	}
}

TileMap.prototype.exists = function(x, y) {
	if (x < 0) {
		if (y < 0) {
			if (this.negArr[-x] && this.negArr[-x].negArr[-y])
				return true;
		} else {
			if (this.negArr[-x] && this.negArr[-x].posArr[y])
				return true;
		}
	} else {
		if (y < 0) {
			if (this.posArr[x] && this.posArr[x].negArr[-y])
				return true;
		} else {
			if (this.posArr[x] && this.posArr[x].posArr[y])
				return true;
		}
	}

	return false;
}


TileMap.prototype.toString = function() {
	var str = "_|";

	for (var x = this.xFirstNdx; x <= this.xLastNdx; x++)
		str += x + "_";
	str += "\n";

	for (var y = this.yFirstNdx; y <= this.yLastNdx; y++) {
		str += y + "|";
		for (var x = this.xFirstNdx; x <= this.xLastNdx; x++) {
			var val = this.exists(x,y) ? "X" : "-";
			str +=  val + "|";
		}
		str += "\n";
	}

	return str;
}

