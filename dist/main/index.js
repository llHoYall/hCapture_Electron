/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/oauth/index.js":
/*!*************************************!*\
  !*** ./node_modules/oauth/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.OAuth = __webpack_require__(/*! ./lib/oauth */ "./node_modules/oauth/lib/oauth.js").OAuth;
exports.OAuthEcho = __webpack_require__(/*! ./lib/oauth */ "./node_modules/oauth/lib/oauth.js").OAuthEcho;
exports.OAuth2 = __webpack_require__(/*! ./lib/oauth2 */ "./node_modules/oauth/lib/oauth2.js").OAuth2;

/***/ }),

/***/ "./node_modules/oauth/lib/_utils.js":
/*!******************************************!*\
  !*** ./node_modules/oauth/lib/_utils.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Returns true if this is a host that closes *before* it ends?!?!
module.exports.isAnEarlyCloseHost= function( hostName ) {
  return hostName && hostName.match(".*google(apis)?.com$")
}

/***/ }),

/***/ "./node_modules/oauth/lib/oauth.js":
/*!*****************************************!*\
  !*** ./node_modules/oauth/lib/oauth.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var crypto= __webpack_require__(/*! crypto */ "crypto"),
    sha1= __webpack_require__(/*! ./sha1 */ "./node_modules/oauth/lib/sha1.js"),
    http= __webpack_require__(/*! http */ "http"),
    https= __webpack_require__(/*! https */ "https"),
    URL= __webpack_require__(/*! url */ "url"),
    querystring= __webpack_require__(/*! querystring */ "querystring"),
    OAuthUtils= __webpack_require__(/*! ./_utils */ "./node_modules/oauth/lib/_utils.js");

exports.OAuth= function(requestUrl, accessUrl, consumerKey, consumerSecret, version, authorize_callback, signatureMethod, nonceSize, customHeaders) {
  this._isEcho = false;

  this._requestUrl= requestUrl;
  this._accessUrl= accessUrl;
  this._consumerKey= consumerKey;
  this._consumerSecret= this._encodeData( consumerSecret );
  if (signatureMethod == "RSA-SHA1") {
    this._privateKey = consumerSecret;
  }
  this._version= version;
  if( authorize_callback === undefined ) {
    this._authorize_callback= "oob";
  }
  else {
    this._authorize_callback= authorize_callback;
  }

  if( signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "RSA-SHA1")
    throw new Error("Un-supported signature method: " + signatureMethod )
  this._signatureMethod= signatureMethod;
  this._nonceSize= nonceSize || 32;
  this._headers= customHeaders || {"Accept" : "*/*",
                                   "Connection" : "close",
                                   "User-Agent" : "Node authentication"}
  this._clientOptions= this._defaultClientOptions= {"requestTokenHttpMethod": "POST",
                                                    "accessTokenHttpMethod": "POST",
                                                    "followRedirects": true};
  this._oauthParameterSeperator = ",";
};

exports.OAuthEcho= function(realm, verify_credentials, consumerKey, consumerSecret, version, signatureMethod, nonceSize, customHeaders) {
  this._isEcho = true;

  this._realm= realm;
  this._verifyCredentials = verify_credentials;
  this._consumerKey= consumerKey;
  this._consumerSecret= this._encodeData( consumerSecret );
  if (signatureMethod == "RSA-SHA1") {
    this._privateKey = consumerSecret;
  }
  this._version= version;

  if( signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "RSA-SHA1")
    throw new Error("Un-supported signature method: " + signatureMethod );
  this._signatureMethod= signatureMethod;
  this._nonceSize= nonceSize || 32;
  this._headers= customHeaders || {"Accept" : "*/*",
                                   "Connection" : "close",
                                   "User-Agent" : "Node authentication"};
  this._oauthParameterSeperator = ",";
}

exports.OAuthEcho.prototype = exports.OAuth.prototype;

exports.OAuth.prototype._getTimestamp= function() {
  return Math.floor( (new Date()).getTime() / 1000 );
}

