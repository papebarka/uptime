/*
 *
 *
 * Entry file for the app
 * 
 * 
 */
 

// Dependencies

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

//Create a server object to listen to the app requests
const server = http.createServer((req, res) => {

    const rawUrl = req.url;

    const parsedUrl= url.parse(req.url, true);

    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Query String -> ?name

    const queryString = parsedUrl.query; // returns a query string object

    const method = req.method.toLowerCase();

    const headers = req.headers;

    // StringDecoder iis for handling buffer
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', () => {
        buffer += decoder.write(data);
    });
    req.on('end', () =>{
        buffer += decoder.end();
    })

    const selectedHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

    const data = {
        'trimmedPath': trimmedPath,
        'queryString': queryString,
        'method': method,
        'headers': headers,
        'payload': buffer
    }

    //Route the request
    selectedHandler(data, (statusCode, payload) => {
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        payload = typeof(payload) == 'object' ? payload : {};

        const payloadString = JSON.stringify(payload);

        res.writeHead(statusCode);
        res.end(payloadString);
    })
    //res.end("Hello World\n");

    //console.log(req);
    console.log(`Raw url: ${rawUrl}`);
    console.log(`Parsed url: ${parsedUrl}`);
    console.log(`Query String:`);
    console.log(queryString);
    console.log("Headers: ", headers);
    console.info(`New ${method} request on: ${trimmedPath}`);
    console.info(`Received wth payload: ${buffer}`);
})

//Listen to the server, notify when it launches
server.listen(3000, () => {
    console.log("The server is listening on port 3000");
})

// Define handlers

const handlers = {};

handlers.sample = (data, callback) => {
    callback(406, {'name' : 'sample handler'});
};

handlers.notFound = (data, callback) => {
    callback(404);
};

// Router
const router = {
    'sample': handlers.sample
};