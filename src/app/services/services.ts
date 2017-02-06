import { Injectable, Inject } from '@angular/core';

import {initializeApp,database} from 'firebase';

import { Preference } from '../entities/preference';
import { Restaurant } from '../entities/restaurant';

import { ActionCreators } from '../services/actionCreators';
import { StateService } from '../services/stateService';

@Injectable()
export class Services {

	firebaseRef:any;

	constructor(
		private stateService: StateService
							) {}

	initializeFirebase() {
		var firebaseConfig = {
			apiKey: "AIzaSyBxk_oFZ3moeV_ymxHiOUHdTy7Q3D2B8NA",
			authDomain: "feed-tom.firebaseapp.com",
			databaseURL: "https://feed-tom.firebaseio.com",
			storageBucket: "feed-tom.appspot.com",
			messagingSenderId: "175595419965"
		};

		initializeApp(firebaseConfig);
	};

	addPreference(restaurantId:string, userName:string, tomCode:string) {
		var newPreferenceRef = database().ref().child(tomCode).child("preferences").push();

		// Create preference
		var preferenceId = newPreferenceRef.key;

		let preference:Preference = new Preference ({id: preferenceId, restaurantId: restaurantId, userName: userName, createdOn: null});

		newPreferenceRef.set(preference);

		// Add reference to preference in restaurants list
		var ref = database().ref(tomCode + "/restaurants/" + restaurantId + "/preferenceIds/" + preferenceId);
		ref.set(preferenceId);
	};

	addRestaurant(tomCode:string, name:string) {
		var newRestaurantRef = database().ref().child(tomCode).child("restaurants").push();
		var restaurantId = newRestaurantRef.key;
		let restaurant:any = {id: restaurantId, name: name};

		newRestaurantRef.set(restaurant);
	}

	deletePreference(preferenceId:string, restaurantId:string, tomCode:string) {
		// Remove reference to preference in restaurant
		database().ref(tomCode + "/restaurants/" + restaurantId + "/preferenceIds/" + preferenceId).remove();

		// Remove preference
		database().ref(tomCode + "/preferences/" + preferenceId).remove();
	};

	getPreferences(tomCode:string, currentUser:string) {
		console.log("get preferences");

		var self = this;

		if (this.firebaseRef) {
			this.firebaseRef.off();
		}

		this.firebaseRef = database().ref().child(tomCode);

		this.firebaseRef.on("value", function(snapshot) {
			let payload:any = {};
			let preferences:Preference[] = [];
			let restaurants:Restaurant[] = [];

			if (snapshot.val()) {
				console.log("data found in firebase, processing it");
				// Convert from firebase associative array to array
				for(var key in snapshot.val().preferences) {
					var preference:Preference = snapshot.val().preferences[key];
					preferences.push(preference);
				}

				// Convert from firebase associative array to array
				for(var key in snapshot.val().restaurants) {
					var restaurant:Restaurant = snapshot.val().restaurants[key];

					// Convert restaurants preferenceIds associative array to array
					let preferenceIds:string[] = [];

					for(var key in restaurant.preferenceIds) {
						var preferenceId:string = restaurant.preferenceIds[key];
						preferenceIds.push(preferenceId)
					}

					restaurant.preferenceIds = preferenceIds;

					restaurants.push(restaurant);
				}	
			}

			payload.restaurants = restaurants;
			payload.preferences = preferences;

			self.processData(payload, currentUser);
		});
	};

	processData(payload:any, currentUser:string) {
		let action = {
			type: "PROCESS_DATA",
			payload: payload,
			currentUser: currentUser
		};

		this.stateService.reduce(action);
	};
}