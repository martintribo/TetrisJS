define(['app/blocks'], function(block_manager) {
	blocks: [],
	rows: 20,
	columns: 10,
	moving_block: null,

	tick: function() {
		moving_block.y--;

		if (moving_block.beneath(0) || moving_block.collidingWithList(blocks)) {
			y++;
			placeBlock();
		}
	},
	placeBlock: function() {
		blocks.push(moving_block);

		moving_block = block_manager.randomBlock();
		moving_block.x = 10;
		moving_block.y = 19;
	},
	shiftBlockRight: function() {
		moving_block.x++;

		if (moving_block.rightOf(columns - 1) || moving_block.collidingWithList(blocks)) {
			moving_block.x--;
		}
	},
	shiftBlockLeft: function() {
		moving_block.x--;

		if (moving_block.leftOf(0) || moving_block.collidingWithList(blocks)) {
			moving_block.x++;
		}
	},
	rotateBlockCW: function() {
		moving_block.rotateCW();

		if (moving_block.leftOf(0) || moving_block.rightOf(columns - 1) || moving_block.beneath(0) || moving_block.collidingWithList(blocks)) {
			moving_block.rotateCCW();
		}
	},
	rotateBlockCCW: function() {
		moving_block.rotateCCW();

		if (moving_block.leftOf(0) || moving_block.rightOf(columns - 1) || moving_block.beneath(0) || moving_block.collidingWithList(blocks)) {
			moving_block.rotateCW();
		}
	}
});