define(function() {
	var GUI = function(element) {
		this.element = document.getElementById(element);		
	};

	GUI.prototype.pause = function(callback) {
		var div = document.createElement('div');
		div.className = 'gui-background';

		var button = document.createElement('input');
		button.type = 'button';
		button.value = 'Resume';
		button.className = 'tetris-button';
		button.id = 'pause-button';

		button.onclick = function() {
			div.parentNode.removeChild(div);
			callback();
		}

		div.appendChild(button);
		this.element.parentNode.appendChild(div);

		this.pause_div = div;
	};

	GUI.prototype.unpause = function() {
		this.pause_div.parentNode.removeChild(this.pause_div);
	}

	return GUI;
});