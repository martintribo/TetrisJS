define(['kinetic'], function(Kinetic) {
	var Renderer = function(element) {
		this.scale = 40;

		this.stage = new Kinetic.Stage({
			width: this.scale*10,
			height: this.scale*20,
			container: element
		});
		this.layer = new Kinetic.Layer();
		this.stage.add(this.layer);
	};

	Renderer.prototype.draw = function(board) {
		this.stage.clear();
		var layer = this.layer;//new Kinetic.Layer();
		var scale = this.scale;
		var background = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: scale*10,
			height: scale*20,
			fill: 'black'
		});
		layer.add(background);
		var blocks = board.getBlocks();
		for (var i = 0; i < blocks.length; i++) {
			var b = blocks[i];
			this.drawBlock(b, layer);
		}

		this.drawBlock(board.getMovingBlock(), layer);

		layer.draw();
		//this.stage.add(layer);
	};

	Renderer.prototype.drawBlock = function(b, layer) {
		var cells = b.getCells();
		var scale = this.scale;
		for (var i = 0; i < cells.length; i++) {
			var c = cells[i];
			var rect = new Kinetic.Rect({
				x: scale*(b.getX() + c.x),
				y: scale*(b.getY() + c.y),
				width: scale,
				height: scale,
				fill: b.getColor()
			});
			layer.add(rect);
		}
	}

	return Renderer;
});