define(['app/blocks'], function(block_manager) {
	var Board = function() {
		this.blocks = [];
		this.rows = 20;
		this.columns = 10;
		this.setupNewBlock();
	}

	Board.prototype.tick = function() {
		this.moving_block.moveDown();

		if (this.moving_block.beneath(this.rows-1) || this.moving_block.collidingWithList(this.blocks)) {
			this.moving_block.moveUp();
			this.placeBlock();
		}
	};
	Board.prototype.placeBlock = function() {
		this.blocks.push(this.moving_block);

		this.setupNewBlock();
	};
	Board.prototype.shiftBlockRight = function() {
		this.moving_block.moveRight();

		if (this.moving_block.rightOf(columns - 1) || this.moving_block.collidingWithList(blocks)) {
			this.moving_block.moveLeft();
		}
	};
	Board.prototype.shiftBlockLeft = function() {
		this.moving_block.moveLeft();

		if (this.moving_block.leftOf(0) || this.moving_block.collidingWithList(blocks)) {
			this.moving_block.moveRight();
		}
	};
	Board.prototype.rotateBlockCW = function() {
		this.moving_block.rotateCW();

		if (this.moving_block.leftOf(0) || this.moving_block.rightOf(columns - 1) || this.moving_block.beneath(0) || this.moving_block.collidingWithList(blocks)) {
			this.moving_block.rotateCCW();
		}
	};
	Board.prototype.rotateBlockCCW = function() {
		this.moving_block.rotateCCW();

		if (this.moving_block.leftOf(0) || this.moving_block.rightOf(columns - 1) || this.moving_block.beneath(0) || this.moving_block.collidingWithList(blocks)) {
			this.moving_block.rotateCW();
		}
	};
	Board.prototype.setupNewBlock = function() {
		this.moving_block = block_manager.randomBlock();
		this.moving_block.x = 4;
		this.moving_block.y = 0;
	};
	Board.prototype.getBlocks = function() {
		return this.blocks;
	};
	Board.prototype.getMovingBlock = function() {
		return this.moving_block;
	};

	return Board;
});