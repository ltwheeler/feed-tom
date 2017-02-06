import { Injectable, Inject } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { Action } from '../entities/action';
import { Restaurant } from '../entities/restaurant';
import { Preference } from '../entities/preference';
import { CurrentUser } from '../helpers/currentUser';


@Injectable()
export class StateService {

	// Scaffolding out values to avoid nulls
	// TODO: Rearchitect to a typed state so this is not necessary
	private state:any = {preferences: [], restaurants: [], userName: "", tomCode: ""};

	// Setting up 'state' observable
	private stateSource = new Subject<any>();
	public state$ = this.stateSource.asObservable();

	constructor(private currentUser: CurrentUser) {}

	preferenceReducers(action:any, preferences:Preference[]) {
		switch(action.type) {
			case "PROCESS_DATA":

				preferences = action.payload.preferences;
				return preferences;
			default:
				return preferences;
		}
	};

	restaurantReducers(action:any, restaurants:Restaurant[]) {
		switch(action.type) {
			case "PROCESS_DATA":
				restaurants = action.payload.restaurants;
				return restaurants;
			default:
				return restaurants;
		}
	};

	stateReducers(action:any, state) {
		switch(action.type) {
			case "PROCESS_DATA":
				let rawPreferences = action.payload.preferences;
				let rawRestaurants = action.payload.restaurants;
				let currentUser = action.currentUser;

				state.restaurants = [];

				state.userCount = 0;
				let uniqueUserNames = [];

				// Restaurants list
				// restaurant.id
				// restaurant.name
				// restaurant.isUserPreference
				// restaurant.userPreferenceId
				// restaurant.isOthersPreference
				// restaurant.numberOfPreferences
				for (let rawRestaurant of rawRestaurants) {
					let newRestaurant:any = {};

					newRestaurant.id = rawRestaurant.id;
					newRestaurant.name = rawRestaurant.name;
					newRestaurant.isUserPreference = false;
					newRestaurant.userPreferenceId = null;
					newRestaurant.isOthersPreference = false;
					newRestaurant.numberOfPreferences = 0;

					// Was this restaurant preferred by current user, others, or both?
					for (let preferenceId of rawRestaurant.preferenceIds) {
						let preference:any = null;

						// Find preference that matches the restaurant.preferenceIds
						for (let rawPreference of rawPreferences) {
							if (rawPreference.id == preferenceId) {
								preference = rawPreference;
							}
						}

						// Add preference to uniquePreference Counter
						if (uniqueUserNames.indexOf(preference.userName) == -1) {
							uniqueUserNames.push(preference.userName);
							state.userCount++;
						}

						// Who belongs to this preference?
						if (preference.userName == currentUser) {
							newRestaurant.isUserPreference = true;
							newRestaurant.userPreferenceId = preference.id;
						} else {
							newRestaurant.isOthersPreference = true;
						}

						newRestaurant.numberOfPreferences++;
					}

					// Add restaurant to state
					state.restaurants.push(newRestaurant);
				}

					// Alphabetize by restaurant name
					state.restaurants = state.restaurants.sort( function(r1,r2) {
						if (r1.name >= r2.name) {
							return 1;
						} else {
							return -1;
						}
					});

					// TODO: And popular restaurant calculations seemed to be affecting
				// Popular restaurants
				state.popularRestaurants = Object.assign([], state.restaurants);
				state.popularRestaurants = this.selectMostPopularRestaurants(state.popularRestaurants, 5);

				return state;
			default:
				return state;
		}
	};

	reduce(action:any) {
		// Scaffolding out values to avoid nulls
		// TODO: Rearchitect to a typed state so this is not necessary
		let newState:any = {};

		newState.state = this.stateReducers(action, this.state);

		newState.preferences = this.preferenceReducers(action, this.state.preferences);
		newState.restaurants = this.restaurantReducers(action, this.state.restaurants);
		this.state = {};
		this.state.state = newState.state;

		this.state.preferences = newState.preferences;
		this.state.restaurants = newState.restaurants;
		this.state.userName = this.currentUser.getUserName();
		this.state.tomCode = this.currentUser.getTomCode();

		// Send the user to the landing page if username and tomCode aren't set
		if (this.state.userName
			&& this.state.userName.length > 0
			&& this.state.tomCode
			&& this.state.tomCode.length > 0) {

			this.state.displayPage = "main";
		} else {
			this.state.displayPage = "landing";
		}

		this.broadcast();
	}

	broadcast() {
		console.log("state updated");
		console.log(this.state);
		this.stateSource.next(Object.assign([], this.state));
	}
	
	purgeData() {
		this.stateSource.next(null);
	}

	selectMostPopularRestaurants(restaurants, numberToSelect) {
		var sorted = restaurants.sort((r1,r2) => r2.numberOfPreferences - r1.numberOfPreferences);
		var sliced = sorted.slice(0, numberToSelect);
		var mostPopular = [];

		// Prune restaurants with zero preferences
		for (let restaurant of sliced) {
			if (restaurant.numberOfPreferences > 0) {
				mostPopular.push(restaurant);
			}
		}


		return mostPopular;
	}
}