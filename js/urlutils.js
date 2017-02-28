if( typeof( mds ) === "undefined" ) mds = {};

mds.urlutils = {
    
    REJECT_LIST: [
        "www.fdesouche.com"
                
    ],
    
    getReferer: function() {
        return document.referrer;
    },
    
    allowReferer: function() {
        var referer = mds.urlutils.getReferer();
        for(i=0; i<mds.urlutils.REJECT_LIST.length; i++) {
            if(referer.indexOf(mds.urlutils.REJECT_LIST[i]) >= 0) {
                return false;
            }
        }
        return true;
    },
    
    checkReferer: function() {
        if(!mds.urlutils.allowReferer()) {
            window.location = "redirect.php?refer="+mds.urlutils.getReferer();
        }
    }
    
};

