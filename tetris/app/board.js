define(['app/blocks'], function(block_manager) {

	var Board = function() {
		this.reset();
	}

	Board.prototype.reset = function() {
		this.blocks = [];
		this.rows = 20;
		this.columns = 10;
		this.ended = false;
		this.cells = new Array(this.rows + 2);
		for (var i = 0; i < this.cells.length; i++) {
			this.cells[i] = null;
		}
		this.rows_cleared = 0;
		this.last_tick = Date.now();
		this.head_row = this.cells.length;

		this.setupNewBlock();
	}

	Board.prototype.tick = function(period) {
		var next_tick = -1;

		this.moving_block.moveDown();

		if (this.moving_block.beneath(this.rows-1) || this.blockTouchingCells(this.moving_block)) {
			this.moving_block.moveUp();

			var place_time = this.last_move + period;

			if (Date.now() >= place_time) {
				this.handlePlace();
			} else {
				next_tick = place_time - Date.now();
			}
		}

		this.last_tick = Date.now();

		return next_tick;
	};
	Board.prototype.handlePlace = function() {
		this.placeBlock();
		if (!this.cells[1]) {
			this.checkRows();
			this.setupNewBlock();
		} else {
			this.ended = true;
		}
	};
	Board.prototype.placeBlock = function() {
		var cells = this.moving_block.getCells();
		for (var i = 0; i < cells.length; i++) {
			var cell_x = this.moving_block.x + cells[i].x;
			var cell_y = this.moving_block.y + cells[i].y;

			this.setCell(cell_x, cell_y, this.moving_block.getColor());
		}

		this.last_move = Date.now();
	};
	Board.prototype.dropBlock = function() {
		this.moving_block.x = this.s_block.x;
		this.moving_block.y = this.s_block.y;

		this.handlePlace();
	};
	Board.prototype.shiftBlockRight = function() {
		this.moving_block.moveRight();

		if (this.moving_block.rightOf(this.columns - 1) || this.blockTouchingCells(this.moving_block)) {
			this.moving_block.moveLeft();
		} else {
			this.updateShadowBlock();
		}

		this.last_move = Date.now();
	};
	Board.prototype.shiftBlockLeft = function() {
		this.moving_block.moveLeft();

		if (this.moving_block.leftOf(0) || this.blockTouchingCells(this.moving_block)) {
			this.moving_block.moveRight();
		} else {
			this.updateShadowBlock();
		}

		this.last_move = Date.now();
	};
	Board.prototype.rotateBlockCW = function() {
		var kicks = this.moving_block.rotateCW();

		var placed = false;

		for (var i = 0; !placed && i < kicks.length; i++) {
			this.moving_block.shift(kicks[i]);

			if (!this.moving_block.leftOf(0) && 
				!this.moving_block.rightOf(this.columns - 1) && 
				!this.moving_block.beneath(this.rows-1) && 
				!this.blockTouchingCells(this.moving_block)) {

				placed = true;
			} else {
				this.moving_block.shift({x: -kicks[i].x, y: -kicks[i].y});
			}
		}

		if (!placed) {
			this.moving_block.rotateCCW();
		} else {
			this.updateShadowBlock();
		}

		this.last_move = Date.now();
	};
	Board.prototype.rotateBlockCCW = function() {
		var kicks = this.moving_block.rotateCCW();

		var placed = false;

		for (var i = 0; !placed && i < kicks.length; i++) {
			this.moving_block.shift(kicks[i]);

			if (!this.moving_block.leftOf(0) && 
				!this.moving_block.rightOf(this.columns - 1) && 
				!this.moving_block.beneath(this.rows-1) && 
				!this.blockTouchingCells(this.moving_block)) {

				placed = true;
			} else {
				this.moving_block.shift({x: -kicks[i].x, y: -kicks[i].y});
			}
		}

		if (!placed) {
			this.moving_block.rotateCW();
		} else {
			this.updateShadowBlock();
		}

		this.last_move = Date.now();
	};
	Board.prototype.setupNewBlock = function() {
		this.moving_block = block_manager.randomBlock();
		this.moving_block.x = 3;
		this.moving_block.y = -2;

		this.s_block = new block_manager.Block(this.moving_block);
		this.updateShadowBlock();
	};
	Board.prototype.getBlocks = function() {
		return this.blocks;
	};
	Board.prototype.getMovingBlock = function() {
		return this.moving_block;
	};
	Board.prototype.getShadowBlock = function() {
		return this.s_block;
	}

	Board.prototype.setCell = function(x, y, color) {
		var rx = x, ry = y + 2;

		if (!this.cells[ry]) {
			if (ry < this.head_row) {
				this.head_row = ry;
			}
			this.createRowArray(ry);
		}

		this.cells[ry][rx] = color;
	};
	Board.prototype.getCell = function(x, y) {
		var rx = x, ry = y + 2;

		if (!this.cells[ry]) {
			return null;
		} else {
			return this.cells[ry][rx];
		}
	};

	Board.prototype.createRowArray = function(real_row) {
		this.cells[real_row] = new Array(this.columns);

		for (var i = 0; i < this.columns; i++) {
			this.cells[real_row][i] = null;
		}
	};

	Board.prototype.blockTouchingCells = function(block) {
		var cells = block.getCells();
		for (var i = 0; i < cells.length; i++) {
			if (this.getCell(block.x + cells[i].x, block.y + cells[i].y)) {
				return true;
			}
		}

		return false;
	};

	Board.prototype.checkRows = function() {
		var r = this.cells.length - 1;

		while (r >= 0 && this.cells[r]) {
			var row_full = this.rowIsFull(r);

			if (row_full) {
				var r2 = r - 1;
				while (r2 >= 0 && this.cells[r2] != null) {
					this.cells[r2 + 1] = this.cells[r2];
					r2--;
				}
				this.cells[r2 + 1] = null;
				this.head_row++;
				this.rows_cleared++;
			}

			if (!row_full) {
				r--;
			}
		}
	};

	Board.prototype.rowIsFull = function(r) {
		var row_full = true;
		for (var c = 0; c < this.columns && row_full; c++) {
			if (!this.cells[r][c]) {
				row_full = false;
			}
		}

		return row_full;
	};

	Board.prototype.updateShadowBlock = function() {
		this.s_block.rotation = this.moving_block.rotation;
		this.s_block.x = this.moving_block.x;
		this.s_block.y = this.moving_block.y;

		var y_size = this.s_block.getCells().length;

		var start_y = this.head_row - y_size;

		if (start_y > this.s_block.y) {
			this.s_block.y = start_y;
		}

		while (!this.s_block.beneath(this.rows-1) && !this.blockTouchingCells(this.s_block)) {
			this.s_block.y++;
		}

		this.s_block.y--;
	};

	return Board;
});