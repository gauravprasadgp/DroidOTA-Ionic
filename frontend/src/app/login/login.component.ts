import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
 import * as postscribe from 'postscribe';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  pstep1:Boolean=true;
  pstep2:Boolean=false;
  pstep3:Boolean=false;
  pstep4:Boolean=false;
  otherItems: any[];
  actIndexClickableSpecificStep:any=0;
 
  public showOverlay = true;
  constructor(public  dataService: DataService,private router: Router) { 
    // router.events.subscribe((event: RouterEvent) => {
    //   this.navigationInterceptor(event)
    // })
    // this.banner = new Banner(
    //   'ca-pub-3394788886955114',
    //   123456,
    //   'auto',
    //   true
    // )
  }
  ngAfterViewInit() {
   console.log(window.screen.width)
   if(window.screen.width<600){
    postscribe('#adv', `<script type="text/javascript" language="javascript">
    var aax_size='300x250';
    var aax_pubname = 'droidota08-21';
    var aax_src='302';
  </script>
  <script type="text/javascript" language="javascript" src="https://c.amazon-adsystem.com/aax2/assoc.js"></script>`);
console.log("first ad")   
}
   else{
    postscribe('#adv', `<script type="text/javascript" language="javascript">
    var aax_size='728x90';
    var aax_pubname = 'droidota08-21';
    var aax_src='302';
  </script>
  <script type="text/javascript" language="javascript" src="https://c.amazon-adsystem.com/aax2/assoc.js"></script>`);}
  console.log("2 ad")}
   ngOnInit(): void {
    this.otherItems = [
      {
          label: 'Login',
          command: (event: any) => {this.show1()}
      },
      {
          label: 'Design',
          command: (event: any) => {this.show2()}
      },
      {
          label: 'Render',
          command: (event: any) => {this.show3()}
      },
      {
          label: 'Build',
          command: (event: any) => {this.show4()}
      }
  ];
//   postscribe('#adv', `<script type="text/javascript" language="javascript">
//   var aax_size='728x90';
//   var aax_pubname = 'droidota-21';
//   var aax_src='302';
// </script>
// <script type="text/javascript" language="javascript" src="https://c.amazon-adsystem.com/aax2/assoc.js"></script>`);
  }
  nextpage(){
    this.router.navigate(['home']);
  }
show1(){
  this.pstep1=true;
  this.pstep2=false;
  this.pstep3=false;
  this.pstep4=false;
  this.actIndexClickableSpecificStep=0;
}
show2(){
  this.pstep1=false;
  this.pstep2=true;
  this.pstep3=false;
  this.pstep4=false;
  this.actIndexClickableSpecificStep=1;
}
show3(){
  this.pstep1=false;
  this.pstep2=false;
  this.pstep3=true;
  this.pstep4=false;
  this.actIndexClickableSpecificStep=2;
}
show4(){
  this.pstep1=false;
  this.pstep2=false;
  this.pstep3=false;
  this.pstep4=true;
  this.actIndexClickableSpecificStep=3;
}
navigationInterceptor(event: RouterEvent): void {
  if (event instanceof NavigationStart) {
    this.showOverlay = true;
  }
  if (event instanceof NavigationEnd) {
    this.showOverlay = false;
  }

  // Set loading state to false in both of the below events to hide the spinner in case a request fails
  if (event instanceof NavigationCancel) {
    this.showOverlay = false;
  }
  if (event instanceof NavigationError) {
    this.showOverlay = false;
  }
}
}
