if(typeof( mds ) === "undefined") {
    var mds = {};
}
mds.ds = {
    
    tables: {
        article_prod: 0,
        contenu_prod: 0,
        cog: 0,
        presse: 0
    },
    updateTableInfo: function(tableInfo) {
        $(tableInfo.items).each( function(i, table) {
            if(mds.ds.tables[table.name] === 0)  {
                mds.ds.tables[table.name] = table;
            }
        });
    }
    
};




