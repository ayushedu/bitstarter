#!/usr/bin/env node
/* Automatically grade file for specific HTML tags/elements */
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler'); 
var sys = require('util');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var checksfile;
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s doesn't exist. Exiting.", instr);
	process.exist();
    }

    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

/*var checkJson = checkHtmlFile(program.file, program.checks);*/

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    console.log("$ using cheerio "+$);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
//    return out;
    printOutput(out);
};


var clone = function(fn) {
    return fn.bind({});
};

var getResp = function(url, checksfile) {
    this.checksfile = checksfile;
    var tempdata = rest.get(url).on('complete', function(response ){

	//processChecks(data);
	//var checks = loadChecks(checksfile).sort();
	/*var out = {};
	var data = JSON.parse(response);*/
	/*for(var ii in checks) {
            var present = data(checks[ii]).length > 0;
            out[checks[ii]] = present;
	}*/
	//console.log('returning response ');
	// JSON.parse(response);
	processChecks(response);
    });
     //   var data = tempdata
    /*console.log('data set '+this.data);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = this.data(checks[ii]).length > 0;
	out[checks[ii]] = present;
    } */
    
};

var processChecks = function(text) {
    //var data = JSON.stringify(text);
    var data = cheerio.load(text);
    console.log('text in processChecks ' + data);
//    var data = JSON.parse(text.html());

    var checks = loadChecks(this.checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = data(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }

    printOutput(out);
}

var printOutput = function(jsonData) {
    var outJson = JSON.stringify(jsonData, null, 4);
    console.log(outJson);
}

if(require.main == module) {
    program.option('-c, --checks <check-file>', 'path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT).option('-f, --file <html-file>', 'path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT).option('-u, --url <url-file>','url of index.html').parse(process.argv) 

//.option('-u, --url <url>', 'path to url').parse(process.argv);

/*
.option('-f, --file <html-file>', 'path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT).parse(pr\
ocess.argv)
*/

    var checkJson; 
    if(program.url) {
	console.log('run with url');
	checkJson = getResp(program.url, program.checks);
    } else if(program.file) {
	console.log('run with file');
	checkJson = checkHtmlFile(program.file, program.checks);
    }
    
    //
    
    console.log('program complete...');
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
