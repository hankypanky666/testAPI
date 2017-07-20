import {Observable} from 'rxjs';

export class HttpClient {
	constructor() {
	}

	getReq(url) {
		return Observable.create(observer => {
			const xhr = new XMLHttpRequest();

			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						observer.next(JSON.parse(xhr.response));
						observer.complete();
					} else {
						observer.error(xhr.response);
					}
				}
			};

			xhr.open('GET', url, true);
			xhr.send();
		});
	}

}