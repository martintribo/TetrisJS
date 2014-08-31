define(['app/render', 'app/board', 'app/blocks', 'app/gui'], function(Renderer, Board, BlockManager, GUI) {
	//BlockManager.registerBlockType('dot', [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}]);
	//BlockManager.registerBlockType('swag', [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}]);
	function c(x, y) {
		return {x: x, y: y};
	}

	//BlockManager.registerBlockType('test', [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}]);
	var standardRotationChecks = [
		[c(0, 0), c(-1, 0), c(-1,1), c( 0,-2), c(-1,-2)],
		[c(0, 0), c(1, 0), c(1,-1), c( 0,2), c(1,2)],
		[c(0, 0), c(1, 0), c(1,1), c( 0,-2), c(1,-2)],
		[c(0, 0), c(-1, 0), c(-1,-1), c( 0,2), c(-1,2)]
	];

	var iRotationChecks = [
		[c(0, 0), c(-2, 0), c(1,0), c( -2,-1), c(1,2)],
		[c(0, 0), c(-1, 0), c(2,0), c( -1,-2), c(2,-1)],
		[c(0, 0), c(2, 0), c(-1,0), c( 2,1), c(-1,-2)],
		[c(0, 0), c(1, 0), c(-2,-1), c( 1,-2), c(-2,1)]
	];

	BlockManager.registerBlockType('I', [
		[c(0, 1), c(1, 1), c(2, 1), c(3, 1)],
		[c(2, 0), c(2, 1), c(2, 2), c(2, 3)],
		[c(0,2), c(1, 2), c(2, 2), c(3, 2)],
		[c(1, 0), c(1, 1), c(1, 2), c(1, 3)],
	], iRotationChecks, 'turquoise');
	BlockManager.registerBlockType('J', [
		[c(0, 0), c(0, 1), c(1, 1), c(2, 1)],
		[c(1, 0), c(2, 0), c(1, 1), c(1, 2)],
		[c(0, 1), c(1, 1), c(2, 1), c(2, 2)],
		[c(1, 0), c(1, 1), c(1, 2), c(0, 2)]
	], standardRotationChecks, 'magenta');
	BlockManager.registerBlockType('L', [
		[c(0, 1), c(1, 1), c(2, 1), c(2, 0)],
		[c(1, 0), c(1, 1), c(1, 2), c(2, 2)],
		[c(0, 2), c(0, 1), c(1, 1), c(2, 1)],
		[c(0, 0), c(1, 0), c(1, 1), c(1, 2)]
	], standardRotationChecks, 'lime');
	BlockManager.registerBlockType('O', [
		[c(1, 0), c(2, 0), c(1, 1), c(2, 1)],
		[c(1, 0), c(2, 0), c(1, 1), c(2, 1)],
		[c(1, 0), c(2, 0), c(1, 1), c(2, 1)],
		[c(1, 0), c(2, 0), c(1, 1), c(2, 1)]
	], standardRotationChecks, 'yellow');
	BlockManager.registerBlockType('S', [
		[c(0, 1), c(1, 1), c(1, 0), c(2, 0)],
		[c(1, 0), c(1, 1), c(2, 1), c(2, 2)],
		[c(0, 2), c(1, 2), c(1, 1), c(2, 1)],
		[c(0, 0), c(0, 1), c(1, 1), c(1, 2)]
	], standardRotationChecks, 'green');
	BlockManager.registerBlockType('T', [
		[c(0, 1), c(1, 1), c(1, 0), c(2, 1)],
		[c(1, 0), c(1, 1), c(2, 1), c(1, 2)],
		[c(0, 1), c(1, 1), c(1, 2), c(2, 1)],
		[c(1, 0), c(1, 1), c(0, 1), c(1, 2)]
	], standardRotationChecks, 'purple');
	BlockManager.registerBlockType('Z', [
		[c(0, 0), c(1, 0), c(1, 1), c(2, 1)],
		[c(2, 0), c(2, 1), c(1, 1), c(1, 2)],
		[c(0, 1), c(1, 1), c(1, 2), c(2, 2)],
		[c(1, 0), c(1, 1), c(0, 1), c(0, 2)]
	], standardRotationChecks, 'red'); 

	var Game = function(element) {
		this.board = new Board();
		this.render = new Renderer(element);
		this.gui = new GUI(element);
		this.period = 200;
		this.interval = null;
		this.state = 'start'; //start, paused, active, ended

		var self = this;

		this.canvas = document.getElementById(element);
		this.canvas.addEventListener('keydown', function(event) {
			if (event.keyCode === 37) { //left
				self.board.shiftBlockLeft();
				self.render.draw(self.board);
				self.move_sound.play();
			} else if (event.keyCode === 38) { //up
				self.board.rotateBlockCW();
				self.render.draw(self.board);
				self.rotate_sound.play();
			} else if (event.keyCode === 39) { //right
				self.board.shiftBlockRight();
				self.render.draw(self.board);
				self.move_sound.play();
			} else if (event.keyCode === 40) { //down
				if (!self.down) {
					self.down = true;
					self.period -= 100;
					self.resetInterval();
					self.tick(false);
				}
			} else if (event.keyCode == 80) { //p
				if (self.state == 'paused') {
					self.gui.unpause();
					self.start();
				} else {
					self.pause();
				}
			}
		});
		this.canvas.addEventListener('keyup', function(event) {
			if (event.keyCode === 40) {
				self.period += 100;
				self.down = false;
				self.resetInterval();
			}
		});

		this.render.draw(this.board);
		this.showStart();
	};

	Game.prototype.resetInterval = function() {
		if (this.interval) {
			window.clearTimeout(this.interval);
			this.interval = null;
		}

		var func = (function(self) {
			return function() {
				self.tick(true);
			};
		})(this);

		this.interval = window.setTimeout(func, this.period);
	};

	Game.prototype.start = function() {
		this.canvas.focus();
		this.resetInterval();
		this.state = 'active';
	};

	Game.prototype.tick = function(tick_again) {
		var next_tick = this.board.tick(this.period);

		if (!this.board.ended) {
			this.render.draw(this.board);
			var self = this;

			var func = (function(self) {
				return function() {
					self.tick(true);
				};
			})(this);

			if (tick_again) {
				if (next_tick >= 0) {
					this.interval = window.setTimeout(func, next_tick);
				} else {
					this.interval = window.setTimeout(func, this.period);
				}
			}
		}
	};

	Game.prototype.pause = function() {
		var self = this;
		window.clearTimeout(this.interval);
		this.gui.pause(function() {
			self.start();
		});
		this.state = 'paused'
	};

	Game.prototype.showStart = function() {
		var self = this;
		this.gui.showStart(function() {
			self.start();
		});
	}

	Game.prototype.reset = function() {
		this.board.reset();
		this.render.draw(this.board);
	};

	Game.prototype.move_sound = new Audio('tetris/sounds/move.wav');
	Game.prototype.rotate_sound = new Audio('tetris/sounds/rotate.wav');

	return Game;
});