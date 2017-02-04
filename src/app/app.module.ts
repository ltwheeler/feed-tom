import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './components/app.component';
import { LandingComponent } from './components/landing/landing.component';
import { MainComponent } from './components/main/main.component';

import { ActionCreators } from './services/actionCreators';
import { Services } from './services/services';
import { StateService } from './services/stateService';
import { LocalStorage } from './helpers/localStorage';
import { CurrentUser } from './helpers/currentUser';

// Imports: Specify other modules here to make their exported declarations available in this module
// Declarations: Specify directives/components/pipes in this module, that you want to make available. Everything inside declarations knows each other!
// Providers: Make Services/Values available for Dependency Injection. Components/Directives 
@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		LandingComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule
	],
	providers: [
		ActionCreators,
		Services,
		StateService,
		LocalStorage,
		CurrentUser
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
