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
	userName:string;
	@Input()
	tomCode:string;

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

	getRestaurantDescription(restaurantId:string) {
		for (let restaurant of this.restaurants) {
			if (restaurant.id == restaurantId) {
				return restaurant.name;
			}
		}
		return "restaurantId: " + restaurantId + " not found";
	};

	getPreferenceUserName(preferenceId:string) {
		for (let preference of this.preferences) {
			if (preference.id == preferenceId) {
				return preference.userName;
			}
		}
		return "preferenceId: " + preferenceId + " not found";
	};
}
