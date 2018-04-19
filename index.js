var express = require('express');
var app = express();
var fs = require('fs');
var dictionary =[];

var keyValue = [];

function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({nope: true});
  } else {
    next();
  }
}

var text = fs.readFileSync("./wordlist.txt", "utf-8");
text.split(/\n/).forEach(function (item) {
    	dictionary.push(item);
});

console.log("Dictionary has " +dictionary.length + " words");

function *permute(a, n = a.length) {
  if (n <= 1) yield a.slice();
  else for (let i = 0; i < n; i++) {
    yield *permute(a, n - 1);
    const j = n % 2 ? 0 : i;
    [a[n-1], a[j]] = [a[j], a[n-1]];
  }
}

function permutate( keyword  ) {
    
	var anagrams =[];
	var permutations = Array.from(permute(keyword.split(''))).map(perm => perm.join(''));
	console.log(keyword +" has ["+permutations.length +" ] permutations");
	
    permutations.forEach(function (item) {
    	var index = dictionary.indexOf(item);
    	if (index != -1) {
    	//if (dictionary.includes(item)) {
    		if (keyword === item || anagrams.includes(item)) {
    			//don't add keyword to anagrams
    		} else {
    			if ( item === dictionary[index]){
    				anagrams.push(item);
    				console.log(item +" : "+ dictionary[index] +" : "+ index +" [ " +permutations.indexOf(item)+ " ]");
    			}
    			
    		}
    	}
    });
    keyValue[keyword] = anagrams;
    anagrams =[];
    return keyValue;

}
/*
function getAnagrams( keyValue ) {
    var line = "";
    var output = "";
    for(var x in keyValue) {
        line = "\""+x+"\":[";
        var value = keyValue[x];
        for (var y in value) {
             if ( line.slice(-1) === "[" ) {
                line = line +"\""+value[y]+"\"";
             } else {
                line = line +",\""+value[y]+"\"";
            }
        }
        //console.log(line);
        line = line+"],";
        output = output + line;
        line = "";
    }
    console.log(output.slice(0,-1));
    return output;
};
*/

app.use(ignoreFavicon);

app.get("/", function (req, res, next) {
//router.get('/', function(req, res, next) {
	res.send("Anangram Server : Enter a single word or comma separated list after /")
	next();
});


app.get("/:word", function (req, res ) {
//router.get('/:word', function(req, res) {
	const word = req.params.word;
		console.log('GET /:word '+word);
	var keywords = word.split(',');
	console.log("Parsed Words = "+keywords.length);
	var hash = [];
    keywords.forEach(function(item) {
    	//permutate(item);
        hash.concat(permutate(item));
        console.log("hash = "+ hash)
    });
    
    var line = "";
    var output = "";
    for(var x in keyValue) {
    	line = "\""+x+"\":[";
    	var value = keyValue[x];
    	for (var y in value) {
    		 if ( line.slice(-1) === "[" ) {
				line = line +"\""+value[y]+"\"";
    		 } else {
    		 	line = line +",\""+value[y]+"\"";
    		}
    	}
    	//console.log(line);
    	line = line+"],";
    	output = output + line;
    	line = "";
    }
	console.log(output.slice(0,-1));
	
    

	res.send("{"+ output.slice(0,-1) +"}" ); 
    output = "";  
    keyValue =[];  
});



app.listen(8080, function() {
	console.log("Anagram Server on port 8080");
});