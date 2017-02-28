if(typeof( mds ) == "undefined") {
    var mds = {}
}
mds.logging = {
    
    logs: [],
    
    logText: function(text) {
        mds.logging.logs.push({
            date: new Date().toLocaleString(),
            text: text
        })
    },
    
    console: function(text) {
        if(console) {
            console.log(text)
        }
    }
}