exports.OAuth.prototype._encodeData= function(toEncode){
 if( toEncode == null || toEncode == "" ) return ""
 else {
    var result= encodeURIComponent(toEncode);
    // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
    return result.replace(/\!/g, "%21")
                 .replace(/\'/g, "%27")
                 .replace(/\(/g, "%28")
                 .replace(/\)/g, "%29")
                 .replace(/\*/g, "%2A");
 }
}

exports.OAuth.prototype._decodeData= function(toDecode) {
  if( toDecode != null ) {
    toDecode = toDecode.replace(/\+/g, " ");
  }
  return decodeURIComponent( toDecode);
}

exports.OAuth.prototype._getSignature= function(method, url, parameters, tokenSecret) {
  var signatureBase= this._createSignatureBase(method, url, parameters);
  return this._createSignature( signatureBase, tokenSecret );
}

exports.OAuth.prototype._normalizeUrl= function(url) {
  var parsedUrl= URL.parse(url, true)
   var port ="";
   if( parsedUrl.port ) {
     if( (parsedUrl.protocol == "http:" && parsedUrl.port != "80" ) ||
         (parsedUrl.protocol == "https:" && parsedUrl.port != "443") ) {
           port= ":" + parsedUrl.port;
         }
   }

  if( !parsedUrl.pathname  || parsedUrl.pathname == "" ) parsedUrl.pathname ="/";

  return parsedUrl.protocol + "//" + parsedUrl.hostname + port + parsedUrl.pathname;
}

// Is the parameter considered an OAuth parameter
exports.OAuth.prototype._isParameterNameAnOAuthParameter= function(parameter) {
  var m = parameter.match('^oauth_');
  if( m && ( m[0] === "oauth_" ) ) {
    return true;
  }
  else {
    return false;
  }
};

// build the OAuth request authorization header
exports.OAuth.prototype._buildAuthorizationHeaders= function(orderedParameters) {
  var authHeader="OAuth ";
  if( this._isEcho ) {
    authHeader += 'realm="' + this._realm + '",';
  }

  for( var i= 0 ; i < orderedParameters.length; i++) {
     // Whilst the all the parameters should be included within the signature, only the oauth_ arguments
     // should appear within the authorization header.
     if( this._isParameterNameAnOAuthParameter(orderedParameters[i][0]) ) {
      authHeader+= "" + this._encodeData(orderedParameters[i][0])+"=\""+ this._encodeData(orderedParameters[i][1])+"\""+ this._oauthParameterSeperator;
     }
  }

  authHeader= authHeader.substring(0, authHeader.length-this._oauthParameterSeperator.length);
  return authHeader;
}

// Takes an object literal that represents the arguments, and returns an array
// of argument/value pairs.
exports.OAuth.prototype._makeArrayOfArgumentsHash= function(argumentsHash) {
  var argument_pairs= [];
  for(var key in argumentsHash ) {
    if (argumentsHash.hasOwnProperty(key)) {
       var value= argumentsHash[key];
       if( Array.isArray(value) ) {
         for(var i=0;i<value.length;i++) {
           argument_pairs[argument_pairs.length]= [key, value[i]];
         }
       }
       else {
         argument_pairs[argument_pairs.length]= [key, value];
       }
    }
  }
  return argument_pairs;
}

// Sorts the encoded key value pairs by encoded name, then encoded value
exports.OAuth.prototype._sortRequestParams= function(argument_pairs) {
  // Sort by name, then value.
  argument_pairs.sort(function(a,b) {
      if ( a[0]== b[0] )  {
        return a[1] < b[1] ? -1 : 1;
      }
      else return a[0] < b[0] ? -1 : 1;
  });

  return argument_pairs;
}

exports.OAuth.prototype._normaliseRequestParams= function(args) {
  var argument_pairs= this._makeArrayOfArgumentsHash(args);
  // First encode them #3.4.1.3.2 .1
  for(var i=0;i<argument_pairs.length;i++) {
    argument_pairs[i][0]= this._encodeData( argument_pairs[i][0] );
    argument_pairs[i][1]= this._encodeData( argument_pairs[i][1] );
  }

  // Then sort them #3.4.1.3.2 .2
  argument_pairs= this._sortRequestParams( argument_pairs );

  // Then concatenate together #3.4.1.3.2 .3 & .4
  var args= "";
  for(var i=0;i<argument_pairs.length;i++) {
      args+= argument_pairs[i][0];
      args+= "="
      args+= argument_pairs[i][1];
      if( i < argument_pairs.length-1 ) args+= "&";
  }
  return args;
}

exports.OAuth.prototype._createSignatureBase= function(method, url, parameters) {
  url= this._encodeData( this._normalizeUrl(url) );
  parameters= this._encodeData( parameters );
  return method.toUpperCase() + "&" + url + "&" + parameters;
}

exports.OAuth.prototype._createSignature= function(signatureBase, tokenSecret) {
   if( tokenSecret === undefined ) var tokenSecret= "";
   else tokenSecret= this._encodeData( tokenSecret );
   // consumerSecret is already encoded
   var key= this._consumerSecret + "&" + tokenSecret;

   var hash= ""
   if( this._signatureMethod == "PLAINTEXT" ) {
     hash= key;
   }
   else if (this._signatureMethod == "RSA-SHA1") {
     key = this._privateKey || "";
     hash= crypto.createSign("RSA-SHA1").update(signatureBase).sign(key, 'base64');
   }
   else {
       if( crypto.Hmac ) {
         hash = crypto.createHmac("sha1", key).update(signatureBase).digest("base64");
       }
       else {
         hash= sha1.HMACSHA1(key, signatureBase);
       }
   }
   return hash;
}
exports.OAuth.prototype.NONCE_CHARS= ['a','b','c','d','e','f','g','h','i','j','k','l','m','n',
              'o','p','q','r','s','t','u','v','w','x','y','z','A','B',
              'C','D','E','F','G','H','I','J','K','L','M','N','O','P',
              'Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3',
              '4','5','6','7','8','9'];

exports.OAuth.prototype._getNonce= function(nonceSize) {
   var result = [];
   var chars= this.NONCE_CHARS;
   var char_pos;
   var nonce_chars_length= chars.length;

   for (var i = 0; i < nonceSize; i++) {
       char_pos= Math.floor(Math.random() * nonce_chars_length);
       result[i]=  chars[char_pos];
   }
   return result.join('');
}

exports.OAuth.prototype._createClient= function( port, hostname, method, path, headers, sslEnabled ) {
  var options = {
    host: hostname,
    port: port,
    path: path,
    method: method,
    headers: headers
  };
  var httpModel;
  if( sslEnabled ) {
    httpModel= https;
  } else {
    httpModel= http;
  }
  return httpModel.request(options);
}

exports.OAuth.prototype._prepareParameters= function( oauth_token, oauth_token_secret, method, url, extra_params ) {
  var oauthParameters= {
      "oauth_timestamp":        this._getTimestamp(),
      "oauth_nonce":            this._getNonce(this._nonceSize),
      "oauth_version":          this._version,
      "oauth_signature_method": this._signatureMethod,
      "oauth_consumer_key":     this._consumerKey
  };

  if( oauth_token ) {
    oauthParameters["oauth_token"]= oauth_token;
  }

  var sig;
  if( this._isEcho ) {
    sig = this._getSignature( "GET",  this._verifyCredentials,  this._normaliseRequestParams(oauthParameters), oauth_token_secret);
  }
  else {
    if( extra_params ) {
      for( var key in extra_params ) {
        if (extra_params.hasOwnProperty(key)) oauthParameters[key]= extra_params[key];
      }
    }
    var parsedUrl= URL.parse( url, false );

    if( parsedUrl.query ) {
      var key2;
      var extraParameters= querystring.parse(parsedUrl.query);
      for(var key in extraParameters ) {
        var value= extraParameters[key];
          if( typeof value == "object" ){
            // TODO: This probably should be recursive
            for(key2 in value){
              oauthParameters[key + "[" + key2 + "]"] = value[key2];
            }
          } else {
            oauthParameters[key]= value;
          }
        }
    }

    sig = this._getSignature( method,  url,  this._normaliseRequestParams(oauthParameters), oauth_token_secret);
  }

  var orderedParameters= this._sortRequestParams( this._makeArrayOfArgumentsHash(oauthParameters) );
  orderedParameters[orderedParameters.length]= ["oauth_signature", sig];
  return orderedParameters;
}

exports.OAuth.prototype._performSecureRequest= function( oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type,  callback ) {
  var orderedParameters= this._prepareParameters(oauth_token, oauth_token_secret, method, url, extra_params);

  if( !post_content_type ) {
    post_content_type= "application/x-www-form-urlencoded";
  }
  var parsedUrl= URL.parse( url, false );
  if( parsedUrl.protocol == "http:" && !parsedUrl.port ) parsedUrl.port= 80;
  if( parsedUrl.protocol == "https:" && !parsedUrl.port ) parsedUrl.port= 443;

  var headers= {};
  var authorization = this._buildAuthorizationHeaders(orderedParameters);
  if ( this._isEcho ) {
    headers["X-Verify-Credentials-Authorization"]= authorization;
  }
  else {
    headers["Authorization"]= authorization;
  }

  headers["Host"] = parsedUrl.host

  for( var key in this._headers ) {
    if (this._headers.hasOwnProperty(key)) {
      headers[key]= this._headers[key];
    }
  }

  // Filter out any passed extra_params that are really to do with OAuth
  for(var key in extra_params) {
    if( this._isParameterNameAnOAuthParameter( key ) ) {
      delete extra_params[key];
    }
  }

  if( (method == "POST" || method == "PUT")  && ( post_body == null && extra_params != null) ) {
    // Fix the mismatch between the output of querystring.stringify() and this._encodeData()
    post_body= querystring.stringify(extra_params)
                       .replace(/\!/g, "%21")
                       .replace(/\'/g, "%27")
                       .replace(/\(/g, "%28")
                       .replace(/\)/g, "%29")
                       .replace(/\*/g, "%2A");
  }

  if( post_body ) {
      if ( Buffer.isBuffer(post_body) ) {
          headers["Content-length"]= post_body.length;
      } else {
          headers["Content-length"]= Buffer.byteLength(post_body);
      }
  } else {
      headers["Content-length"]= 0;
  }

  headers["Content-Type"]= post_content_type;

  var path;
  if( !parsedUrl.pathname  || parsedUrl.pathname == "" ) parsedUrl.pathname ="/";
  if( parsedUrl.query ) path= parsedUrl.pathname + "?"+ parsedUrl.query ;
  else path= parsedUrl.pathname;

  var request;
  if( parsedUrl.protocol == "https:" ) {
    request= this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers, true);
  }
  else {
    request= this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers);
  }

  var clientOptions = this._clientOptions;
  if( callback ) {
    var data="";
    var self= this;

    // Some hosts *cough* google appear to close the connection early / send no content-length header
    // allow this behaviour.
    var allowEarlyClose= OAuthUtils.isAnEarlyCloseHost( parsedUrl.hostname );
    var callbackCalled= false;
    var passBackControl = function( response ) {
      if(!callbackCalled) {
        callbackCalled= true;
        if ( response.statusCode >= 200 && response.statusCode <= 299 ) {
          callback(null, data, response);
        } else {
          // Follow 301 or 302 redirects with Location HTTP header
          if((response.statusCode == 301 || response.statusCode == 302) && clientOptions.followRedirects && response.headers && response.headers.location) {
            self._performSecureRequest( oauth_token, oauth_token_secret, method, response.headers.location, extra_params, post_body, post_content_type,  callback);
          }
          else {
            callback({ statusCode: response.statusCode, data: data }, data, response);
          }
        }
      }
    }

    request.on('response', function (response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        data+=chunk;
      });
      response.on('end', function () {
        passBackControl( response );
      });
      response.on('close', function () {
        if( allowEarlyClose ) {
          passBackControl( response );
        }
      });
    });

    request.on("error", function(err) {
      if(!callbackCalled) {
        callbackCalled= true;
        callback( err )
      }
    });

    if( (method == "POST" || method =="PUT") && post_body != null && post_body != "" ) {
      request.write(post_body);
    }
    request.end();
  }
  else {
    if( (method == "POST" || method =="PUT") && post_body != null && post_body != "" ) {
      request.write(post_body);
    }
    return request;
  }

  return;
}

