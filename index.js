const dotenv = require('dotenv')
dotenv.config();
const express = require('express')
const mysql = require('mysql')
const path = require("path")


const fetch = require('node-fetch');


const expressApp = express()
const port = 3000;

const connection = mysql.createConnection({
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   user: process.env.DB_USER,
   database: process.env.DB_DATABASE,
   password: process.env.DB_PASSWORD
});







expressApp.use(express.static('static'))
expressApp.use(express.json());



const { Telegraf } = require('telegraf')



const bot = new Telegraf(process.env.BOT_TOKEN);

const botstart = () => {
   expressApp.get("/", (req, res) => {
      res.sendFile(path.join(__dirname + '/index.html'));
   });

   bot.launch()

   bot.command('start', ctx => {
      console.log(ctx.from)
      bot.telegram.sendMessage(ctx.chat.id, `Привет ${ctx.from.first_name} ${ctx.from.last_name}`)

      var sql = `INSERT INTO usersTest (name, last_name) VALUES ("${ctx.from.first_name}", "${ctx.from.last_name}")`;
      connection.query(sql, function (err, result) {
         if (err) throw err;
         console.log("1 record inserted");
      })
   })


}
fetch('https://api.trello.com/1/webhooks/?' +
   'callbackURL=https://webhook.site/5c0e44a7-389d-4962-998f-9b3b0ff8f987' +
   '&idModel=634ffbc0f558e1042f1ee605' +
   '&key=88bf2592511f43ea75687c1556020fb9' +
   '&token=0182fc66efb2688b8b35a7f1a2869262e1fe03b09fb305342347f5777121debe', {
   method: 'POST',
   headers: {
      'Accept': 'application/json'
   }
})
   .then(response => {
      console.log(
         `Response: ${response.status} ${response.statusText}`
      );
      return response.text();
   })
   .then(text => console.log(text))
   .catch(err => console.error(err));

expressApp.post("https://webhook.site/5c0e44a7-389d-4962-998f-9b3b0ff8f987", function (req, res) {


   console.log(res);

   res.json({
      message: 'ok got it!'
   });
});

botstart()

