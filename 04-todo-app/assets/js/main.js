
document.addEventListener('DOMContentLoaded', () => {
	import('./theme.js')
		.then(() => console.log('theme.js loaded'))
		.catch(err => console.error('Error loading theme.js', err));

	import('./todo-list/ui-controllers.js')
		.then(() => console.log('ui-controllers.js loaded'))
		.catch(err => console.error('Error loading ui-controllers.js', err));

	import('./todo-list/drag-and-drop.js')
		.then(() => console.log('drag-and-drop.js loaded'))
		.catch(err => console.error('Error loading drag-and-drop.js', err));
});