exports.OAuth.prototype.setClientOptions= function(options) {
  var key,
      mergedOptions= {},
      hasOwnProperty= Object.prototype.hasOwnProperty;

  for( key in this._defaultClientOptions ) {
    if( !hasOwnProperty.call(options, key) ) {
      mergedOptions[key]= this._defaultClientOptions[key];
    } else {
      mergedOptions[key]= options[key];
    }
  }

  this._clientOptions= mergedOptions;
};

exports.OAuth.prototype.getOAuthAccessToken= function(oauth_token, oauth_token_secret, oauth_verifier,  callback) {
  var extraParams= {};
  if( typeof oauth_verifier == "function" ) {
    callback= oauth_verifier;
  } else {
    extraParams.oauth_verifier= oauth_verifier;
  }

   this._performSecureRequest( oauth_token, oauth_token_secret, this._clientOptions.accessTokenHttpMethod, this._accessUrl, extraParams, null, null, function(error, data, response) {
         if( error ) callback(error);
         else {
           var results= querystring.parse( data );
           var oauth_access_token= results["oauth_token"];
           delete results["oauth_token"];
           var oauth_access_token_secret= results["oauth_token_secret"];
           delete results["oauth_token_secret"];
           callback(null, oauth_access_token, oauth_access_token_secret, results );
         }
   })
}

