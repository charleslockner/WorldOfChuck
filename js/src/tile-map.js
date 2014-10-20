/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var TileMap = function(tileWidth, tileHeight) {
	this.negArr = new Array();
	this.posArr = new Array();
	this.ndxArr = new Uint32Array();

	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
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
}

TileMap.prototype.get = function(x, y) {
	if (x < 0) {
		if (y < 0) {
			if (this.negArr[-x] && this.negArr[-x].negArr[-y])
				return this.negArr[-x].negArr[-y];
			else
				return null;
		} else {
			if (this.negArr[-x] && this.negArr[-x].posArr[y])
				return this.negArr[-x].posArr[y];
			else
				return null;
		}
	} else {
		if (y < 0) {
			if (this.posArr[x] && this.posArr[x].negArr[-y])
				return this.posArr[x].negArr[-y];
			else
				return null;
		} else {
			if (this.posArr[x] && this.posArr[x].posArr[y])
				return this.posArr[x].posArr[y];
			else
				return null;
		}
	}
}

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

// var tileArray = new TileArray();
// tileArray.put(1,1,{val:10, str:"hi"});
// tileArray.put(1,-1,{val:20, str:"hi"});
// tileArray.put(-1,1,{val:30, str:"hi"});
// tileArray.put(-1,-1,{val:40, str:"hi"})
// console.log(tileArray.get(1,1));
// console.log(tileArray.get(1,-1));
// console.log(tileArray.get(-1,1));
// console.log(tileArray.get(-1,-1));
// console.log(tileArray.get(10,10));
// console.log(tileArray.get(10,-10));
// console.log(tileArray.get(-10,10));
// console.log(tileArray.get(-10,-10));
// tileArray.remove(1,1);
// console.log(tileArray.get(1,1));

