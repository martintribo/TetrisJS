define({
	blocks: {},
	block_list: [],
	num_blocks: 0,

	registerBlockType: function(name, cells) {
		var block = {
			name: name,
			cells: cells
		};
		this.blocks[name] = block;
		this.block_list[this.num_blocks] = block;
		this.num_blocks++;
	},
	randomBlock: function() {
		var block_id = Math.floor(Math.random() * this.num_blocks);
		var block_type = this.block_list[block_id];
		var block_data = {
			cells: block_type.cells,
			color: 'red'
		};

		var block = new this.Block(block_data);

		return block;
	},

	Block: (function() {
		function Block(data) {
			this.cells = data.cells;
			this.color = data.color;
			this.rotation = 0;
			this.x = 0;
			this.y = 0;
		}

		Block.prototype.beneath = function(spot) {
			for (var i = 0; i < this.cells.length; i++) {
				var c = this.cells[i];
				if (c.y + this.y > spot) {
					return true;
				}
			}

			return false;
		};

		Block.prototype.leftOf = function(spot) {
			if (this.x < spot) {
				return true;
			}

			return false;
		};

		Block.prototype.rightOf = function(spot) {
			for (var i = 0; i < this.cells.length; i++) {
				var c = this.cells[i];
				if (c.x + this.x > spot) {
					return true;
				}
			}

			return false;
		};

		Block.prototype.rotateCW = function() {

		};

		Block.prototype.rotateCCW = function() {

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

		Block.prototype.getCells = function() {
			return this.cells;
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