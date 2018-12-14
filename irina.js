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
        response.write(`${seconds}\n`);
        a_timeout_object = setInterval(update_time, 1000);
        response.end();
      }
    });
  } else if (request.method === 'GET' && request.url === '/get') {
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
    }).on('end', () => {
      console.log("GET /get !");
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      response.write(`${seconds}\n`);
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
      console.log('Reset')
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
	console.log(`seconds = ${seconds}`);
}