// Deprecated
exports.OAuth.prototype.getProtectedResource= function(url, method, oauth_token, oauth_token_secret, callback) {
  this._performSecureRequest( oauth_token, oauth_token_secret, method, url, null, "", null, callback );
}

exports.OAuth.prototype.delete= function(url, oauth_token, oauth_token_secret, callback) {
  return this._performSecureRequest( oauth_token, oauth_token_secret, "DELETE", url, null, "", null, callback );
}

exports.OAuth.prototype.get= function(url, oauth_token, oauth_token_secret, callback) {
  return this._performSecureRequest( oauth_token, oauth_token_secret, "GET", url, null, "", null, callback );
}

exports.OAuth.prototype._putOrPost= function(method, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
  var extra_params= null;
  if( typeof post_content_type == "function" ) {
    callback= post_content_type;
    post_content_type= null;
  }
  if ( typeof post_body != "string" && !Buffer.isBuffer(post_body) ) {
    post_content_type= "application/x-www-form-urlencoded"
    extra_params= post_body;
    post_body= null;
  }
  return this._performSecureRequest( oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type, callback );
}


exports.OAuth.prototype.put= function(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
  return this._putOrPost("PUT", url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
}

exports.OAuth.prototype.post= function(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
  return this._putOrPost("POST", url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
}

/**
 * Gets a request token from the OAuth provider and passes that information back
 * to the calling code.
 *
 * The callback should expect a function of the following form:
 *
 * function(err, token, token_secret, parsedQueryString) {}
 *
 * This method has optional parameters so can be called in the following 2 ways:
 *
 * 1) Primary use case: Does a basic request with no extra parameters
 *  getOAuthRequestToken( callbackFunction )
 *
 * 2) As above but allows for provision of extra parameters to be sent as part of the query to the server.
 *  getOAuthRequestToken( extraParams, callbackFunction )
 *
 * N.B. This method will HTTP POST verbs by default, if you wish to override this behaviour you will
 * need to provide a requestTokenHttpMethod option when creating the client.
 *
 **/
exports.OAuth.prototype.getOAuthRequestToken= function( extraParams, callback ) {
   if( typeof extraParams == "function" ){
     callback = extraParams;
     extraParams = {};
   }
  // Callbacks are 1.0A related
  if( this._authorize_callback ) {
    extraParams["oauth_callback"]= this._authorize_callback;
  }
  this._performSecureRequest( null, null, this._clientOptions.requestTokenHttpMethod, this._requestUrl, extraParams, null, null, function(error, data, response) {
    if( error ) callback(error);
    else {
      var results= querystring.parse(data);

      var oauth_token= results["oauth_token"];
      var oauth_token_secret= results["oauth_token_secret"];
      delete results["oauth_token"];
      delete results["oauth_token_secret"];
      callback(null, oauth_token, oauth_token_secret,  results );
    }
  });
}

exports.OAuth.prototype.signUrl= function(url, oauth_token, oauth_token_secret, method) {

  if( method === undefined ) {
    var method= "GET";
  }

  var orderedParameters= this._prepareParameters(oauth_token, oauth_token_secret, method, url, {});
  var parsedUrl= URL.parse( url, false );

  var query="";
  for( var i= 0 ; i < orderedParameters.length; i++) {
    query+= orderedParameters[i][0]+"="+ this._encodeData(orderedParameters[i][1]) + "&";
  }
  query= query.substring(0, query.length-1);

  return parsedUrl.protocol + "//"+ parsedUrl.host + parsedUrl.pathname + "?" + query;
};

exports.OAuth.prototype.authHeader= function(url, oauth_token, oauth_token_secret, method) {
  if( method === undefined ) {
    var method= "GET";
  }

  var orderedParameters= this._prepareParameters(oauth_token, oauth_token_secret, method, url, {});
  return this._buildAuthorizationHeaders(orderedParameters);
};


/***/ }),

/***/ "./node_modules/oauth/lib/oauth2.js":
/*!******************************************!*\
  !*** ./node_modules/oauth/lib/oauth2.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var querystring= __webpack_require__(/*! querystring */ "querystring"),
    crypto= __webpack_require__(/*! crypto */ "crypto"),
    https= __webpack_require__(/*! https */ "https"),
    http= __webpack_require__(/*! http */ "http"),
    URL= __webpack_require__(/*! url */ "url"),
    OAuthUtils= __webpack_require__(/*! ./_utils */ "./node_modules/oauth/lib/_utils.js");

exports.OAuth2= function(clientId, clientSecret, baseSite, authorizePath, accessTokenPath, customHeaders) {
  this._clientId= clientId;
  this._clientSecret= clientSecret;
  this._baseSite= baseSite;
  this._authorizeUrl= authorizePath || "/oauth/authorize";
  this._accessTokenUrl= accessTokenPath || "/oauth/access_token";
  this._accessTokenName= "access_token";
  this._authMethod= "Bearer";
  this._customHeaders = customHeaders || {};
  this._useAuthorizationHeaderForGET= false;

  //our agent
  this._agent = undefined;
};

// Allows you to set an agent to use instead of the default HTTP or
// HTTPS agents. Useful when dealing with your own certificates.
exports.OAuth2.prototype.setAgent = function(agent) {
  this._agent = agent;
};

