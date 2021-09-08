var fs = require('fs');
const process = require('process');
async function apk_generator(user,dataToPut,buildZipName){
    try {
        process.chdir('../new_app/src/pages/home');
        console.log("working directory after 1"
            + "changing: " + process.cwd());
        console.log("current working directory: 1 "
            + process.cwd());
        fs.unlink(`home.html`, function (err) {
            if (err) throw err;
            console.log(`File deleted! home.html`);
            fs.appendFile(`home.html`, `<ion-header>
        <ion-navbar>
          <ion-title>
            DroidOTA
          </ion-title>
        </ion-navbar> 
      </ion-header><ion-content padding>${dataToPut}</ion-content>`, function (err) {
                if (err) throw err;
                console.log('Saved!');
                try {
                    process.chdir('/home/ubuntu/new_app');
                    console.log("working directory after 2 "
                        + "changing: " + process.cwd());
                    const exec = require('child_process').exec

                   exec('ionic cordova build android', (err, stdout, stderr) => {
                        console.log(stdout)
                         exec(`zip -r -j ${buildZipName} /home/ubuntu/new_app/platforms/android/app/build/outputs/apk/debug`, (err, stdout, stderr) => {
                        Promise.resolve();
                        })

                    })
                } catch (err) {
                    console.error("error occured while "
                        + "changing directory: " + err);
                }
            })
        })
    } catch (err) {
        console.error("error occured while  1"
            + "changing directory: " + err);
    }
}
module.exports=apk_generator;