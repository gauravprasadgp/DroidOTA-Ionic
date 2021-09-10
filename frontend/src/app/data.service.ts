import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { url, url_server } from './url';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  authenticated: Boolean = false;
  token:any;
  show:Boolean=true;
  loading1:Boolean=false;
  success:boolean;
  constructor(public http: HttpClient, public afAuth: AngularFireAuth, public router: Router) { }
  GoogleAuth() {
this.loading1 = true;
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }
  AuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        var r = result.credential.toJSON();

        console.log('You have been successfully logged in!')
        
        // console.log(result.credential);
        // console.log("this is stringify",r['oauthAccessToken'])
        let body = {
          displayName: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          phoneno: result.user.phoneNumber,
          accesstoken: r['oauthAccessToken'],
          idtoken: r['oauthIdToken']
        }
        this.http.post(url_server+'/login', body).subscribe(response => {
          console.log('response is :', response);
          // this.token = response;
          if (response['status'] == 200) {
            
            this.authenticated = true;
            this.token=response['token'];
            localStorage.setItem('token',response['token']);
            this.loading1 = false;
        this.show = false;
        this.success = true;
          }
          else {
            alert("Login Failed")
            this.loading1=false;
            this.success = false;
          }
        })
      }).catch((error) => {
        console.log(error)
      })
  }

  buildMyApp(mydata) {
    let body = {
      data: mydata,
      token:this.token
    }
    return this.http.post(url_server+"/buildMyApp", body);
  }
  downloadMyApp(path) {
    return this.http.get(url_server+"/download/" + path, { responseType: 'blob' });
  }
  SignOut(){
    this.afAuth.signOut();
    this.authenticated=false;
    this.loading1 = false; 
    this.router.navigateByUrl('/');
  }
  // authFunction(t):any{
  //   let body = {
  //     token: t
  //   }
  //   this.http.post("http://localhost:3000/tokenVerifier", body).subscribe((res)=>{
  //     console.log(res)
  //   if(res['status']==200)
  //   {
  //     this.authenticated=true;
  //     return true;
  //   }
  //   else{
  //     this.authenticated=false;
  //     return false;
  //   }
  //   })
  // }
}
