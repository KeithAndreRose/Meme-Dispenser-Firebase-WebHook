const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

("use strict");
const http = require("https");

exports.appWebhook = functions.https.onRequest((req, res)=>{
  getContent()
    .then(output => {
      res.setHeader("Content-Type", "application/json");
      return res.send(JSON.stringify(output));
    })
    .catch(error => {
      // If there is an error let the user know
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({fulfillmentText: error}));
    });
})

function getMemeSubreddit(){
  let subs = [
    'ImGoingToHellForThis',
    'dank_meme',
    'MemeEconomy',
    'hmmm',
    'Memes_Of_The_Dank'
  ]
  return subs[Math.floor(Math.random() * subs.length + 1)] 
}

function getContent() {
  let subReddit = {sub: getMemeSubreddit(), displayText: "meme"};
  return new Promise((resolve, reject) => {
    console.log("API Request: to Reddit");
    http
      .get(`https://www.reddit.com/r/${subReddit["sub"]}/top.json?sort=top&t=day`, resp => {
        let data = "";
        resp.on("data", chunk => {data += chunk;});
        resp.on("end", () => {
          let response = JSON.parse(data);
          let thread = response["data"]["children"][Math.floor(Math.random() * 24 + 1)]["data"];
          console.log(thread)

          let fullfillment = {
            fulfillmentText: thread["title"],
            fulfillmentMessages: [
              {image: {"imageUri": thread["url"]}},
              {
                text: { 
                  text: ["Meme Dispensed"]
                }
              }
            ]
          }
          console.log(fullfillment);
          resolve(fullfillment);
        });
      })
      .on("error", err => { console.log("Error: " + err.message);
        reject(error);
      });
  });
}
