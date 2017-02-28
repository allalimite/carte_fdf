if(typeof( mds ) == "undefined") {
    var mds = {}
}

mds.utils = {
    correctImage: function() {
        var sql = "SELECT ROWID, DONNEE FROM 1608746"
            +" WHERE DTYPE='IMAGE'";
        mds.common.fusionTableQuery(
            sql, 
            function(rows) {
                for (i=0; i<rows.length; i++) {
                    var txt = rows[i][1];
                    var pos = txt.indexOf("<br");
                    if(pos > 0) {
                        txt = txt.substr(0, pos);
                    }
                    var img = $(txt);
                    if(img.attr('height') != undefined) {
                        img.removeAttr('height');
                    }
                }
            }, 
            function(status, ex) {
                
            }
        );
    }
    
}
