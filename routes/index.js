var express = require('express')
var bodyParser = require( 'body-parser' );
var app = express();
app.use( bodyParser.urlencoded({ extended: true }) );
var Hash = require('jshashes');
var cors = require('cors');
var session = require('express-session');
module.exports=app;
var util = require('util'),
    exec = require('child_process').exec,
    child;
var arff = require('node-arff');
var u;
app.use(express.static('public'));
app.use(bodyParser.json());
var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('./certs/localhost.key'),
    cert: fs.readFileSync('./certs/localhost.cert'),
    requestCert: false,
    rejectUnauthorized: false
};
app.use(cors());
app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin",  "*");
res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS");
res.header('Access-Control-Allow-Headers', "Content-Type, Authorization, Content-Length, X-Requested-With,X-Custom-Header,Origin");
res.header('Access-Control-Allow-Credentials',"true");
next();
});

var LABcolorCabeza = {
    yellow: rgb2lab([243, 243, 0]),
    buff: rgb2lab([237, 222, 193]),
    white: rgb2lab([255, 255, 255]),
    cinnamon: rgb2lab([156, 80, 48]),
    gray: rgb2lab([169, 169, 169]),
    brown: rgb2lab([102, 51, 0]),
    purple: rgb2lab([135, 0, 144]),
    red: rgb2lab([255, 0, 0]),
    pink: rgb2lab([255, 51, 146]),
    green: rgb2lab([0, 200, 0])
};
var LABcolorLaminas = {
    yellow : rgb2lab([243, 243, 0]),
    buff : rgb2lab([237, 222, 193]),
    white : rgb2lab([255, 255, 255]),
    chocolate : rgb2lab([123, 63, 0]),
    gray: rgb2lab([169, 169, 169]),
    brown : rgb2lab([102, 51, 0]),
    purple : rgb2lab([135, 0, 144]),
    orange: rgb2lab([255, 100, 0]),
    black : rgb2lab([0, 0, 0]),
    red : rgb2lab([255, 0, 0]),
    pink: rgb2lab([255, 51, 146]),
    green : rgb2lab([0, 200, 0])
};
var LABcolorStalkArriba = {
    yellow : rgb2lab([243,243,0]),
    buff : rgb2lab([237,222,193]),
    white : rgb2lab([255,255,255]),
    cinnamon : rgb2lab([156,80,48]),
    gray : rgb2lab([169,169,169]),
    brown : rgb2lab([102,51,0]),
    orange : rgb2lab([255,100,0]),
    red : rgb2lab([255,0,0]),
    pink: rgb2lab([255,51,146])
};
var LABcolorStalkDebajo = {
    yellow : rgb2lab([243,243,0]),
    buff : rgb2lab([237,222,193]),
    white : rgb2lab([255,255,255]),
    cinnamon : rgb2lab([156,80,48]),
    gray : rgb2lab([169,169,169]),
    brown : rgb2lab([102,51,0]),
    orange : rgb2lab([255,100,0]),
    red : rgb2lab([255,0,0]),
    pink: rgb2lab([255,51,146])
};
function rgb2lab(rgb){
    var r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255,
        x, y, z;

    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

    x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
    y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
    z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

    return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}
function deltaE(labA, labB){
    var deltaL = labA[0] - labB[0];
    var deltaA = labA[1] - labB[1];
    var deltaB = labA[2] - labB[2];
    var c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
    var c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
    var deltaC = c1 - c2;
    var deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
    var sc = 1.0 + 0.045 * c1;
    var sh = 1.0 + 0.015 * c1;
    var deltaLKlsl = deltaL / (1.0);
    var deltaCkcsc = deltaC / (sc);
    var deltaHkhsh = deltaH / (sh);
    var i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i);
}
Array.prototype.min = function() {
    return Math.min.apply(null, this);
};
function compare(lab, comparador){
    var comp = [];
    for (var i = 0; i < Object.keys(comparador).length;i++){
        comp[i] = deltaE(lab,comparador[Object.keys(comparador)[i]]);
    }
    var minimo = comp.min();
    for(var i = 0; i < comp.length;i++){
        if(minimo === comp[i]){
            return Object.keys(comparador)[i];
        }
    }
}

