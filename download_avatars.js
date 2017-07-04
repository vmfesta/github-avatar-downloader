var request = require('request');
var fs = require('fs');
require('dotenv').config(); //for the configuration file

args = process.argv.slice(2); //remove first arguments from args, not necessary

var owner = args[0];
var repo = args[1];
var gitUser = process.env.GITHUB_USER;
var gitToken = process.env.GITHUB_TOKEN;
var stopProcess = false;
var errorMessage = "";

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    
    checkConfigs();
    checkIfFolderExists();
    var options = {
        url: 'https://'+ gitUser + ':' + gitToken + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
        headers: {
            'User-Agent': 'GitHub Avatar Downloader - Student Project'
        }
    };
    //the user list will be on body object
    request.get(options, function(error, response, body) {
        var data = JSON.parse(body);
        cb(error, data);
    })

};

function downloadImageByURL(url, filePath) {
    request.get(url)              
        .on('error', function (err) {                                  
            throw err; 
        })
    .pipe(fs.createWriteStream("./avatars/"+ filePath +".jpg")) //download the images by user url           
}

//check if the config file and the values inside is it 
function checkConfigs() {
    if(!gitUser || !gitToken) { //when string empty, returns false
        errorMessage += "\nThere is a problem with the config.env file, please verify";
        stopProcess = true;
    }
}
//check if the folder that the files will be download exists
function checkIfFolderExists() {
    debugger;
    if(!fs.existsSync("./avatars/")) { //if its false, log the message
        stopProcess = true;
        errorMessage += "\nThe folder avatars were not found, please create and try again";
    }
}

getRepoContributors(owner, repo, function(err, result) {
  if(stopProcess === false) {
    if((owner !== undefined || repo !== undefined)) { //verify if the user has input something
        result.forEach(function(user) {
            downloadImageByURL(user.avatar_url, user.login);
        });
        
    } else {
        console.log("No data has been input, please verify and try again\n" );
        return;
    }
    console.log("Download complete."); //if not warn him
  } else {
      console.log(errorMessage);
      return;
  }
});