'use strict';
var util = require('util');
// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');
var jwt2 = require('jwt-simple');
var jsonSize = require('json-size');
var request = require('request');
exports.logExecuteData = [];
console.log("JWT" + JWT);

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.hostname,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    /*console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.hostname);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);*/
}
/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function(req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.status(200).send('Edit');
};
/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function(req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.status(200).send('Save');
};
/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function(req, res) {
    // example on how to decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {
        // verification error -> unauthorized request
        if (err) {
            console.error('ERRO AQUI: ' + err);
            return res.status(401).end();
        }
        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            console.log("entrou no if dos argumentos");
            //console.log("ARGUMENT -> " + util.inspect(decoded.inArguments[0]));
            //console.log('SIZE -> ' + jsonSize(decoded.inArguments[0]));
            // decoded in arguments
            var decodedArgs = decoded.inArguments[0];
            const data = JSON.stringify(decodedArgs);
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var newToday = dd + '/' + mm + '/' + yyyy;
            console.log(newToday);
            var reqOpts = {
                url: 'https://www.bancoprimus.pt/pc/Home/CreateNote',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    "chave": decodedArgs.CodigoWebsiteAtual,
                    "tipoEnvio": decodedArgs.Origem,
                    "campanha": decodedArgs.Campanha,
                    "dataEnvio": newToday,
                }),
            };
            console.log(JSON.stringify({
                "chave": decodedArgs.CodigoWebsiteAtual,
                "tipoEnvio": decodedArgs.Origem,
                "campanha": decodedArgs.Campanha,
                "dataEnvio": newToday,
            }));
            request(reqOpts, function(error, response, body) {
                if (error) {
                    console.error('ERROR: ', error);
                    return res.status(500).end();
                } else {
                    console.log('SUCESSO');
                    res.status(200).send('Execute');
                }
            }.bind(this));
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};
/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function(req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.status(200).send('Publish');
};
/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function(req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    console.log('CARREGUEI BUTTON 2');
    console.log(req.body);
    logData(req);
    res.status(200).send('Validate');
};