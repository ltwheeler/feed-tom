import { Injectable, Inject } from '@angular/core';
import { LocalStorage } from '../helpers/localStorage';

@Injectable()
export class CurrentUser {

	constructor(
		private localStorage: LocalStorage
	) {}

	getUserName() {
		return this.localStorage.read("userName");
	}

	getTomCode() {
		return this.localStorage.read("tomCode");
	}
}