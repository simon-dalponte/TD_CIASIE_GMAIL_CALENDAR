var express = require('express');
var axios = require('axios');
var app = express();
// view engine setup
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/node_modules/tabler-ui/src/assets/css/'));




let code = null;
const client_id = '1064165836704-5ps35d6dtddfhj44g79p5opd7hljm304.apps.googleusercontent.com';
const client_secret = 'phjCpWaUNMl3AkeJlzXuy0wK';
let redirect_uri = 'http://localhost:3000/login';
let access_token = null;

app.get('/',function (req,res) {
    res.render('index')
});

app.get('/login',function (req,res) {
  code  = req.query.code;
  console.log(code);
  axios.post(`https://www.googleapis.com/oauth2/v4/token?code=${code}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&grant_type=authorization_code`)
      .then(response => {
          access_token = response.data.access_token;
          console.log(response.data);
          console.log(access_token)
          res.render('index', {token: access_token});

      })
      .catch(err => {
        console.log(err)
      });
});

app.get('/calendar',function (req,res) {
    const date1  = "2019-12-31T10:00:00-07:00";
    url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=${access_token}&maxResults=30&timeMin=${date1}`;
    axios.get(url)
        .then(response =>{
            res.render('calendar', {events : response.data.items})
        })
        .catch(err =>{
            console.log(err)
        });
});

app.post('/calendar',function (req,res){
  let name = req.body.name;
  let date_fin = req.body.date_fin;
  let date_deb = req.body.date_deb;

  let url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token='+access_token;
  console.log(url);
  axios.post(url,  {
      "start" : {"date":date_deb},
      "end" : {"date":date_fin},
      "summary": name
  })
      .then(response => {
          console.log(response);
          res.redirect('/calendar')
      })
      .catch(err => {
          console.log(err)
      })
});

app.listen(8080);