// This 'hack' method is required for sites that don't use
// 'access_token' as the name of the access token (for requests).
// ( http://tools.ietf.org/html/draft-ietf-oauth-v2-16#section-7 )
// it isn't clear what the correct value should be atm, so allowing
// for specific (temporary?) override for now.
exports.OAuth2.prototype.setAccessTokenName= function ( name ) {
  this._accessTokenName= name;
}

// Sets the authorization method for Authorization header.
// e.g. Authorization: Bearer <token>  # "Bearer" is the authorization method.
exports.OAuth2.prototype.setAuthMethod = function ( authMethod ) {
  this._authMethod = authMethod;
};


// If you use the OAuth2 exposed 'get' method (and don't construct your own _request call )
// this will specify whether to use an 'Authorize' header instead of passing the access_token as a query parameter
exports.OAuth2.prototype.useAuthorizationHeaderforGET = function(useIt) {
  this._useAuthorizationHeaderForGET= useIt;
}

exports.OAuth2.prototype._getAccessTokenUrl= function() {
  return this._baseSite + this._accessTokenUrl; /* + "?" + querystring.stringify(params); */
}

// Build the authorization header. In particular, build the part after the colon.
// e.g. Authorization: Bearer <token>  # Build "Bearer <token>"
exports.OAuth2.prototype.buildAuthHeader= function(token) {
  return this._authMethod + ' ' + token;
};

exports.OAuth2.prototype._chooseHttpLibrary= function( parsedUrl ) {
  var http_library= https;
  // As this is OAUth2, we *assume* https unless told explicitly otherwise.
  if( parsedUrl.protocol != "https:" ) {
    http_library= http;
  }
  return http_library;
};

exports.OAuth2.prototype._request= function(method, url, headers, post_body, access_token, callback) {

  var parsedUrl= URL.parse( url, true );
  if( parsedUrl.protocol == "https:" && !parsedUrl.port ) {
    parsedUrl.port= 443;
  }

  var http_library= this._chooseHttpLibrary( parsedUrl );


  var realHeaders= {};
  for( var key in this._customHeaders ) {
    realHeaders[key]= this._customHeaders[key];
  }
  if( headers ) {
    for(var key in headers) {
      realHeaders[key] = headers[key];
    }
  }
  realHeaders['Host']= parsedUrl.host;

  if (!realHeaders['User-Agent']) {
    realHeaders['User-Agent'] = 'Node-oauth';
  }

  if( post_body ) {
      if ( Buffer.isBuffer(post_body) ) {
          realHeaders["Content-Length"]= post_body.length;
      } else {
          realHeaders["Content-Length"]= Buffer.byteLength(post_body);
      }
  } else {
      realHeaders["Content-length"]= 0;
  }

  if( access_token && !('Authorization' in realHeaders)) {
    if( ! parsedUrl.query ) parsedUrl.query= {};
    parsedUrl.query[this._accessTokenName]= access_token;
  }

  var queryStr= querystring.stringify(parsedUrl.query);
  if( queryStr ) queryStr=  "?" + queryStr;
  var options = {
    host:parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname + queryStr,
    method: method,
    headers: realHeaders
  };

  this._executeRequest( http_library, options, post_body, callback );
}

exports.OAuth2.prototype._executeRequest= function( http_library, options, post_body, callback ) {
  // Some hosts *cough* google appear to close the connection early / send no content-length header
  // allow this behaviour.
  var allowEarlyClose= OAuthUtils.isAnEarlyCloseHost(options.host);
  var callbackCalled= false;
  function passBackControl( response, result ) {
    if(!callbackCalled) {
      callbackCalled=true;
      if( !(response.statusCode >= 200 && response.statusCode <= 299) && (response.statusCode != 301) && (response.statusCode != 302) ) {
        callback({ statusCode: response.statusCode, data: result });
      } else {
        callback(null, result, response);
      }
    }
  }

  var result= "";

  //set the agent on the request options
  if (this._agent) {
    options.agent = this._agent;
  }

  var request = http_library.request(options);
  request.on('response', function (response) {
    response.on("data", function (chunk) {
      result+= chunk
    });
    response.on("close", function (err) {
      if( allowEarlyClose ) {
        passBackControl( response, result );
      }
    });
    response.addListener("end", function () {
      passBackControl( response, result );
    });
  });
  request.on('error', function(e) {
    callbackCalled= true;
    callback(e);
  });

  if( (options.method == 'POST' || options.method == 'PUT') && post_body ) {
     request.write(post_body);
  }
  request.end();
}

exports.OAuth2.prototype.getAuthorizeUrl= function( params ) {
  var params= params || {};
  params['client_id'] = this._clientId;
  return this._baseSite + this._authorizeUrl + "?" + querystring.stringify(params);
}

exports.OAuth2.prototype.getOAuthAccessToken= function(code, params, callback) {
  var params= params || {};
  params['client_id'] = this._clientId;
  params['client_secret'] = this._clientSecret;
  var codeParam = (params.grant_type === 'refresh_token') ? 'refresh_token' : 'code';
  params[codeParam]= code;

  var post_data= querystring.stringify( params );
  var post_headers= {
       'Content-Type': 'application/x-www-form-urlencoded'
   };


  this._request("POST", this._getAccessTokenUrl(), post_headers, post_data, null, function(error, data, response) {
    if( error )  callback(error);
    else {
      var results;
      try {
        // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07
        // responses should be in JSON
        results= JSON.parse( data );
      }
      catch(e) {
        // .... However both Facebook + Github currently use rev05 of the spec
        // and neither seem to specify a content-type correctly in their response headers :(
        // clients of these services will suffer a *minor* performance cost of the exception
        // being thrown
        results= querystring.parse( data );
      }
      var access_token= results["access_token"];
      var refresh_token= results["refresh_token"];
      delete results["refresh_token"];
      callback(null, access_token, refresh_token, results); // callback results =-=
    }
  });
}

