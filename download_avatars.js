var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    var GITHUB_USER = "vmfesta";
    var GITHUB_TOKEN = "8748221a0d0a7a2d2fa7393d6a094510ee4f9750";
    
    var options = {
        url: 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
        headers: {
            'User-Agent': 'GitHub Avatar Downloader - Student Project'
        }
    };
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
       .pipe(fs.createWriteStream("./avatars/"+ filePath +".jpg"))                
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  //console.log("Result:", result);
  result.forEach(function(user) {
      downloadImageByURL(user.avatar_url, user.login);
  });
  console.log("Download complete.");
});