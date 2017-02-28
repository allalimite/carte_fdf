if (typeof(mds) === "undefined") {
    var mds = {};
}
mds.auth = {
    
    scope: 'https://www.googleapis.com/auth/fusiontables',
    
    loginInfo: {
        
        user: undefined,
        apiKey: undefined,
        token: undefined,
        expiration: undefined

    },
         
    /**
     * 
     * @param {type} connected
     * @returns {undefined}
     */
    onAccountCheck: function(connected) {
        
    },
    onAuthorize: function(authResult) {
        
    },
    onError: function(error) {

    },

    /**
     * 
     * @param {type} selector
     * @param {type} callback
     * @returns {undefined}
     */
    checkAccount: function(selector, callback) {
        /*var imgChecker = $('<img/>')
            .attr('src', 'https://accounts.google.com/CheckCookie?continue=https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fimages%2Flogos%2Faccounts_logo.png')
            .load(function() {
                if (callback) {
                    callback(true);
                }
                if (mds.auth.onAccountCheck) {
                    mds.auth.onAccountCheck(true);
                }
            }).error(function(event) {
                if (callback) {
                    callback(false);
                }
                if (mds.auth.onAccountCheck) {
                    mds.auth.onAccountCheck(false);
                }
            });
        selector.append(imgChecker);
        */
        callback(true);
    },
    
    authorize: function(apiKey, clientId, scope, callBack) {
        mds.auth.loginInfo.apiKey = apiKey;
        gapi.client.setApiKey(apiKey);
        gapi.auth.authorize({
                client_id: clientId,
                scope: scope,
                immediate: false
            },
            function(authResult) {
                if(authResult && authResult.access_token) {
                    mds.auth.loginInfo.user = authResult.client_id;
                    mds.auth.loginInfo.token = authResult.access_token;
                    mds.auth.validateToken(mds.auth.loginInfo.token, callBack);
                } else {
                    gapi.auth.authorize({
                            client_id: clientId,
                            scope: scope,
                            immediate: false
                        },
                        function(authResult) {
                            if(authResult && authResult.access_token) {
                                mds.auth.loginInfo.user = authResult.client_id;
                                mds.auth.loginInfo.token = authResult.access_token;
                                mds.auth.validateToken(mds.auth.loginInfo.token, callBack);
                            } else {
                                mds.auth.onError('Authentification oAuth Impossible');
                            }
                        }
                    );
                }
            }
        );
    },
    
    validateToken: function(acces_token, callback) {
        $.ajax({
            url: 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+acces_token,
            type: 'GET',
            crossDomain: true,
            dataType: 'json',
            error: function(jqXHR, textStatus, errorThrown){
                if(mds.auth.onError) {
                    mds.auth.onError(textStatus);
                }
            },
            success: function(result, textStatus, jqXHR){
                if(result && result.expires_in) {
                    mds.auth.loginInfo.expiration = result.expires_in;
                }
                if(callback) {        
                    callback(mds.auth.loginInfo);
                }
                if(mds.auth.onAuthorize) {
                    mds.auth.onAuthorize(mds.auth.loginInfo);
                }
            }
        });
    }
};