// Deprecated
exports.OAuth2.prototype.getProtectedResource= function(url, access_token, callback) {
  this._request("GET", url, {}, "", access_token, callback );
}

exports.OAuth2.prototype.get= function(url, access_token, callback) {
  if( this._useAuthorizationHeaderForGET ) {
    var headers= {'Authorization': this.buildAuthHeader(access_token) }
    access_token= null;
  }
  else {
    headers= {};
  }
  this._request("GET", url, headers, "", access_token, callback );
}


/***/ }),

/***/ "./node_modules/oauth/lib/sha1.js":
/*!****************************************!*\
  !*** ./node_modules/oauth/lib/sha1.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 1;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = "="; /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s)    { return rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
function b64_sha1(s)    { return rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
function any_sha1(s, e) { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
function hex_hmac_sha1(k, d)
  { return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_sha1(k, d)
  { return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_sha1(k, d, e)
  { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA1 of a raw string
 */
function rstr_sha1(s)
{
  return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}

/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */
function rstr_hmac_sha1(key, data)
{
  var bkey = rstr2binb(key);
  if(bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
  return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var remainders = Array();
  var i, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. We stop when the dividend is zero.
   * All remainders are stored for later use.
   */
  while(dividend.length > 0)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[remainders.length] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  /* Append leading zero equivalents */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)))
  for(i = output.length; i < full_length; i++)
    output = encoding[0] + output;

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
  return output;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = bit_rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

exports.HMACSHA1= function(key, data) {
  return b64_hmac_sha1(key, data);
}

/***/ }),

/***/ "./src/main/createCaptureWindow.js":
/*!*****************************************!*\
  !*** ./src/main/createCaptureWindow.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _electron = __webpack_require__(/*! electron */ "electron");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CaptureWindow = function () {
  function CaptureWindow() {
    _classCallCheck(this, CaptureWindow);

    this.win = new _electron.BrowserWindow({ show: false });
    this.win.loadURL("file://" + __dirname + "/../../captureWindow.html");
  }

  _createClass(CaptureWindow, [{
    key: "capture",
    value: function capture(clippingProfile) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _electron.ipcMain.once("REPLY_CAPTURE", function (_, _ref) {
          var error = _ref.error,
              dataURL = _ref.dataURL;

          if (error) {
            reject(error);
          } else {
            resolve(_electron.nativeImage.createFromDataURL(dataURL));
          }
        });
        _this.win.webContents.send("CAPTURE", clippingProfile);
      });
    }
  }, {
    key: "close",
    value: function close() {
      this.win.close();
    }
  }]);

  return CaptureWindow;
}();

function createCaptureWindow() {
  return new CaptureWindow();
}

exports.default = createCaptureWindow;

/***/ }),

/***/ "./src/main/createFileManager.js":
/*!***************************************!*\
  !*** ./src/main/createFileManager.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = __webpack_require__(/*! path */ "path");

var _path2 = _interopRequireDefault(_path);

var _fs = __webpack_require__(/*! fs */ "fs");

var _fs2 = _interopRequireDefault(_fs);

var _crypto = __webpack_require__(/*! crypto */ "crypto");

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getHash(buffer) {
  var shasum = _crypto2.default.createHash("sha1");
  shasum.update(buffer);
  return shasum.digest("hex");
}

var FileManager = function () {
  function FileManager() {
    _classCallCheck(this, FileManager);
  }

  _createClass(FileManager, [{
    key: "writeImage",
    value: function writeImage(dir, image) {
      return new Promise(function (resolve, reject) {
        var buffer = image.toPNG();
        var filename = _path2.default.join(dir, getHash(buffer) + ".png");
        _fs2.default.writeFile(filename, buffer, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(filename);
          }
        });
      });
    }
  }, {
    key: "readAsBase64string",
    value: function readAsBase64string(filename) {
      return new Promise(function (resolve, reject) {
        _fs2.default.readFile(filename, { encoding: "base64" }, function (error, data) {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    }
  }]);

  return FileManager;
}();

function createFileManager() {
  return new FileManager();
}

exports.default = createFileManager;

/***/ }),

/***/ "./src/main/createPreviewWindow.js":
/*!*****************************************!*\
  !*** ./src/main/createPreviewWindow.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _electron = __webpack_require__(/*! electron */ "electron");

var _events = __webpack_require__(/*! events */ "events");

var _createFileManager = __webpack_require__(/*! ./createFileManager */ "./src/main/createFileManager.js");

var _createFileManager2 = _interopRequireDefault(_createFileManager);

var _createTwitterLoginManager = __webpack_require__(/*! ./createTwitterLoginManager */ "./src/main/createTwitterLoginManager.js");