app.post('/predict', function (req, res, next) {

    var testData ={
        bruises: req.body.bruise,
        odor: req.body.odor,
        gill:req.body.gill,
        surface:req.body.surface,
        spore: req.body.spore
    };
    var token = new Hash.SHA256(req.body.token).hex(req.body.token)
    var file = './public/dataset/'+token+'.arff';

    exec('touch '+file, function (error,stdout,stderr) {

        if (error !== null) {
            console.log('exec error: ' + error);
        }
        else {

            exec('cat > ' + file + ' <<EOF\n' +
                '@relation \'mushrooms_modificado-weka.filters.unsupervised.attribute.Remove-R1-2,6,8,10\'\n' +
                '\n' +
                '@attribute bruises {bruises,no}\n' +
                '@attribute odor {pungent,almond,anise,none,foul,creosote,fishy,spicy,musty}\n' +
                '@attribute gill {narrow,broad}\n' +
                '@attribute surface {smooth,fibrous,scaly,silky}\n' +
                '@attribute spore {black,brown,purple,chocolate,white,green,orange,yellow,buff}\n' +
                '@attribute class {poisonous,edible}\n' +
                '\n' +
                '@data' +
                '\n' +
                'EOF', function (error, stdout, stderr) {

                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                else{

                    var data=testData.bruises+","+testData.odor+","+testData.gill+","+testData.surface+","+testData.spore+",edible"

                    exec('echo '+data+' >> '+file,function (err,stdout,stderr) {

                        if (error !== null) {
                            console.log('exec error: ' + error);
                        }
                        else{

                            child = exec('java -classpath ./routes/weka.jar weka.classifiers.trees.J48 -l ./public/dataset/mushrooms.model -T '+file, // command line argument directly in string
                                function (error, stdout, stderr) {      // one easy function to capture data/errors
                                    console.log(stderr);
                                    if (error !== null) {
                                        console.log('exec error: ' + error);
                                    }
                                    else{
                                        exec('rm '+file);

                                        var splitted = stdout.split('\n')[39];

                                        var classe= splitted.split(" ");

                                        if (classe[13] === "1" ){
                                            console.log("No la palmas")
                                            res.send("edible");
                                        }
                                        else {
                                            console.log("Corre")
                                            res.send("poisonous");
                                        }


                                    }

                                });
                        }
                    })
                }
            });
        }
    });
});

app.post('/predictFriendly', function (req, res, next) {

    var testData ={
        capSurface: req.body.capSurface,
        capColor: req.body.capColor,
        bruise: req.body.bruise,
        gillSize: req.body.gillSize,
        gillColor: req.body.gillColor,
        stalkShape: req.body.stalkShape,
        stalkRoot: req.body.stalkRoot,
        ringType: req.body.ringType,
        population: req.body.population,
        habitat: req.body.habitat
    };
    var token = new Hash.SHA256(req.body.token).hex(req.body.token);
    var file = './public/dataset/'+token+'.arff';

    exec('touch '+file, function (error,stdout,stderr) {

        if (error !== null) {
            console.log('exec error: ' + error);
        }
        else {

            exec('cat > ' + file + ' <<EOF\n' +
                '@relation \'mushrooms_userfriendly\'\n' +
                '\n' +
                '@attribute capSurface {smooth,scaly,fibrous,grooves}\n' +
                '@attribute capColor {brown,yellow,white,gray,red,pink,buff,purple,cinnamon,green}\n' +
                '@attribute bruises {bruises,no}\n' +
                '@attribute gillSize {narrow,broad}\n' +
                '@attribute gillColor {black,brown,gray,pink,white,chocolate,purple,red,buff,green,yellow,orange}\n' +
                '@attribute stalkShape {enlarging,tapering}\n' +
                '@attribute stalkRoot {equal,club,bulbous,rooted}\n' +
                '@attribute ringType {pendant,evanescent,large,flaring,none}\n' +
                '@attribute population {scattered,numerous,abundant,several,solitary,clustered}\n' +
                '@attribute habitat {urban,grasses,meadows,woods,paths,waste,leaves}\n' +
                '@attribute class {poisonous,edible}\n' +
                '\n' +
                '@data' +
                '\n' +
                'EOF', function (error, stdout, stderr) {

                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                else{

                    var data=testData.capSurface+","+testData.capColor+","+testData.bruise+","+testData.gillSize+","+testData.gillColor+","+testData.stalkShape+","+testData.stalkRoot+","+testData.ringType+","+testData.population+","+testData.habitat+",edible"

                    exec('echo '+data+' >> '+file,function (err,stdout,stderr) {

                        if (error !== null) {
                            console.log('exec error: ' + error);
                        }
                        else{

                            child = exec('java -classpath ./routes/weka.jar weka.classifiers.trees.J48 -l ./public/dataset/userfriendly.model -T '+file, // command line argument directly in string
                                function (error, stdout, stderr) {      // one easy function to capture data/errors
                                    console.log(stderr);
                                    if (error !== null) {
                                        console.log('exec error: ' + error);
                                    }
                                    else{
                                        exec('rm '+file);

                                        var splitted = stdout.split('\n')[67];

                                        var classe= splitted.split(" ");

                                        if (classe[13] === "1" ){
                                            console.log("No la palmas")
                                            res.send("edible");
                                        }
                                        else {
                                            console.log("Corre")
                                            res.send("poisonous");
                                        }


                                    }

                                });
                        }
                    })
                }
            });
        }
    });
});

