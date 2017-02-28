if(typeof( mds ) === "undefined") {
    var mds = {};
}
mds.query = {
    
    
    domain: 'https://www.googleapis.com/fusiontables/v1/',
    
    loginInfo: undefined,
    
    fusionTableGET: function(sql, dataHandler, errorHandler) {
        if(!this.loginInfo) {
            errorHandler('no credentials');
        }
        var encodedQuery = encodeURIComponent(sql);
        var url = [this.domain];
        url.push('query?');
        url.push('sql=' + encodedQuery);
        if(this.loginInfo.apiKey) {
            url.push('&key='+this.loginInfo.apiKey);
        }
        if(this.loginInfo.token) {
            url.push('&access_token='+this.loginInfo.token);
        }
        return $.ajax({
            url: url.join(''),
            type: 'GET',
            crossDomain: true,
            dataType: 'json',
            error: function(jqXHR, textStatus, errorThrown){
                if(errorHandler) {
                    errorHandler(textStatus, errorThrown);
                }
            },
            success: function(result, textStatus, jqXHR){
                if(dataHandler) {
                    dataHandler(result);
                }
            }
        });
    },
    
    
    fusionTablePOST: function(sql, dataHandler, errorHandler) {
        if(!this.loginInfo) {
            errorHandler('no credentials');
        }
        var url = [this.domain];
        url.push('query?');
        if(this.loginInfo.apiKey) {
            url.push('key='+this.loginInfo.apiKey);
        }
        if(this.loginInfo.token) {
            url.push('&access_token='+this.loginInfo.token);
        }
        return $.ajax({
            url: url.join(''),
            type: 'POST',
            data: 'sql='+encodeURI(sql),
            crossDomain: true,
            dataType: 'json',
            error: function(jqXHR, textStatus, errorThrown){
                if(errorHandler) {
                    errorHandler(textStatus, errorThrown);
                }
            },
            success: function(result, textStatus, jqXHR){
                if(dataHandler) {
                    dataHandler(result);
                }
            }
        });
    },
            
    getTablesInfo: function(dataHandler, errorHandler) {
        if(!this.loginInfo) {
            errorHandler('no credentials');
        }
        var url = [this.domain];
        url.push('tables?');
        url.push('key='+this.loginInfo.apiKey);
        url.push('&access_token='+this.loginInfo.token);
        $.ajax({
            url: url.join(''),
            type: 'GET',
            crossDomain: true,
            dataType: 'json',
            error: function(jqXHR, textStatus, errorThrown){
                if(errorHandler) {
                    errorHandler(textStatus, errorThrown);
                }
            },
            success: function(result, textStatus, jqXHR){
                if(dataHandler) {
                    dataHandler(result);
                }
            }
        });
    },
    
    getColumnList: function(columns, rowid) {
        var res = rowid? 'ROWID,': '';
        for (i=0; i<columns.length; i++) {
            res += "'" + columns[i] + "'";
            if(i === columns.length - 1) {
                res += ' ';
            } else {
                res += ',';
            }
        }
        return res;
    },
    
    getFullQuery: function(table) {
        var lng = mds.datasource.currentLng;
        return query = 'SELECT ' 
        + mds.datasource.getColList(table.columns, true)
        + 'FROM '
        + table.id[lng];
    },
    
    tableResToObject: function(res) {
        var obj = {
            valid: res.error === undefined,
            size: res.rows? res.rows.length: 0,
            data: []
        };
        if(obj.valid && obj.size > 0) {
            for (i=0; i<res.rows.length; i++) {
                var entry = {};
                for(j=0; j<res.rows[i].length; j++) {
                    entry[res.columns[j]] = res.rows[i][j];
                }
                obj.data.push(entry);
            }
        }
        return obj;
    },
    /**
     * Vérifie le résultat d'une requette insert
     * @param {type} ftresult
     * @param {type} nb
     * @returns {Boolean}
     */
    checkInsert: function(ftresult, nb) {
        
        if(!ftresult.columns || ftresult.columns[0] !== 'rowid') {
            return false;
        }
        var done = false;
        if(ftresult.rows && ftresult.rows.length === nb) { 
            var rowId = -1;
            for(i=0; i<ftresult.rows.length; i++) {
                rowId = parseInt(ftresult.rows[i][0]);
                done = rowId >= 0;
                if(!done) {
                    break;
                }
            }
            
        }
        return done;
    },
    checkDelete: function(ftresult, nb) {
        if(!ftresult.columns || ftresult.columns[0] !== 'affected_rows') {
            return false;
        }
        var done = false;
        if(ftresult.rows 
                && ftresult.rows.length === 1 
                && ftresult.rows[0].length === 1) { 
            var rowId = parseInt(ftresult.rows[0][0]);
            done = rowId === nb;
        }
        return done;
    },
    checkUpdate: function(ftresult, nb) {
        if(!ftresult.columns || ftresult.columns[0] !== 'affected_rows') {
            return false;
        }
        var done = false;
        if(ftresult.rows 
                && ftresult.rows.length === 1 
                && ftresult.rows[0].length === 1) { 
            var rowId = parseInt(ftresult.rows[0][0]);
            done = rowId === nb;
        }
        return done;
    },
    checkSingleResult: function(sql, result) {
        if(sql.indexOf('INSERT') >= 0) {
            return this.checkInsert(result, 1);
        } else if(sql.indexOf('DELETE') >= 0) {
            return this.checkDelete(result, 1);
        } else if(sql.indexOf('UPDATE') >= 0) {
            return this.checkUpdate(result, 1);
        }
    }
};

