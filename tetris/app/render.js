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

		var width_scale = (this.canvas.width - 11 * this.line_width) / 10;
		var height_scale = (this.canvas.height - 21 * this.line_width) / 20;

		if (width_scale < height_scale) {
			this.scale = Math.floor(width_scale);
		} else {
			this.scale = Math.floor(height_scale);
		}

		this.board_width = this.scale * 10 + 11 * this.line_width;
		this.board_height = this.scale * 20 + 21 * this.line_width;

		this.x_offset = (this.width - this.board_width) / 2;
		this.y_offset = (this.height - this.board_height) / 2; 
	};

	Renderer.prototype.drawCell = function(x, y, color) {
		if (y >= 0) {
			this.context.beginPath();
			this.context.fillStyle = color;
			this.context.fillRect(this.x_offset + this.line_width*(x+1) + this.scale*x, this.y_offset + this.line_width*(y+1) + this.scale*y, this.scale, this.scale);
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
			this.context.fillRect(this.x_offset + x*this.line_width + x*this.scale, this.y_offset, this.line_width, this.board_height);
		}

		for (var y = 0; y < 21; y++) {
			this.context.fillRect(this.x_offset, this.y_offset + y*this.line_width + y*this.scale, this.board_width, this.line_width);
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
		this.drawBlock(board.getShadowBlock());
		this.drawLines();
	};

	Renderer.prototype.drawBlock = function(b) {
		var cells = b.getCells();
		for (var i = 0; i < cells.length; i++) {
			var c = cells[i];
			this.drawCell(b.getX() + c.x, b.getY() + c.y, b.getColor());
		}
	}

	return Renderer;
});