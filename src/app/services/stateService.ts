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
			//	var restaurants = action.payload.restaurants;




				return state;
			default:
				return state;
		}
	};

	reduce(action:any) {
		// Scaffolding out values to avoid nulls
		// TODO: Rearchitect to a typed state so this is not necessary
		let newState:any = {};

		newState.preferences = this.preferenceReducers(action, this.state.preferences);
		newState.restaurants = this.restaurantReducers(action, this.state.restaurants);

		this.state = {};
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
}