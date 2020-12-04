module.exports.SetExtensionVersion = function () {

	var start = +new Date();

	 var fs = require("fs");
	 var contents = fs.readFileSync("./gulp-tasks/GulpVariables.json");
	 var jsonContent = JSON.parse(contents);
	jsonContent.ExtensionVersion = process.env.npm_config_buildNo;

	fs.writeFile("./gulp-tasks/GulpVariables.json", JSON.stringify(jsonContent, null, 4), (err) => {
	    if (err) {  console.error(err);  return; };
	    console.log("File has been created");
	    var end = +new Date();
    	console.log("Ran in " + (end-start) + " ms");
	});
};

module.exports.CheckExtensionVersion = function () {
	var start = +new Date();

	var contents = require("fs").readFileSync("./gulp-tasks/GulpVariables.json");
	var jsonContent = JSON.parse(contents);
    console.log(jsonContent.ExtensionVersion);
    
    var end = +new Date();
    console.log("Ran in " + (new Date()-start) + " ms");
};