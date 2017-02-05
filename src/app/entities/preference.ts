import { Restaurant } from './restaurant';

export class Preference {
	id: string;
	userName: string;
	restaurantId: string;
	createdOn: string;

	constructor(preferenceDTO:any) {
		this.scaffolding();

		if (preferenceDTO == null) {
			return this;
		}

		if (preferenceDTO.id) {
			this.id = preferenceDTO.id;
		}
		if (preferenceDTO.userName) {
			this.userName = preferenceDTO.userName;
		}
		if (preferenceDTO.restaurantId) {
			this.restaurantId = preferenceDTO.restaurantId;
		}
		if (preferenceDTO.createdOn) {
			this.createdOn = preferenceDTO.createdOn;
		}

		return this;
	}

	private scaffolding () {
		this.id = null;
		this.userName = null;
		this.restaurantId = null;
		this.createdOn = null;
	}
}