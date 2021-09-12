import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as postscribe from 'postscribe';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dataToPut: any;
  dataToPut_embed: string = '<xmp><iframe src="YOUR WEBSITE URL" height="100%" width="100%" title="YOUR WEBSITE TITLE"></iframe></xmp>'
  displayData: any;
  dataToPut_embed_n: any;
  loading: Boolean = false;
  authKey: String;
  show: Boolean = true;
  showLogs: any;
  fileUrl;
  DownloadPath;
  value: number = 0;
  QueueTime: any;
  showbutton: boolean = true;
  token: any;
  constructor(public dataService: DataService, private sanitizer: DomSanitizer) {
  }
  ngAfterViewInit() {
  }

  ngOnInit(): void {
    this.show = true;

  }
  putData_embed() {
    this.dataToPut_embed_n = this.dataToPut_embed.replace('&lt;', '<');
    this.dataToPut_embed_n = this.dataToPut_embed_n.replace('&gt;', '>');
    this.dataToPut_embed_n = this.dataToPut_embed_n.replace('<xmp>', '');
    this.dataToPut_embed_n = this.dataToPut_embed_n.replace('</xmp>', '');
    this.dataToPut_embed_n = this.dataToPut_embed_n.replace('<p>', '');
    this.dataToPut_embed_n = this.dataToPut_embed_n.replace('</p>', '');
    this.dataToPut_embed_n = this.dataToPut_embed_n.replace('&lt;', '<');
    this.dataToPut_embed_n = this.dataToPut_embed_n.replace('&gt;', '>');
    // this.dataToPut_embed_n=this.dataToPut_embed_n.replace('<;','<');
    this.displayData = this.sanitizer.bypassSecurityTrustHtml(this.dataToPut_embed_n);
    // console.log(this.displayData);
  }
  putData() {
    this.displayData = this.sanitizer.bypassSecurityTrustHtml(this.dataToPut);
    // console.log(this.displayData);
  }
  buildMyApp() {
    this.token = localStorage.getItem('token');
    console.log('token', this.token);
    if (this.token == null) {
      if (this.dataToPut == null || this.dataToPut == undefined) { alert('editor is empty please write something.'); }
      else {
        this.loading = true;
        this.dataService.buildMyApp(this.dataToPut).subscribe((res) => {
          console.log(res);
          if (res['status'] == 200) {

            this.loading = false;
            this.show = false;
            this.showLogs = res['message'];
            this.DownloadPath = res['url'];
            this.QueueTime = res['QueueTime']
            let interval = setInterval(() => {
              this.value = this.value + 2.5;
              if (this.value >= 100 * this.QueueTime) {
                this.value = 100;
                this.showbutton = false;
                clearInterval(interval);
              }
            }, 1000);

          }
          else {
            this.loading = false;
            alert(res['message'])
          }
        })
      }
    }
    else {
      if (this.dataToPut == null || this.dataToPut == undefined) { alert('editor is empty please write something.'); }
      else {
        this.loading = true;
        this.dataService.buildMyApp(this.dataToPut).subscribe((res) => {
          console.log(res);
          if (res['status'] == 200) {

            this.loading = false;
            this.show = false;
            this.showLogs = res['message'];
            this.DownloadPath = res['url'];
            this.QueueTime = res['QueueTime']
            let interval = setInterval(() => {
              this.value = this.value + 2.5;
              if (this.value >= 100 * this.QueueTime) {
                this.value = 100;
                this.showbutton = false;
                clearInterval(interval);
              }
            }, 1000);

          }
          else {
            if (res['status'] == 400) {


              if (this.dataToPut == null || this.dataToPut == undefined) { alert('editor is empty please write something.'); }
              else {
                this.loading = true;
                this.dataService.buildMyApp(this.dataToPut).subscribe((res) => {
                  console.log(res);
                  if (res['status'] == 200) {

                    this.loading = false;
                    this.show = false;
                    this.showLogs = res['message'];
                    this.DownloadPath = res['url'];
                    this.QueueTime = res['QueueTime']
                    let interval = setInterval(() => {
                      this.value = this.value + 2.5;
                      if (this.value >= 100 * this.QueueTime) {
                        this.value = 100;
                        this.showbutton = false;
                        clearInterval(interval);
                      }
                    }, 1000);

                  }
                  else {
                    this.loading = false;
                    alert(res['message'])
                  }
                })
              }
            }
          }
        })
      }
    }
  }
  buildMyApp_embed() {
    this.loading = true;
    console.log(this.dataToPut_embed_n);
    this.dataService.buildMyApp(this.dataToPut_embed_n).subscribe((res) => {
      console.log(res);
      if (res['status'] == 200) {
        this.loading = false;
        this.show = false;
        this.showLogs = res['message'];
        this.DownloadPath = res['url'];
        this.QueueTime = res['QueueTime']
        let interval = setInterval(() => {
          this.value = this.value + 2.5;
          if (this.value >= 100 * this.QueueTime) {
            this.value = 100;
            this.showbutton = false;
            clearInterval(interval);
          }
        }, 1000);

      }
      else {
        this.loading = false;
        alert(res['message'])
      }
    })
  }
  downloadMyApp() {
    this.dataService.downloadMyApp(this.DownloadPath).subscribe((res) => {

      // const blob = new Blob([res], {type:"application/vnd.android.package-archive"});

      // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      this.showFile(res);
    })
  }
  showFile(blob) {
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    // var newBlob = new Blob([blob], {type:"application/vnd.android.package-archive"})
    var newBlob = new Blob([blob], { type: "application/zip" })
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }

    // For other browsers: 
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    link.href = data;
    link.download = "droid-ng.zip";
    link.click();
    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 100);
  }
}
