import { Preference } from '../../entities/preference';
import { Restaurant } from '../../entities/restaurant';
import { ActionCreators } from '../../services/actionCreators';
import { StateService } from '../../services/stateService';

import { Component, Output, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
	providers: []
})
export class MainComponent {
	@Input()
	preferences: Preference[];
	@Input()
	restaurants: Restaurant[];
	@Input()
	popularRestaurants: Restaurant[];
	@Input()
	userName: string;
	@Input()
	tomCode: string;
	@Input()
	userCount: number;

	newRestaurantName: string;

	constructor(
		private actionCreators: ActionCreators,
		private stateService: StateService) 
		{
		
		}

	ngOnInit() {
	};

	togglePreference(restaurant:Restaurant) {
		this.actionCreators.togglePreference(restaurant.id, this.userName, this.restaurants, this.preferences, this.tomCode);
	};

	purgePreferences() {
		this.actionCreators.purgePreferences(this.restaurants, this.preferences, this.tomCode);
	};

	getPreferenceUserName(preferenceId:string) {
		for (let preference of this.preferences) {
			if (preference.id == preferenceId) {
				return preference.userName;
			}
		}
		return "preferenceId: " + preferenceId + " not found";
	};

	addRestaurant() {
		this.actionCreators.addRestaurant(this.tomCode, this.newRestaurantName);
		this.newRestaurantName = "";
	}
}
