define({
	blocks: {},

	registerBlockType: function(name, cells) {
		var block = new Block(cells);
		blocks[name] = block;
	},

	Block: (function() {
		Block(cells) {
			this.cells = cells;
		}

		Block.prototype.

		return Block;
	})()
});