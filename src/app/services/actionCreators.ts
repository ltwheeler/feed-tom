import { Injectable, Inject } from '@angular/core';

import { Services } from '../services/services';
import { StateService } from '../services/stateService';

import { Preference } from '../entities/preference';
import { Restaurant } from '../entities/restaurant';
import { LocalStorage } from '../helpers/localStorage';
import { CurrentUser } from '../helpers/currentUser';

//import { StateService } from '../services/stateService';

@Injectable()
export class ActionCreators {

	constructor(private services: Services,
							private stateService: StateService,
							private localStorage: LocalStorage,
							private currentUser: CurrentUser) {}

	setIdentity(userName:string, tomCode:string) {
		this.localStorage.write("userName", userName);
		this.localStorage.write("tomCode", tomCode);

		let action = {
			type: "SET_IDENTITY",
			payload: {}
		};

		this.stateService.reduce(action);
		this.connectToFirebase(userName, tomCode);
	};

	initializeFirebase() {
		this.services.initializeFirebase();
	};

	// Can specify credentials, or omit them
	connectToFirebase(userName:string, tomCode:string) {
		// [1] Was the supplied tomCode valid?
		if (tomCode == null || tomCode.length == 0) {
			var localTomCode = this.currentUser.getTomCode();

			// [2] is the tomCode in storage valid?
			if (localTomCode == null || localTomCode.length == 0) {
				// [3] couldn't resolve a valid tomCode, give up, trigger a state refresh
				let action = {
					type: "",
					payload: {}
				};

				this.stateService.reduce(action);

				// Exiting since valid tomCode was not found
				return;
			} else {
				// [3] Use the localStorage tomCode
				tomCode = localTomCode;
			}
		} else {
			// [2] Storage the supplied tomCode
			this.localStorage.write("tomCode", tomCode);
		}

		// Resolve a proper userName value
		if (userName == null || userName.length == 0) {
			var localUserName = this.currentUser.getUserName();
			if (localUserName == null || localUserName.length == 0) {
				// Both username sources had nothing, default to "anonymous"
				userName = "anonymous";
				this.localStorage.write("userName", userName);
			} else {
				userName = localUserName;
			}
		}

		this.getPreferences(tomCode, userName);
	}

	getPreferences(tomCode:string, currentUser:string) {
		if (tomCode == null || tomCode.length == 0) {
			return;
		}

		this.services.getPreferences(tomCode, currentUser);
	};

	// Figures out whether we or adding or removing a preference
	togglePreference(restaurantId:string, userName:string, restaurants:Restaurant[], preferences:Preference[], tomCode:string) {

		for (let preference of preferences) {
			if (preference.restaurantId == restaurantId && preference.userName == userName) {
				this.services.deletePreference(preference.id, restaurantId, tomCode)
				return;
			}
		}

		this.services.addPreference(restaurantId, userName, tomCode);
	};

	purgePreferences(restaurants:Restaurant[], preferences:Preference[], tomCode:string) {
		for (let preference of preferences) {
			this.services.deletePreference(preference.id, preference.restaurantId, tomCode);
		}

		for (let restaurant of restaurants) {
			if (restaurant.preferenceIds) {
				for (let preferenceId of restaurant.preferenceIds) {
					this.services.deletePreference(preferenceId, restaurant.id, tomCode);
				}
			}
		}
	};

	addRestaurant(tomCode:string, name:string) {
		this.services.addRestaurant(tomCode, name);
	}
}