var IMGUR_CLIENT_ID    = process.env.IMGUR_CLIENT_ID || 'f0ea04148a54268';
var IMGUR_API_URL      = process.env.IMGUR_API_URL || 'https://api.imgur.com/3/';
var IMGUR_USERNAME     = null;
var IMGUR_PASSWORD     = null;
var IMGUR_ACCESS_TOKEN = null;
var IMGUR_MASHAPE_KEY  = process.env.IMGUR_MASHAPE_KEY;

imgur._imgurRequest = function (operation, payload, extraFormParams) {
    var deferred = Q.defer();
    var form     = null;
    var options  = {
        uri:      IMGUR_API_URL,
        method:   null,
        encoding: 'utf8',
        json:     true
    };

    if (!operation || typeof operation !== 'string' || ( !payload && operation !== ('credits' && 'search') ) ) {
        deferred.reject(new Error('Invalid argument'));
        return deferred.promise;
    }

    switch(operation) {
        case 'upload':
            options.method = 'POST';
            options.uri += 'image';
            break;
    }

    imgur._getAuthorizationHeader()
        .then(function (authorizationHeader) {
            if(IMGUR_MASHAPE_KEY) {
                options.headers = {
                    Authorization: authorizationHeader,
                    'X-Mashape-Key': IMGUR_MASHAPE_KEY
                };
            } else {
                options.headers = {
                    Authorization: authorizationHeader
                };
            }

            var r = request(options, function (err, res, body) {
                if (err) {
                    deferred.reject(err);
                } else if (body && !body.success) {
                    deferred.reject({status: body.status, message: body.data ? body.data.error : 'No body data response'});
                } else {
                    deferred.resolve(body);
                }
            });

            if (operation === 'upload') {
                form = r.form();
                form.append('image', payload);

                if (typeof extraFormParams === 'object') {
                    for (var param in extraFormParams) {
                        form.append(param, extraFormParams[param]);
                    }
                }
            }
        })
        .catch(function (err) {
            deferred.reject(err);
        });

    return deferred.promise;
}

imgur._getAuthorizationHeader = function () {
    var deferred = Q.defer();

    if (IMGUR_ACCESS_TOKEN) {
        deferred.resolve('Bearer ' + IMGUR_ACCESS_TOKEN);
    } else if (IMGUR_USERNAME && IMGUR_PASSWORD) {
        var options = {
            uri:      'https://api.imgur.com/oauth2/authorize',
            method:   'GET',
            encoding: 'utf8',
            qs: {
                client_id: IMGUR_CLIENT_ID,
                response_type: 'token'
            }
        };
        imgur._request(options).then(function (res) {
            var authorize_token = res.headers['set-cookie'][0].match('(^|;)[\s]*authorize_token=([^;]*)')[2];
            options.method = 'POST';
            options.json = true;
            options.form = {
                username: IMGUR_USERNAME,
                password: IMGUR_PASSWORD,
                allow: authorize_token
            };
            options.headers = {
                Cookie: 'authorize_token=' + authorize_token
            };
            imgur._request(options).then(function (res) {
                var location = res.headers.location;
                var token = JSON.parse('{"' + decodeURI(location.slice(location.indexOf('#') + 1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
                IMGUR_ACCESS_TOKEN = token.access_token;
                deferred.resolve('Bearer ' + IMGUR_ACCESS_TOKEN);
            }).catch(function (err) {
                deferred.reject(err);
            });
        }).catch(function (err) {
            deferred.reject(err);
        });
    } else {
        deferred.resolve('Client-ID ' + IMGUR_CLIENT_ID);
    }

    return deferred.promise;
}

imgur.uploadBase64 = function (base64, albumId, title, description) {
    var
        deferred = Q.defer(),
        extraFormParams = {};

    if (typeof albumId === 'string' && albumId.length) {
        extraFormParams.album = albumId;
    }

    if (typeof title === 'string' && title.length) {
        extraFormParams.title = title;
    }

    if (typeof description === 'string' && description.length) {
        extraFormParams.description = description;
    }

    if (typeof base64 !== 'string' || !base64 || !base64.length) {
        deferred.reject(new Error('Invalid Base64 input'));
        return deferred.promise;
    }

    imgur._imgurRequest('upload', base64, extraFormParams)
        .then(function (image) {
            deferred.resolve(image);
        })
        .catch(function (err) {
            deferred.reject(err);
        });

    return deferred.promise;
}