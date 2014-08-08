define(['app/render', 'app/board', 'app/blocks'], function(Renderer, Board, BlockManager) {
	BlockManager.registerBlockType('dot', [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}]);
	BlockManager.registerBlockType('swag', [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}]);

	var Game = function(element) {
		this.board = new Board();
		this.render = new Renderer(element);
	};

	Game.prototype.start = function() {
		var func = (function(self) {
			return function() {
				self.board.tick();
				self.render.draw(self.board);
			};
		})(this);

		this.interval = window.setInterval(func, 20);
	};

	Game.prototype.pause = function() {
		window.clearInterval(this.interval);
	};

	Game.prototype.reset = function() {
		this.board.reset();
		this.render.draw(this.board);
	};

	return Game;
});