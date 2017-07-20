import { App } from './app';
import rlite from 'rlite-router';

// create template
document.addEventListener("DOMContentLoaded", function() {
	// boostrap
	const route = rlite(notFound, {
		'': () => {
			setTimeout(() => {
				new App()
			}, 0);
		},

		'details/:id': function ({id}) {
			return id;
		}
	});

	function notFound() {
		return '<h1>404 Not found :/</h1>';
	}

// Hash-based routing
	function processHash() {
		const hash = location.hash || '#';

		// Do something useful with the result of the route
		document.body.textContent = route(hash.slice(1));
	}

	window.addEventListener('hashchange', processHash);
	processHash();
});

