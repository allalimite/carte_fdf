//importScripts('constant.js', 'table.js'); 

//self.addEventListener('message', function(e){
//    var rows = e.data;
//    var layer = handleArticleRows(rows);
//    self.postMessage(layer);
//}, false);


 function handleArticlesRows(rows) {
    if(typeof rows === "undefined") {
        return undefined;
    }
    var n = rows.length;
    var layer = new Object();
    for(var i = 0; i < n; i++) {
        var row = rows[i];
        var article = getArticle(row);
        article.display = true;
        if(! layer[article.geoInfo.id] ) {
            layer[article.geoInfo.id] = new Object();
            layer[article.geoInfo.id].articles = [];
            layer[article.geoInfo.id].markerOption = {
                lat: article.lat,
                lng: article.lng,
                labelClass: "marker_label"
            };
        }
        layer[article.geoInfo.id].articles.push(article);
        
    }
    for(id in layer) {
        cleanLayerObject(layer[id]);
    }
    return layer;
}
    
function getArticleText(article, fd_cat) {
    return '<div><p align="center" ><span '
        +' class="ui-widget ui-state-default ui-corner-all" style="font-size: 0.8em">'
        + article.date.getDate()+'/'+(article.date.getMonth()+1)+' '+ fd_cat.text
        +'</span></p></div>';
}
function getArticlesText(nbArticles) {
    return '<div><p align="center" ><span '
        +' class="ui-widget ui-state-default ui-corner-all">'
        + nbArticles+' articles</span></p></div>';
}
    
function getArticle(row) {

    var article = new Object();
    article.display = true;
    article.id = row[mds.table.ARTICLE_ID.index];
    article.etat = row[mds.table.ARTICLE_ETAT.index];
    article.titre = row[mds.table.ARTICLE_TITRE.index];
    article.auteur = row[mds.table.ARTICLE_AUTEUR.index];
    article.lien = row[mds.table.ARTICLE_LIEN.index];
    article.source_lien = row[mds.table.ARTICLE_SRC_LIEN.index];
    article.source_nom = row[mds.table.ARTICLE_SRC_NOM.index];
    article.fdcat = row[mds.table.ARTICLE_FD_CAT.index];
    article.classIndex = mds.constant.FD_CLASS[mds.constant.FD_CATEGORY[article.fdcat].classe].index;
    article.date = new Date(parseInt(row[mds.table.ARTICLE_DATE.index]));
    article.lat = row[mds.table.ARTICLE_LAT.index]; 
    article.lng = row[mds.table.ARTICLE_LNG.index]

    var france = false;
    var id = '';
    var tab;
    var val;
    var geoInfo = new Object();
    geoInfo.cat = row[mds.table.ARTICLE_GEO_CAT.index];
    //PAYS
    if(!isNull(row[mds.table.ARTICLE_PAYS.index])) {
        val = row[mds.table.ARTICLE_PAYS.index];
        france = val == 'FRANCE';
        if(france) {
            geoInfo.insee = [];
        } else {
            id += val;
        }
    }
    //REGION
    if(!isNull(row[mds.table.ARTICLE_REG.index])) {
        val = row[mds.table.ARTICLE_REG.index];
        if(france) {
            var regInsee = getInsee(val, 'REG');
            geoInfo.insee.push(regInsee);
        } else {
            id += ';' + val;
        }
    }
    //DEPARTEMENT
    if(!isNull(row[mds.table.ARTICLE_DEP.index])) {
        val = row[mds.table.ARTICLE_DEP.index];
        if(france) {
            var depInsee = getInsee(val, 'DEP');
            geoInfo.insee.push(depInsee);
        } else {
            id += ';' + val;
        }
        
    }
    //COMMUNE
    if(!isNull(row[mds.table.ARTICLE_COM.index])) {
        val = row[mds.table.ARTICLE_COM.index];
        if(france) {
            var comInsee = getInsee(val, 'COM');
            geoInfo.insee.push(comInsee);
        } else {
            id += ';' + val;
        }
    }
    val = row[mds.table.ARTICLE_GEO_INFO.index];
    geoInfo.detail = val;
    if(france) {
        id = val;
    } else {
        id += ';' + val;
    }
    if(france) {
        var temp = '';
        for(ins in geoInfo.insee) {
            temp += geoInfo.insee[ins].code;
        }
        id = temp+'|'+id;
    }
    geoInfo.id = id;
    geoInfo.france = france;
    article.geoInfo = geoInfo;
    return article;
}

function filterLayerObject(layerObject, filter) {
    layerObject.nbArticles = 0;
    var once = filter.fdclass == undefined;
    
    for(p=0; p < layerObject.articles.length; p++) {
        if(filter.fdclass != undefined && typeof filter.fdclass == "number") {
            var accept = layerObject.articles[p].classIndex == filter.fdclass;
            layerObject.articles[p].display = accept;
            if(accept) {
                layerObject.nbArticles ++;
                if(!once) {
                    once = true;
                }
            }
        } else {
            layerObject.articles[p].display = true;
            layerObject.nbArticles ++;
        }
    }
    layerObject.display = once;
}

function setLayerObjectIcon(layerObject) {
    if(layerObject.nbArticles > 1) {
        layerObject.markerOption.icon = '/icon/multimarker.png';
        layerObject.markerOption.labelContent = getArticlesText(layerObject.nbArticles);
    } else {
        var articles = layerObject.articles;
        var article = undefined;
        if(articles.length > 1) {
            for(ai=0; ai<articles.length; ai++) {
                if(articles[ai].display) {
                    article = articles[ai];
                }
            }
        } else {
            article = articles[0];
        }
        var fd_cat = mds.constant.FD_CATEGORY[article.fdcat];
        layerObject.markerOption.icon = '/'+ mds.constant.getIconCat(fd_cat);
        layerObject.markerOption.labelContent = getArticleText(article, fd_cat);
    }
}

function cleanLayerObject(layerObject) {
    var articles = layerObject.articles;
    if(articles.length > 1) {
        for(p = 1; p < articles.lenght; p++) {
            delete articles[p].geoInfo;
            delete articles[p].lat;
            delete articles[p].lng;
        }
    }
}

function getInsee(val, cat) {
    var tab = val.split(';');
    return {nom: tab[1], code: tab[0], cat: cat};
}

function isNull(data) {
    return !data || (''+data).length == 0 || (''+data).toLowerCase() == 'null';
}