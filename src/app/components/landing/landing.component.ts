import { Component, OnInit, Input } from '@angular/core';
import { ActionCreators } from '../../services/actionCreators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
	@Input()
	tomCode:string;
	@Input()
	userName:string;

	constructor(
		private actionCreators: ActionCreators
	) { }

	ngOnInit() {
	
	}

	setIdentity() {
		alert("Thanks for the click");
		this.actionCreators.setIdentity(this.userName, this.tomCode);
	}
}