var _createTwitterLoginManager2 = _interopRequireDefault(_createTwitterLoginManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PreviewWindow = function (_EventEmitter) {
  _inherits(PreviewWindow, _EventEmitter);

  function PreviewWindow(_ref) {
    var filename = _ref.filename;

    _classCallCheck(this, PreviewWindow);

    var _this = _possibleConstructorReturn(this, (PreviewWindow.__proto__ || Object.getPrototypeOf(PreviewWindow)).call(this));

    _this.win = new _electron.BrowserWindow({
      width: 500,
      height: 430
    });
    _this.fileManager = (0, _createFileManager2.default)();
    _this.filename = filename;
    _this.win.loadURL("file://" + __dirname + "/../../previewWindow.html?filename=" + filename);
    var handler = _this.handlePostTweet.bind(_this);
    _electron.ipcMain.on("POST_TWEET", handler);
    _this.win.on("close", function () {
      _electron.ipcMain.removeListener("POST_TWEET", handler);
    });
    return _this;
  }

  _createClass(PreviewWindow, [{
    key: "handlePostTweet",
    value: function handlePostTweet(e, args) {
      var _this2 = this;

      this.postTweet(args).then(function (url) {
        e.sender.send("REPLY_POST_TWEET", { url: url });
        _this2.emit("DONE_TWEET", { url: url });
      }).catch(function (error) {
        e.sender.send("REPLY_POST_TWEET", { error: error });
      });
    }
  }, {
    key: "postTweet",
    value: function postTweet(_ref2) {
      var _this3 = this;

      var message = _ref2.message;

      var loginManager = (0, _createTwitterLoginManager2.default)();
      return loginManager.init().then(function () {
        var client = loginManager.createClient();
        return _this3.fileManager.readAsBase64string(_this3.filename).then(function (data) {
          return client.uploadMedia({ media: data });
        }).then(function (media) {
          return client.updateStatuses({
            status: message,
            media_ids: media.media_id_string
          });
        }).then(function (status) {
          return "https://twitter.com/" + status.user.name + "/statuses/" + status.id_str;
        });
      });
    }
  }, {
    key: "close",
    value: function close() {
      this.win.close();
    }
  }]);

  return PreviewWindow;
}(_events.EventEmitter);

function createPreviewWindow(_ref3) {
  var filename = _ref3.filename;

  return new PreviewWindow({ filename: filename });
}

exports.default = createPreviewWindow;

/***/ }),

/***/ "./src/main/createTwitterClient.js":
/*!*****************************************!*\
  !*** ./src/main/createTwitterClient.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TwitterClient = function () {
  function TwitterClient(oauth, oauthAccessToken, oauthAccessSecret) {
    _classCallCheck(this, TwitterClient);

    this.oauth = oauth;
    this.oauthAccessToken = oauthAccessToken;
    this.oauthAccessSecret = oauthAccessSecret;
  }

  _createClass(TwitterClient, [{
    key: "verifyCredentials",
    value: function verifyCredentials() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.oauth.get("https://api.twitter.com/1.1/account/verify_credentials.json", _this.oauthAccessToken, _this.oauthAccessSecret, function (error, data) {
          if (error) {
            return reject(error);
          } else {
            return resolve(JSON.parse(data));
          }
        });
      });
    }
  }, {
    key: "uploadMedia",
    value: function uploadMedia(params) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.oauth.post("https://upload.twitter.com/1.1/media/upload.json", _this2.oauthAccessToken, _this2.oauthAccessSecret, params, "application/x-www-form-urlencoded", function (error, data) {
          if (error) {
            return reject(error);
          } else {
            return resolve(JSON.parse(data));
          }
        });
      });
    }
  }, {
    key: "updateStatuses",
    value: function updateStatuses(params) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.oauth.post("https://api.twitter.com/1.1/statuses/update.json", _this3.oauthAccessToken, _this3.oauthAccessSecret, params, "application/x-www-form-urlencoded", function (error, data) {
          if (error) {
            return reject(error);
          } else {
            return resolve(JSON.parse(data));
          }
        });
      });
    }
  }]);

  return TwitterClient;
}();

function createTwitterClient(oauth, oauthAccessToken, oauthAccessSecret) {
  return new TwitterClient(oauth, oauthAccessToken, oauthAccessSecret);
}

exports.default = createTwitterClient;

/***/ }),

/***/ "./src/main/createTwitterLoginManager.js":
/*!***********************************************!*\
  !*** ./src/main/createTwitterLoginManager.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = __webpack_require__(/*! path */ "path");

var _path2 = _interopRequireDefault(_path);

var _fs = __webpack_require__(/*! fs */ "fs");

var _fs2 = _interopRequireDefault(_fs);

var _electron = __webpack_require__(/*! electron */ "electron");

var _createTwitterOAuth = __webpack_require__(/*! ./createTwitterOAuth */ "./src/main/createTwitterOAuth.js");

var _createTwitterOAuth2 = _interopRequireDefault(_createTwitterOAuth);

var _createTwitterClient = __webpack_require__(/*! ./createTwitterClient */ "./src/main/createTwitterClient.js");

var _createTwitterClient2 = _interopRequireDefault(_createTwitterClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TwitterLoginManager = function () {
  function TwitterLoginManager() {
    _classCallCheck(this, TwitterLoginManager);

    this.oauth = (0, _createTwitterOAuth2.default)();
    this.credentialPath = _path2.default.join(_electron.app.getPath("userData"), ".twitter_credentials");
  }

  _createClass(TwitterLoginManager, [{
    key: "getAccessToken",
    value: function getAccessToken() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.oauth.getOAuthRequestToken(function (error, requestToken, requestTokenSecret) {
          if (error) {
            return reject(error);
          }
          _electron.shell.openExternal("https://api.twitter.com/oauth/authorize?oauth_token=" + requestToken);

          var pincodeWindow = new _electron.BrowserWindow({
            width: 400,
            height: 120,
            maximizable: false,
            minimizable: false,
            resizable: false
          });
          _electron.ipcMain.once("SEND_PIN", function (e, _ref) {
            var pincode = _ref.pincode;

            _this.oauth.getOAuthAccessToken(requestToken, requestTokenSecret, pincode, function (error, accessToken, accessTokenSecret) {
              if (error) {
                return reject(error);
              }
              resolve({ accessToken: accessToken, accessTokenSecret: accessTokenSecret });
              pincodeWindow.removeAllListeners("close");
              pincodeWindow.close();
            });
          });
          _electron.ipcMain.once("CANCEL_PIN", function () {
            return pincodeWindow.close();
          });
          pincodeWindow.on("close", function () {
            return reject("user_cancel");
          });
          pincodeWindow.loadURL("file://" + __dirname + "/../../pincodeWindow.html");
        });
      });
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      var loginAndVerify = function loginAndVerify() {
        return _this2.getAccessToken().then(function (credentials) {
          _this2.saveCredentials(credentials);
          return _this2.verify();
        });
      };
      var credentials = this.loadCredentials();
      if (!credentials) {
        return loginAndVerify();
      } else {
        return this.verify().catch(function () {
          return loginAndVerify();
        });
      }
    }
  }, {
    key: "loadCredentials",
    value: function loadCredentials() {
      try {
        this.credentials = JSON.parse(_fs2.default.readFileSync(this.credentialPath, "utf-8"));
        return this.credentials;
      } catch (e) {
        this.credentials = null;
        return null;
      }
    }
  }, {
    key: "saveCredentials",
    value: function saveCredentials(credentials) {
      this.credentials = credentials;
      _fs2.default.writeFileSync(this.credentialPath, JSON.stringify(this.credentials), "utf-8");
    }
  }, {
    key: "createClient",
    value: function createClient() {
      return (0, _createTwitterClient2.default)(this.oauth, this.credentials.accessToken, this.credentials.accessTokenSecret);
    }
  }, {
    key: "verify",
    value: function verify() {
      return this.createClient().verifyCredentials();
    }
  }]);

  return TwitterLoginManager;
}();

