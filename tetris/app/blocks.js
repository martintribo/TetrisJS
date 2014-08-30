define({
	blocks: {},
	block_list: [],
	num_blocks: 0,

	registerBlockType: function(name, cells, kicks, color) {
		var block = {
			name: name,
			cells: cells,
			kicks: kicks,
			color: color
		};
		this.blocks[name] = block;
		this.block_list[this.num_blocks] = block;
		this.num_blocks++;
	},
	randomBlock: function() {
		var block_id = Math.floor(Math.random() * this.num_blocks);
		var block_type = this.block_list[block_id];
		//var block_data = {
		//	cells: block_type.cells,
		//	color: block_type.color
		//};

		var block = new this.Block(block_type);

		return block;
	},

	Block: (function() {
		function Block(data) {
			this.cells = data.cells;
			this.kicks = data.kicks;
			this.color = data.color;
			this.rotation = 0;
			this.x = 0;
			this.y = 0;
		}

		Block.prototype.beneath = function(spot) {
			for (var i = 0; i < this.getCells().length; i++) {
				var c = this.getCells()[i];
				if (c.y + this.y > spot) {
					return true;
				}
			}

			return false;
		};

		Block.prototype.leftOf = function(spot) {
			for (var i = 0; i < this.getCells().length; i++) {
				var c = this.getCells()[i];
				if (c.x + this.x < spot) {
					return true;
				}
			}

			return false;
		};

		Block.prototype.rightOf = function(spot) {
			for (var i = 0; i < this.getCells().length; i++) {
				var c = this.getCells()[i];
				
				if (c.x + this.x > spot) {
					return true;
				}
			}

			return false;
		};

		Block.prototype.rotateCW = function() {
			var kicks = this.kicks[this.rotation];
			this.rotation = (this.rotation + 1) % 4;

			return kicks;
		};

		Block.prototype.rotateCCW = function() {
			this.rotation = (this.rotation + 3) % 4;

			var kicks_neg = this.kicks[this.rotation];
			var kicks = new Array(kicks_neg.length);

			for (var i = 0; i < kicks.length; i++) {
				kicks[i] = {x: -kicks_neg[i].x, y: -kicks_neg[i].y};
			}

			return kicks;
		};

		Block.prototype.collidingWithList = function(list) {
			return false;
		};

		Block.prototype.moveDown = function() {
			this.y++;
		};

		Block.prototype.moveUp = function() {
			this.y--;
		};

		Block.prototype.moveLeft = function() {
			this.x--;
		};

		Block.prototype.moveRight = function() {
			this.x++;
		};

		Block.prototype.shift = function(offset) {
			this.x += offset.x;
			this.y += offset.y;
		};

		Block.prototype.getCells = function() {
			return this.cells[this.rotation];
		};
		Block.prototype.getX = function() {
			return this.x;
		};
		Block.prototype.getY = function() {
			return this.y;
		};
		Block.prototype.getColor = function() {
			return this.color;
		};

		return Block;
	})()
});