require.config({
	baseUrl: 'tetris/libs',
	paths: {
		app: '../app',
		kinetic: 'kinetic-v5.1.0.min'
	}
});

require(['app/main']);