function createTwitterLoginManager() {
  return new TwitterLoginManager();
}

exports.default = createTwitterLoginManager;

/***/ }),

/***/ "./src/main/createTwitterOAuth.js":
/*!****************************************!*\
  !*** ./src/main/createTwitterOAuth.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _oauth = __webpack_require__(/*! oauth */ "./node_modules/oauth/index.js");

function createTwitterOAuth() {
  return new _oauth.OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", "5jVDtFcADABDhYss5htnatBaJ", "x7neGkZTPmPp4uhietcv3eEOunMFYyn9koiV5NRxjFU3un9xfa", "1.0A", null, "HMAC-SHA1");
}

exports.default = createTwitterOAuth;

/***/ }),

/***/ "./src/main/index.js":
/*!***************************!*\
  !*** ./src/main/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _electron = __webpack_require__(/*! electron */ "electron");

var _createFileManager = __webpack_require__(/*! ./createFileManager */ "./src/main/createFileManager.js");

var _createFileManager2 = _interopRequireDefault(_createFileManager);

var _trimDesktop = __webpack_require__(/*! ./trimDesktop */ "./src/main/trimDesktop.js");

var _trimDesktop2 = _interopRequireDefault(_trimDesktop);

var _createCaptureWindow = __webpack_require__(/*! ./createCaptureWindow */ "./src/main/createCaptureWindow.js");

var _createCaptureWindow2 = _interopRequireDefault(_createCaptureWindow);

var _createPreviewWindow = __webpack_require__(/*! ./createPreviewWindow */ "./src/main/createPreviewWindow.js");

var _createPreviewWindow2 = _interopRequireDefault(_createPreviewWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var captureWindow = void 0;

function captureAndOpenItem() {
  var fileManager = (0, _createFileManager2.default)();
  return (0, _trimDesktop2.default)().then(captureWindow.capture.bind(captureWindow)).then(function (image) {
    var createdFilename = fileManager.writeImage(_electron.app.getPath("temp"), image);
    return createdFilename;
  }).then(_electron.shell.openItem.bind(_electron.shell)).then(function () {
    if (process.platform !== "darwin") {
      _electron.app.quit();
    }
  });
}

function captureAndPost() {
  var fileManager = (0, _createFileManager2.default)();
  return (0, _trimDesktop2.default)().then(captureWindow.capture.bind(captureWindow)).then(function (image) {
    var createdFilename = fileManager.writeImage(_electron.app.getPath("temp"), image);
    return createdFilename;
  }).then(function (filename) {
    console.log(filename);
    var win = (0, _createPreviewWindow2.default)({ filename: filename });
    win.once("DONE_TWEET", function (_ref) {
      var url = _ref.url;

      _electron.shell.openExternal(url);
      win.close();
      if (process.platform !== "darwin") {
        _electron.app.quit();
      }
    });
  });
}

_electron.app.on("ready", function () {
  captureWindow = (0, _createCaptureWindow2.default)();
  // captureAndOpenItem();
  captureAndPost();
});

/***/ }),

/***/ "./src/main/trimDesktop.js":
/*!*********************************!*\
  !*** ./src/main/trimDesktop.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _electron = __webpack_require__(/*! electron */ "electron");

function trimDesktop() {
  var displays = _electron.screen.getAllDisplays();
  return new Promise(function (resolve, reject) {
    var windows = displays.map(function (display, i) {
      var _display$bounds = display.bounds,
          x = _display$bounds.x,
          y = _display$bounds.y,
          width = _display$bounds.width,
          height = _display$bounds.height;

      display.name = "Screen " + (i + 1);
      var win = new _electron.BrowserWindow({
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        x: x,
        y: y,
        width: width,
        height: height
      });
      win.loadURL("file://" + __dirname + "/../../index.html");
      return { win: win, display: display };
    });

    _electron.ipcMain.once("SEND_BOUNDS", function (e, _ref) {
      var trimmedBounds = _ref.trimmedBounds;

      var sourceDisplay = windows.find(function (w) {
        return w.win.webContents.id === e.sender.id;
      }).display;
      var profile = { sourceDisplay: sourceDisplay, trimmedBounds: trimmedBounds };
      windows.forEach(function (w) {
        return w.win.close();
      });
      resolve(profile);
    });
  });
}

exports.default = trimDesktop;

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map