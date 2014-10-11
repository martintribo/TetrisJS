define(function() {
	var Renderer = function(element) {
		this.canvas = window.document.getElementById(element);
		this.context = this.canvas.getContext('2d');
		//this.context.translate(0.5, 0.5);
		this.line_width = 5;
		this.last_board = null;
		this.resize();

		var self = this;
		window.addEventListener('resize', function() {
			self.resize();
			self.draw(self.last_board);
		});
	};

	Renderer.prototype.resize = function() {
		this.width = this.canvas.offsetWidth;
		this.height = this.canvas.offsetHeight;
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		//subtract line pixels from length of screen, 
		//divide that by the number of cells needing to be displayed in the remaining space
		var width_scale = (this.canvas.width - 21 * this.line_width) / 20;
		var height_scale = (this.canvas.height - 21 * this.line_width) / 20;

		if (width_scale < height_scale) {
			this.scale = Math.floor(width_scale);
		} else {
			this.scale = Math.floor(height_scale);
		}

		this.board_width = this.scale * 10 + 11 * this.line_width;
		this.board_height = this.scale * 20 + 21 * this.line_width;

		this.x_offset = (this.width - 2*this.board_width) / 2;
		this.y_offset = (this.height - this.board_height) / 2; 
	};

	Renderer.prototype.drawCell = function(x, y, color) {
		if (y >= 0) {
			var start_x = this.x_offset + this.line_width*(x+1) + this.scale*x;
			var start_y = this.y_offset + this.line_width*(y+1) + this.scale*y;

			this.context.beginPath();
			this.context.fillStyle = color;
			this.context.fillRect(start_x, start_y, this.scale, this.scale);
		}
	};

	Renderer.prototype.drawBackground = function() {
		this.context.beginPath();
		this.context.fillStyle = '#000000';
		this.context.fillRect(0, 0, this.width, this.height);

		this.context.beginPath();
		this.context.fillStyle = '#000000';//'#333333';
		this.context.fillRect(this.x_offset, this.y_offset, this.board_width, this.board_height);
	};

	Renderer.prototype.drawLines = function() {
		this.context.beginPath();
		this.context.fillStyle = '#AAAAAA';

		for (var x = 0; x < 11; x++) {
			var start_x = this.x_offset + x*this.line_width + x*this.scale;
			var start_y = this.y_offset;

			this.context.fillRect(start_x, start_y, this.line_width, this.board_height);
		}

		for (var y = 0; y < 21; y++) {
			var start_x = this.x_offset;
			var start_y = this.y_offset + y*this.line_width + y*this.scale;

			this.context.fillRect(start_x, start_y, this.board_width, this.line_width);
		}
	};

	Renderer.prototype.draw = function(board) {
		this.last_board = board;
		this.drawBackground();

		var cells = board.cells;
		var i = cells.length - 1;
		while (cells[i] && i >= 0) {
			for (var x = 0; x < cells.length; x++) {
				var color = cells[i][x];
				if (color) {
					this.drawCell(x, i - 2, color);
				}
			}

			i--;
		}

		this.drawBlock(board.getMovingBlock());
		this.drawShadowBlock(board.getShadowBlock());
		this.drawLines();
		this.drawNextBlock(board.getNextBlock());
	};

	Renderer.prototype.drawBlock = function(b) {
		var cells = b.getCells();
		for (var i = 0; i < cells.length; i++) {
			var c = cells[i];
			this.drawCell(b.getX() + c.x, b.getY() + c.y, b.getColor());
		}
	}

	Renderer.prototype.drawShadowBlock = function(b) {
		this.context.globalAlpha = 0.3;
		this.drawBlock(b);
		this.context.globalAlpha = 1;
	}

	Renderer.prototype.drawNextBlock = function(b) {
		var space_offset = 10;
		var block_pos_x = space_offset + b.getX();
		var block_pos_y = 4;
		var cells = b.getCells();
		var text_pos_x = block_pos_x - 1.8;
		var text_pos_y = block_pos_y - 1;
		var px = 1.45*this.scale;
		console.log(this.scale);

		var start_x = this.x_offset + this.line_width*(text_pos_x+1) + this.scale*text_pos_x;
		var start_y = this.y_offset + this.line_width*(text_pos_y+1) + this.scale*text_pos_y;

		this.context.fillStyle = '#FFFFFF';
		this.context.font = "" + px + "px Verdana";
		this.context.fillText("Next Block", start_x, start_y);

		for (var i = 0; i < cells.length; i++) {
			var c = cells[i];
			this.drawCell(block_pos_x + c.x, block_pos_y + c.y, b.getColor());
		}
	}

	return Renderer;
});
