import {App} from './app';
import rlite from 'rlite-router';

let app = new App();

window.onload = function () {
	const route = rlite(notFound, { // without save route state
		'': () => {
			app.init();
			return 'loading...';
		},

		'details/:id': function ({id}) {
			app.getDeatils(id)
				.subscribe(() => {
					},
					err => notFound());
			return 'loading...';
		}
	});

	function notFound() {
		return '<h1>404 Not found :/</h1>';
	}

	// Hash-based routing
	function processHash() {
		const hash = location.hash || '#';
		// Do something useful with the result of the route
		// document.body.innerHTML = route(hash.slice(1));
		route(hash.slice(1));
	}

	window.addEventListener('hashchange', processHash);
	processHash();

}


