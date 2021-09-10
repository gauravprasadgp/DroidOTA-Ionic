import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
   reload_token:any;
  constructor(public dataService:DataService,public router:Router,public afAuth:AngularFireAuth){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
return this.afAuth.authState.pipe(
  take(1),
  map(user => !!user),
  tap(loggedIn => {
    if (!loggedIn) {
      console.log('Access Denied');
      this.dataService.authenticated=false;
      this.router.navigateByUrl('/');
    }
    else{
      this.dataService.authenticated=true;
    }
  }
  ))
    }
}
