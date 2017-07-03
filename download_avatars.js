var request = require('request');
var fs = require('fs');
require('dotenv').config();

args = process.argv.slice(2); //remove first arguments from args, not necessary

var owner = args[0];
var repo = args[1];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
        url: 'https://'+ process.env.GITHUB_USER + ':' + process.env.GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
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

getRepoContributors(owner, repo, function(err, result) {
  if(owner !== undefined|| repo !== undefined) { //verify if the user has input something
    result.forEach(function(user) {
        downloadImageByURL(user.avatar_url, user.login);
    });
    console.log("Download complete."); //if not warn him
  } else {
    console.log("No data has been input, please verify and try again");
  }
});