app.post('/predictImage', function (req, res, next) {

    var testData ={
        capColor: compare(rgb2lab(req.body.cabeza),LABcolorCabeza),
        gillColor: compare(rgb2lab(req.body.lamina),LABcolorLaminas),
        stalkColorAboveRing:compare(rgb2lab(req.body.Aanillo),LABcolorStalkArriba),
        stalkColorBelowRing:compare(rgb2lab(req.body.Danillo),LABcolorStalkDebajo)
    };
    var token = new Hash.SHA256(req.body.token).hex(req.body.token);
    var file = './public/dataset/'+token+'.arff';

    exec('touch '+file, function (error,stdout,stderr) {

        if (error !== null) {
            console.log('exec error: ' + error);
        }
        else {

            exec('cat > ' + file + ' <<EOF\n' +
                '@relation mushrooms_color\n' +
                '\n' +
                '@attribute capColor {brown,yellow,white,gray,red,pink,buff,purple,cinnamon,green}\n' +
                '@attribute gillColor {black,brown,gray,pink,white,chocolate,purple,red,buff,green,yellow,orange}\n' +
                '@attribute stalkColorAboveRing {white,gray,pink,brown,buff,red,orange,cinnamon,yellow}\n' +
                '@attribute stalkColorBelowRing {white,pink,gray,buff,brown,red,yellow,orange,cinnamon}\n' +
                '@attribute class {poisonous,edible}\n' +
                '\n' +
                '@data' +
                '\n' +
                'EOF', function (error, stdout, stderr) {

                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                else{

                    var data=testData.capColor+","+testData.gillColor+","+testData.stalkColorAboveRing+","+testData.stalkColorBelowRing+",edible";

                    exec('echo '+data+' >> '+file,function (err,stdout,stderr) {

                        if (error !== null) {
                            console.log('exec error: ' + error);
                        }
                        else{

                            child = exec('java -classpath ./routes/weka.jar weka.classifiers.trees.J48 -l ./public/dataset/mushrooms_color.model -T '+file, // command line argument directly in string
                                function (error, stdout, stderr) {      // one easy function to capture data/errors
                                    console.log('std error : ' + stderr);
                                    if (error !== null) {
                                        console.log('exec error: ' + error);
                                    }
                                    else{
                                        exec('rm '+file);

                                        var splitted = stdout.split('\n')[176];

                                        var classe= splitted.split(" ");

                                        if (classe[13] === "1" ){
                                            console.log("No la palmas");
                                            res.send("edible");
                                        }
                                        else {
                                            console.log("Corre");
                                            res.send("poisonous");
                                        }


                                    }

                                });
                        }
                    })
                }
            });
        }
    });
});

app.listen(3500, function () {
    console.log('App listening on port 3500!!')
});

var server = https.createServer(options, app).listen(3000, function(){
    console.log("Secure server started at port 3000");
});