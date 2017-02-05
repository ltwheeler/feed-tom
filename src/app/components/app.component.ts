import { Preference } from '../entities/preference';
import { Restaurant } from '../entities/restaurant';
import { ActionCreators } from '../services/actionCreators';
import { StateService } from '../services/stateService';
import { MainComponent } from './main/main.component';
import { CurrentUser } from '../helpers/currentUser';

import { Component, Output, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
	providers: []
})
export class AppComponent {
	preferences: Preference[] = new Array<Preference>();
	restaurants: Restaurant[] = new Array<Restaurant>();
	popularRestaurants: Restaurant[] = new Array<Restaurant>();

	displayPage:string = "main";
	state:any;

	userName = "";
	tomCode = "";

	constructor(
		private zone:NgZone,
		private actionCreators: ActionCreators,
		private stateService: StateService,
		private currentUser: CurrentUser) 
		{
		
		}

	ngOnInit() {
		// Set up subscription to data
		this.stateService.state$.subscribe(state => {
			this.zone.run(() => {
				this.state = state.state;
				this.restaurants = state.state.restaurants;
				this.popularRestaurants = state.state.popularRestaurants;
				this.preferences = state.preferences;
				this.userName = state.userName;
				this.tomCode = state.tomCode;
				this.displayPage = state.displayPage;
			});
		});

		// Query for Data
		this.actionCreators.initializeFirebase();
		this.actionCreators.connectToFirebase(null, null);
	};

	isIdentitySet() {
		if (this.userName.length == 0 || this.tomCode.length == 0) {
			return false;
		}

		return true;
	};

	setDisplayPage(page:string) {
		this.displayPage = page;
	};

	getPreferences(tomCode:string) {
		this.actionCreators.getPreferences(tomCode, this.userName);
	};
}
