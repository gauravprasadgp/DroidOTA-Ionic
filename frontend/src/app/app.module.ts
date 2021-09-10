import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {EditorModule} from 'primeng/editor';
import {InputTextareaModule} from 'primeng/inputtextarea';

// import { SplitButtonModule} from 'primeng/splitbutton';
import {TabViewModule} from 'primeng/tabview';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './login/login.component';
import { DataService } from './data.service';

import {ProgressBarModule} from 'primeng/progressbar';
import {StepsModule} from 'primeng/steps';
// import { MenuModule } from 'primeng/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {SplitterModule} from 'primeng/splitter';

// import { ChipModule } from 'primeng/chip';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    EditorModule,
    InputTextareaModule,
   
    // SplitButtonModule,
    TabViewModule,
   AngularFireModule.initializeApp(environment.firebaseConfig),
   MDBBootstrapModule.forRoot(),
   ProgressBarModule,
   StepsModule,
  //  MenuModule,
   NoopAnimationsModule,
   SplitterModule,
   //ChipModule,
   
  
  ],
  providers: [DataService],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
