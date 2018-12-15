// Братан, алё

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

a_timeout_object = null;
seconds = 0;

//server object is an EventEmitter
const server = http.createServer();
server.on('request', (request, response) => {
  //And this is the request handler
  //request is instance of IncomingMessage, has method, url, headers properties
  //const { headers, method, url } = request; meh
  if (request.method === 'GET' && request.url === '/start') {
    // let body = []; meh
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      //body.push(chunk); meh
    }).on ('end', () => {
      console.log("GET /start !");
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      //const responseBody = { headers, method, url }; no body bc idc
      if (a_timeout_object) {
        response.end('Таймер уже начался. Чтобы обнулить: /reset\n');
      } else { 
        if (seconds === 0) {
          response.write('Таймер начался!\n');
        } else {
          response.write('Таймер начался снова!\n');
        }
        response.write(`${secs_to_hms(parseInt(seconds))}\n`);
        a_timeout_object = setInterval(update_time, 1000);
        response.end();
      }
    });
  } else if (request.method === 'GET' && request.url === '/get') {
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
    }).on('end', () => {
      //console.log("GET /get !");
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      //following is for CORS purposes; should be for all endpts really
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.write(`${secs_to_hms(parseInt(seconds))}\n`);
      response.end();
    })
  } else if (request.method === 'GET' && request.url === '/reset') {
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
    }).on('end', () => {
      console.log("GET /reset !");
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      seconds = 0; //каво
      response.end('Таймер обнулился.\n');
    })
  } else if (request.method === 'GET' && request.url === '/pause') {
    //Ля мне лень уже написать ответ сервера лол
    console.log("GET /pause");
    if (a_timeout_object) {
      clearInterval(a_timeout_object);
      a_timeout_object = null;
    }
    response.end('Таймер адихает...\n');
  } else if (request.method === 'GET' && request.url === '/stop') {
    console.log("GET /stop");
    if (a_timeout_object) {
      clearInterval(a_timeout_object);
      a_timeout_object = null;
      seconds = 0;
    }
    response.end('Таймер умер.\n');
  } else {
    response.statusCode = 404;
    response.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


function update_time() {
	seconds++;
	//console.log(`seconds = ${secs_to_hms(parseInt(seconds))}`);
}

var im_alive = setInterval(function(){
  console.log('Таймер ещё жив! Seconds = ' + seconds);
}, 10000)

function secs_to_hms(s) {

  secs = s % 60;
  mins = Math.floor(s/60);
  hrs = Math.floor(mins/60);
  mins = mins % 60;

  mins = mins < 10 ? "0" + mins : mins;
  secs = secs < 10 ? "0" + secs : secs;

  if (hrs > 0) {
    return hrs + " : " + mins + " : " + secs; //uwa, types
  } else {
    return mins + " : " + secs; //uwa, types
  }
}
