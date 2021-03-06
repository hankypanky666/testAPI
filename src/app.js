import {API, URL, URL_DETAILS} from './config/app.config';
import {HttpClient} from './libs/HttpClient';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

const template = `<div id="wrapper">
    <input type="text" id="filterTable" placeholder="name">
    <div id="list">
        <table id="table">
            <thead>
            <tr>
                <th>name</th>
                <th>link</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>
    <div id="actions">
        <button id="prev"><</button>
        <span id="currentPage"></span> / <span id="totalPages"></span>
        <button id="next">></button>
        jump to <input type="number" id="jumpTo" min="0">
    </div>
</div>`;

export class App {
	constructor() {
		this.http = new HttpClient();
		this.currPage$ = new BehaviorSubject(0);
		// this.init();
	}

	init() {
		document.body.innerHTML = template; // lifehack xd

		this.currPage = document.querySelector('#currentPage');
		this.prev = document.querySelector('#prev');
		this.next = document.querySelector('#next');
		this.jumpTo = document.querySelector('#jumpTo');
		this.filter = document.querySelector('#filterTable');
		this.items = [];

		this.prev$ = Observable.create(observer => {
			const handle = (e) => observer.next(e);
			this.next.addEventListener('click', handle);
		})

		this.next$ = Observable.create(observer => {
			const handle = (e) => observer.next(e);
			this.prev.addEventListener('click', handle);
		})

		this.jumpTo$ = Observable.create(observer => {
			const handle = (e) => observer.next(e);
			this.jumpTo.addEventListener('change', handle);
		})

		this.jumpTo$
			.subscribe(res => {
				this.getAsteroids(`${URL}page=${res.target.value}&size=20&${API}`);
			})

		this.filter$ = Observable.create(observer => {
			const handle = (e) => observer.next(e);
			this.filter.addEventListener('keyup', handle);
		})

		this.filter$
			.subscribe(res => {
				this._generateList(this.items.filter(i => i.name.indexOf(res.target.value) !== -1));
			})

		this.merger$ = Observable.merge(this.next$, this.prev$);
		this.merger$
			.subscribe(res => {
				this.getAsteroids(res.target.value);
			})

		this.currPage$.subscribe(res => {
			this.currPage.textContent = res;
			if (res !== 0) {
				this.prev.disabled = false; // ??
			} else {
				this.prev.disabled = true;
			}
		})

		this.getAsteroids();

	}

	getAsteroids(url = '') {
		this.http.getReq(url ? url : URL + API)
			.take(1)
			.subscribe(res => {
				console.log('result: ', res);
				this.items = res.near_earth_objects;
				this._generateList(res.near_earth_objects);
				this._createActions(res.links.prev, res.links.self, res.links.next, res.page.number, res.page.total_pages);
			})
	}

	_createActions(prevLink = '', selfLink = '', nextLink = '', page, total) {
		const totalPages = document.querySelector('#totalPages');
		totalPages.textContent = total;
		this.jumpTo.max = total;
		this.currPage$.next(page);
		this.prev.value = prevLink;
		this.next.value = nextLink;
	}

	_generateList(list) {
		const div = document.getElementById('table').querySelector('tbody');
		div.innerHTML = '';

		list.forEach(i => {
			const tr = div.appendChild(document.createElement('tr'));

			const tdName = tr.appendChild(document.createElement('td'));
			tdName.innerHTML = i.name;

			const tdLink = tr.appendChild(document.createElement('td'));
			const tdLinkHref = tdLink.appendChild(document.createElement('a'));
			tdLinkHref.href = `#details/${i.neo_reference_id}`;
			tdLinkHref.textContent = 'more...';
			// tdLink.innerHTML = i.links.self;
		});
	}

	getDeatils(id) {
		return this.http.getReq(`${URL_DETAILS}${id}?${API}`)
			.map(res => {
				document.body.innerHTML = res.name;
			})
	}

}