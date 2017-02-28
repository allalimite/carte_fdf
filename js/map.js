/**
 *
 */

if(typeof( mds ) === "undefined") {
    var mds = {};
}
mds.map = {
    
    DEBUG: false,
    
    INFO_BOX_MAIN : {id: 'infobox_id'},
    INFO_BOX_TAB : {id: 'infobox_tab_id'},
    INFO_BOX_LIST : {id: 'article_list_id', title: 'Liste des articles'},
    INFO_BOX_ARTICLE : {id: 'article_id', title: 'Article'},
    INFO_BOX_INSEE : {id: 'insee_id', title: 'Données INSEE'},
    INFO_BOX_ANNUAIRE : {id: 'annuaire_id', title: 'Annuaire'},
    
    MAP_CTRL_INFO: {id: 'article_preview_id', title: 'Pas de sélection'},
    MAP_CTRL_MENU: {id: 'menu', title: ''},
    
    MAP_DEBUG: 'debug_id',
    MAP_DEBUG_ZOOM: 'debug_zoom',
    MAP_DEBUG_CENTER: 'debug_center',
    MAP_DEBUG_BOUNDS: 'debug_bounds',
    MAP_DEBUG_STATUS: 'debug_status',
    MAP_DEBUG_ARTICLE: 'debug_article',
    
    INSEE: {
        POP: {id: 'insee_pop', title: 'Population'},
        EMP: {id: 'insee_emp', title: 'Emploi'},
        ECO: {id: 'insee_eco', title: 'Economie'},
        REV: {id: 'insee_rev', title: 'Revenu'},
        LOG: {id: 'insee_log', title: 'Logement'}
    },
    INSEE_ACCORDION: 'insee_accordion',
    INSEE_TITLE: {div: 'insee_title', title: ''},
    ANNUAIRE_CONTENT: 'annuaire_content',

    infoBoxOption: {
        content: '',
        disableAutoPan: false,
        maxWidth: 0,
        maxHeight: 460,
        pixelOffset: new google.maps.Size(-225, 15),
        boxStyle: {
            background: 'white',
            opacity: 1.0,
            width: "460px",
            maxWidth: "460px",
            maxHeight: "450px"
        },
        closeBoxMargin: "8px 8px 8px 8px",
        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
        infoBoxClearance: new google.maps.Size(290, 40),
        isHidden: false,
        pane: "floatPane",
        zIndex: null
    },
    mapCenter : new google.maps.LatLng(46.6, 2.5),
    mapDefaultZoom: 6,
    mapOptions: {
        zoom: 6,
        center: new google.maps.LatLng(46.6, 2.5),
        streetViewControl: false,
        panControl: false,
        scaleControl: false,
        zoomControl: true,
        mapTypeControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    
    geoLayer: undefined,
    markerClusterer: undefined,
    infoBox: undefined,
    gmap: undefined,
    currentArticles: undefined,
    videos: undefined,
    mapControls: undefined,
    articleTable: '14KaGvp7V8tEYv8j7Q8IVZShkp7fPa-j0pJ5fVXo',
    contentTable: '1bTaw_SIx0l4tQwEzN9WvmQGkOspSSL2qYI9f8pA',
    INSEETable: '1nBQOR94b8VJsqjNGZa3J0B6vB3O8QtAKGdzwgqs',
    annuaireDepTable: '1toN0SlNgPx3QO_v2x00yPvNnkaKDeEmUQEFpzOw',
    annuaireComTable: '1c0QNR_5aKuMLkegXbPWMT7ew8tDQL6ss9IPbca4',
    loadCallBack: undefined,
    
    layerFilter:  {
        fdclass: undefined,
        fdcat: {}
    },
       
    getInfoBoxContent: function() {
        
        var html = '<div id="' + mds.map.INFO_BOX_TAB.id+'">';
        html += '<div id="infobox_button_close" title="Fermer" class="ui-state-focus ui-corner-all">'
            +'<span class="ui-icon ui-icon-circle-close"></span></div>';
        html += '<ul>';
        var _tabs = [
            mds.map.INFO_BOX_ARTICLE,
            mds.map.INFO_BOX_INSEE,
            mds.map.INFO_BOX_ANNUAIRE
        ];
        if(mds.map.isMulti()) {
            _tabs.unshift(mds.map.INFO_BOX_LIST);
        }
        var divInfo;
        for(i = 0; i < _tabs.length; i++) {
            divInfo = _tabs[i];
            html += '<li>'
            + '<a href="#' + divInfo.id + '">' 
                    + divInfo.title + '</a>'
            + '</li>';
        }
        html += '</ul>';
        var n = _tabs.length;
        for(p = 0; p < n; p++) {
            divInfo = _tabs[p];
            html += '<div id="' + divInfo.id + '"">';
            if(divInfo === mds.map.INFO_BOX_INSEE) {
                html += '<strong>Statistiques</strong><select id="insee_select"></select>';
                html += '<div id="'+mds.map.INSEE_ACCORDION+'">';
                for( insee in mds.map.INSEE) {
                    html += '<h3><a href="#">' 
                        + mds.map.INSEE[insee].title
                        + '</a></h3>';
                    html += '<div id="' + mds.map.INSEE[insee].id 
                        + '" class="insee_category"></div>';
                }
                html  += '</div>';
            }
            if(divInfo === mds.map.INFO_BOX_ANNUAIRE) {
                html += '<strong>Annuaire</strong><select id="annuaire_select"></select>';
                html += '<div id="'+mds.map.ANNUAIRE_CONTENT+'">';
                html  += '</div>';
            }
            html += '</div>';
        }
        html += '</div>';
        return html;
    },
    
    getArticleListContent: function() {
        var articles = mds.map.currentArticles;
        if(articles === undefined)  {
            return "";
        }
        var nArticles = articles.length;
        var html = '<div>';
        html += '<p>';
        html += '<div>';
        html += '<ul class="article_list">';
        for(i = 0; i < nArticles; i++) {
            html += '<li class="article_list_item">';
//            console.log(articles[i].date.toString());
            html += mds.common.addZero(articles[i].date.getDate(), 2)
                +'/'+ mds.common.addZero(articles[i].date.getMonth()+1, 2)+": ";
            html += articles[i].titre;
            html += '&nbsp;<a href="#" onclick="javascript:mds.map.loadArticleContent(\''+i+'\')">(Voir)</a>';
            html += '</li>';
        }
        html += '</ul>';
        html += '</div>';
        html += '</p>';
        html += '</div>';
        return html;
    },
    
    setLoadContent: function(div_id) {
        var html = '<p align="center">'
        +'<strong>Chargement en cours</strong>'
        +'</p>';
    
        html += '<p align="center">'
        +'<img src="img/vloader.gif"/>'
        +'</p>';
        
        $('#'+div_id).html(html);
    },
    
    infoBoxReady: function() {
        $('#'+mds.map.INFO_BOX_TAB.id).tabs();
        $('#'+mds.map.INSEE_ACCORDION).accordion({animated: false, disabled: true, active: false});
        $('#infobox_button_close').click(function(){
            mds.map.closeInfoBox();
        });
        
        var multi = mds.map.isMulti();
        if(!multi) {
            $('#' + mds.map.INFO_BOX_TAB.id).tabs("option", "disabled", [1, 2]);
            mds.map.loadArticleContent(0);
        } else {
            $('#' + mds.map.INFO_BOX_TAB.id).tabs("option", "disabled", [1, 2, 3]);
            $('#'+mds.map.INFO_BOX_LIST.id).html(mds.map.getArticleListContent());
        }
    },
    
    
    closeInfoBox: function() {
        mds.map.updateMapOptions();
        mds.map.mapOptions.scrollwheel = true;
        
        mds.map.gmap.setOptions(mds.map.mapOptions);
        mds.map.infoBox.close();
        mds.map.markerClusterer.repaint();
        if(mds.map.DEBUG) {
            $('#'+mds.map.MAP_DEBUG_ARICLE).html('');
        }
        
    },
    
    getMarkerClickListener: function(marker, articles) {
        return function() {
            $('#infobox_button_close').unbind();
            $('#insee_select').unbind();
            $('#annuaire_select').unbind();
            
            try {
                mds.map.currentArticles = [];
                for(i=0; i<articles.length; i++) {
                   if(articles[i].display) {
                       mds.map.currentArticles.push(articles[i]);
                   } 
                }
                if(mds.map.currentArticles.length === 0) {
                    alert('liste des articles vides!');
                }
                var content = '<div id="'+mds.map.INFO_BOX_MAIN.id+'" class="info_box">'; 
                content += mds.map.getInfoBoxContent();
                content += '</div>';
                mds.map.infoBox.setContent(content);
                mds.map.infoBox.open(mds.map.gmap, marker);
                if(mds.map.DEBUG) {
                    var dbgHtml = '';
                    for(i=0; i<mds.map.currentArticles.length; i++) {
                        dbgHtml += i+', id='+articles[i].id+', titre='+articles[i].titre+'<br/>';
                    }
                    $('#'+mds.map.MAP_DEBUG_ARICLE).html('Articles: '
                        +mds.map.currentArticles.length+'<br/>'+dbgHtml);
                }
            } catch(e) {
                alert('exception '+e);
                //console.log(e);
            }
        };
    },
    
    getMarkerMouseOverListener: function(articles) {
        return function() {
            var html;
            if(articles.length > 1) {
                html = articles.length+' articles';
            }else {
                html = articles[0].titre;
            }
            $('#'+mds.map.MAP_CTRL_INFO.id).html(html);
        };
    },
    
    getMarkerMouseOutListener: function(articles) {
        return function() {
//            console.log('mouseout '+articles.length + ' article(s)');
            $('#'+mds.map.MAP_CTRL_INFO.id).html(mds.map.MAP_CTRL_INFO.title);
        };
    },
    
    handleAjaxError: function(func, msg, error) {
        alert('error '+func);
        mds.logging.console('error '+func);
        mds.general.closeLoadDialog();
    },
    
    loadArticleContent: function(index) {
        
        mds.map.setLoadContent(mds.map.INFO_BOX_ARTICLE.id);
        if(mds.map.isMulti()) {
            $('#' + mds.map.INFO_BOX_TAB.id).tabs("option", "disabled", [2, 3]);
            $('#'+mds.map.INFO_BOX_TAB.id).tabs("select", 1);
        }
        var article = mds.map.currentArticles[index];
        var query = "SELECT DTYPE, DONNEE FROM " + mds.map.contentTable
        + " WHERE ID='"+article.id+"' ORDER BY POS ASC";
        mds.common.fusionTableQuery(
        query, 
        function(rows) {
            
            var insee = article.geoInfo.insee;
            var html = '<div>';
            html += '<p>';
            //DATE
            var dateStr = mds.constant.WEEK[article.date.getDay()]+' '
                + mds.common.addZero(article.date.getDate(), 2)+'/'
                + mds.common.addZero(article.date.getMonth()+1, 2)+'/'
                + article.date.getUTCFullYear();
            html += '<span class="article_date_class">'+dateStr+'</span>';
            //GEO
            var geoStr = '';
            if(article.geoInfo.france) {    
                geoStr = insee[insee.length-1].nom;
                var geoId = insee[insee.length-1].code;
                if(insee.length > 2) {
                    geoId = insee[insee.length-2].code+geoId;
                }
                geoStr += ' ('+geoId+')';
                if(article.geoInfo.detail.length>0) {
                    geoStr = article.geoInfo.detail + ', ' + geoStr;
                }
            } else {
                var geoStrs = article.geoInfo.id.split(';');
                for(n=0; n<geoStrs.length; n++) {
                    if(geoStrs[n].length > 0) {
                        geoStr += geoStrs[n];
                        if(n < geoStrs.length-1 && geoStrs[n+1].length > 0) {
                            geoStr += ', ';
                        }
                    }
                }
            }
            html += '<span class="article_geo_class">'+geoStr+'</span>';
            html += '</p>';
            //TITRE
            html+= '<p><strong>'+article.titre+'</strong></p>';
            html+= '<div id="article_contents"></div>';
            var conts = [];
            for(i=0; i < rows.length ;i++) {
                var par = $('<p></p>');
                
                if(rows[i][0] !== 'TEXT') {
                    var cont = $(rows[i][1]);
                    if (rows[i][0] === 'IMAGE') {
                        mds.imageutil.wrap(cont, $('#infobox_id'));
                    }
                    par.attr('align', 'center');
                    par.append(cont);
                } else {
                    par.html(rows[i][1]);
                }   
                conts.push(par);
            }
            //AUTHOR
            html += '<p class="article_author_class"><em>Auteur: '+article.auteur+'</em></p>';
            
            //LINKS
            html += '<div class="article_link_class">Sources: ';
            if(!mds.map.isNull(article.lien)) {
                html += '<a href="'+article.lien+'" target="_blank">Blog</a>';
            }
            if(!mds.map.isNull(article.source_lien)) {
                if(!mds.map.isNull(article.lien)) {
                    html += ' | ';
                }
                html += '<a href="'+article.source_lien+'" target="_blank">'+article.source_nom+'</a>';
            }
            html += '<br/>';
            var pathName = window.location.pathname;
            if(pathName.indexOf('index.php')>0) {
                pathName = pathName.substr(0, pathName.indexOf("index.php"));
            } else {
                if(pathName.indexOf('/', pathName.length-2)<0) {
                    pathName += '/';
                }
            }
            html += '<a href="'+pathName+'index.php?id='+article.id+'" target="_blank">Permalien</a>';
            //END ARTICLE CONTENT
            html += '</div>';
            //INSEE/ANNUAIRE
            if(article.geoInfo.france) {
                var inseeHtml = '<option value=""></option>';
                var annuaireHtml = '<option value=""></option>';
                for(n=0; n < insee.length; n++) {
                    var cat = insee[n].cat;
                    var code = undefined;
                    if(insee[n].cat === 'COM') {
                        if( n >0 && insee[n-1].cat === 'DEP' ) {
                            code = insee[n-1].code+insee[n].code;
                        } else {
                            alert('INSEE INVALID');
                        }
                    } else {
                        code = insee[n].code;
                    } 
                    inseeHtml += '<option value="'+cat+';'+code+'">'
                        +insee[n].nom+' ('+code+')'
                        +'</option>';
                    if(insee[n].cat === 'COM' || insee[n].cat === 'DEP') {
                        annuaireHtml += '<option value="'+cat+';'+code+'">'
                            +insee[n].nom+' ('+code+')'
                            +'</option>';
                    }
                }
                $('#insee_select').html(inseeHtml).change(function(){
                    var inseeVal = $(this).val();
                    if(inseeVal.length > 0) {
                        var ids = inseeVal.split(";");
                        mds.map.loadInsee(ids[1], ids[0]);
                    }
                });
                $('#annuaire_select').html(annuaireHtml).change(function(){
                    var annuaireVal = $(this).val();
                    if(annuaireVal.length > 0) {
                        var ids = annuaireVal.split(";");
                        mds.map.loadAnnuaire(ids[1], ids[0]);
                    }
                });
                $('#' + mds.map.INFO_BOX_TAB.id).tabs("option", "disabled", []);
            }
            $('#' + mds.map.INFO_BOX_ARTICLE.id).html(html);
            for(ci=0; ci<conts.length; ci++) {
                $('#article_contents').append(conts[ci]);
            }
            mds.map.updateMapOptions();
            mds.map.mapOptions.scrollwheel = false;
            mds.map.gmap.setOptions(mds.map.mapOptions);
            mds.map.markerClusterer.repaint();
        },
        function(msg, error){
            mds.map.handleAjaxError('loadArticleContent('+index+')', msg, error);
        });
    },
    
    setInseeContent: function(row, head, id) {
        var html = '<table class="insee_data_table">';
        for(z=0; z < head.length; z++) {
            if(!mds.map.isNull(row[head[z].pos])) {
                html += '<tr>';
                html += '<td class="insee_data_desc">'+head[z].disp+'</td>';
                html += '<td class="insee_data_val" align="right">'+row[head[z].pos]+'</td>';
                html += '</tr>';
            }
        }
        html += '</table>';
        html += '<div class="insee_chart" id="'+'CHART_'+id+'"></div>';
        $('#'+id).html(html);
    },
    
    uiLoad: function(finish) {
        if(finish) {
            $('#'+INFOBOX_ID).animate({backgroundColor: "#dddddd"}, 50);
            $('#'+INFOBOX_TAB_ID).fadeTo(100, 1.);
        } else {
            $('#'+INFOBOX_ID).animate({backgroundColor: "##363636;"}, 50);
            $('#'+INFOBOX_TAB_ID).fadeTo(400, .2);
        }
    },
    
    displayInsee: function(row) {
    
        mds.map.setInseeContent(row, mds.constant.INSEE_POP_HEAD, mds.map.INSEE.POP.id);
        mds.map.setInseeContent(row, mds.constant.INSEE_EMP_HEAD, mds.map.INSEE.EMP.id);
        mds.map.setInseeContent(row, mds.constant.INSEE_LOG_HEAD, mds.map.INSEE.LOG.id);
        mds.map.setInseeContent(row, mds.constant.INSEE_ETAB_HEAD, mds.map.INSEE.ECO.id);
        mds.map.setInseeContent(row, mds.constant.INSEE_REV_HEAD, mds.map.INSEE.REV.id);
        mds.chart.createEconomyChart(row, 'CHART_'+mds.map.INSEE.ECO.id);
        mds.chart.createEmploiChart(row, 'CHART_'+mds.map.INSEE.EMP.id);
        mds.chart.createLogementChart(row, 'CHART_'+mds.map.INSEE.LOG.id);
        mds.chart.createRevenuChart(row, 'CHART_'+mds.map.INSEE.REV.id);
        mds.chart.createPopulationChart(row, 'CHART_'+mds.map.INSEE.POP.id);
        var selector = $('#'+mds.map.INSEE_ACCORDION);
        selector.accordion("option", "disabled", false);
        selector.accordion("option", "active", 0);
    },

    loadInsee: function(code, cat) {
        //console.log('loaInsee: cat='+cat+', code='+code);
        mds.general.openLoadDialog();
        var sql = "SELECT ";
        var tabs = [
            mds.constant.INSEE_EMP_HEAD, 
            mds.constant.INSEE_ETAB_HEAD, 
            mds.constant.INSEE_LOG_HEAD, 
            mds.constant.INSEE_POP_HEAD, 
            mds.constant.INSEE_REV_HEAD
        ];
        for(i = 0; i < tabs.length; i++) {
            for(j = 0; j < tabs[i].length; j++) {
                sql += "'"+tabs[i][j].col+"',"
            }
        }
        sql = sql.substr(0, sql.length-1);
        sql += " FROM " + mds.map.INSEETable 
            + " WHERE 'CODE'='" + code +"' AND 'GEO'='" + cat + "'";
        mds.common.fusionTableQuery(
        sql, 
        function(rows) {
            if(rows.length !== 1) {
                //console.log('rows length '+rows.length+' invalide');
            } else {
                mds.map.displayInsee(rows[0]);
            }
            mds.general.closeLoadDialog();
        },
        function(msg, error){
            mds.map.handleAjaxError('loadInsee', msg, error);
        });
    },
    
    /**
     * Charge l'annuaire.
     */
    loadAnnuaire: function(code, cat) {
        //console.log('loadAnnuaire: code='+code);
        mds.general.openLoadDialog();
        var com = cat == 'COM';
        var table = com ? mds.map.annuaireComTable: mds.map.annuaireDepTable; 
        var sql = "SELECT * FROM " + table 
            + " WHERE 'CODE'='" + code + "'";
        mds.common.fusionTableQuery(
        sql, 
        function(rows) {
            if(rows.length != 1) {
                $('#'+mds.map.ANNUAIRE_CONTENT).html('<strong>Pas de données disponibles</strong>');
                //console.log('rows length '+rows.length+' invalide');
            } else {
                //console.log(rows[0]);
                if(com) {
                    mds.map.displayComAnnuaire(rows[0]);
                } else {
                    mds.map.displayDepAnnuaire(rows[0]);
                }
            }
            mds.general.closeLoadDialog();
        },
        function(msg, error){
            mds.map.handleAjaxError('loadAnnuaire', msg, error);
        });
    },
    
    /**
     * Affiche l'annuaire de la commune.
     */
    displayComAnnuaire: function(row) {
        var annuaire = {
            adr: row[0],
            fax: row[1],
            code: row[2],
            maire: row[3],
            pop: row[4],
            surface: row[5],
            tel: row[6],
            titre: row[7],
            web: row[8]
        };
        var NA = 'Non disponible';
        var sep = '<div class="annuaire_separator"></div>';
        var sep2 = '<div class="annuaire_separator2"></div>';
        var html = '';
        
        //MAIRE
        html += '<span class="annuaire_title">Maire</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.maire)) {
            html += NA;
        } else {
            html += annuaire.maire;
        }            
        html += '</span>';
        html += sep;
        //POPULATION
        html += '<span class="annuaire_title">Population</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.pop)) {
            html += NA;
        } else {
            html += annuaire.pop;
        }
        html += '</span>';
        html += sep;
        
        //SURFACE
        html += '<span class="annuaire_title">Surface</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.surface)) {
            html += NA;
        } else {
            html += annuaire.surface+' ha';
        }
        html += '</span>';
        html += sep;
        
        //MAIRIE
        html += '<span class="annuaire_title">Adresse mairie</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.adr)) {
            html += NA;
        }else {
            var adrs =  annuaire.adr.split(';');
            for(i=0; i< adrs.length; i++) {
                html += adrs[i];
                if(i < adrs.length-1) {
                    html += '<br/>';
                }
            }
        }
        html += '</span>';
        html += sep;
        
        //TEL
        html += '<span class="annuaire_title">Tel</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.tel)) {
            html += NA;
        } else {
            html += '<a href="callto: '+annuaire.tel+'">'+annuaire.tel+'</a>';
        }
        html += '</span>';
        
        //FAX
        html += '<span class="annuaire_title">Fax</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.fax)) {
            html += NA;
        }else {
            html += annuaire.fax;
        }
        html += '</span>';
        html += sep;
        
        //WEB
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.web)) {
            html += 'Pas de site internet';
        } else {
            html += '<span class="annuaire_text"><a href="'
                    +annuaire.web 
                    +'" target="_blank">Site internet</a>';
        }
        html += '</span>';
        html += sep;
        html += '<p class="annuaire_source_class">Source: '
            +'<a href="http://www.amf.asso.fr/" target="_blank">'
            +'Association des maires de France</a></p>';
        
        $('#'+mds.map.ANNUAIRE_CONTENT).html(html);
    },
    
    /**
     * Affiche l'annuaire du département.
     */
    displayDepAnnuaire: function(row) {
        var annuaire = {
            adr: row[0],
            fax: row[2],
            code: row[1],
            nbCom: row[3],
            nbECPI: row[4],
            pop: row[5],
            president: row[6],
            tel: row[7],
            titre: row[8]
        }
        var NA = 'Non disponible';
        var sep = '<div class="annuaire_separator"></div>';
        var sep2 = '<div class="annuaire_line"></div>';
        
        var html = '';
        //TITRE
        if(!mds.map.isNull(annuaire.titre)) {
            html += '<span class="annuaire_title">'+annuaire.titre+'</span>';
            html += sep;
            html += sep;
        }
        //PRESIDENT
        html += '<span class="annuaire_title">Président</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.president)) {
            html += NA;
        } else {
            html += annuaire.president;
        }            
        html += '</span>';
        html += sep;
        
        //POPULATION
        html += '<span class="annuaire_title">Population</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.pop)) {
            html += NA;
        } else {
            html += annuaire.pop;
        }            
        html += '</span>';
        html += sep;
        
        //COMMUNES
        html += '<span class="annuaire_title">Communes du département</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.nbCom)) {
            html += NA;
        } else {
            html += annuaire.nbCom;
        }            
        html += '</span>';
        html += sep;
        
        //EPCI
        html += '<span class="annuaire_title">Communautés de communes</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.nbECPI)) {
            html += NA;
        } else {
            html += annuaire.nbECPI;
        }            
        html += '</span>';
        html += sep;
        
        html += '<span class="annuaire_title">Adresse association</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.adr)) {
            html += NA;
        }else {
            var adrs =  annuaire.adr.split(';');
            for(i=0; i< adrs.length; i++) {
                html += adrs[i];
                if(i < adrs.length-1) {
                    html += '<br/>';
                }
            }
        }
        html += '</span>';
        html += sep;
        
        //TEL
        html += '<span class="annuaire_title">Tel</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.tel)) {
            html += NA;
        } else {
            html += '<a href="callto: '+annuaire.tel+'">'+annuaire.tel+'</a>';
        }
        html += '</span>';
        
        //FAX
        html += '<span class="annuaire_title">Fax</span>';
        html += '<span class="annuaire_text">';
        if(mds.map.isNull(annuaire.fax)) {
            html += NA;
        }else {
            html += annuaire.fax;
        }
        html += '</span>';
        html += sep;
        html += '<p class="annuaire_source_class">Source: '
            +'<a href="http://www.amf.asso.fr/" target="_blank">'
            +'Association des maires de France</a></p>';
        $('#'+mds.map.ANNUAIRE_CONTENT).html(html);
    },
    
    /**
     * Vas à la position et au zoom
     */
    gotoPosition: function(pos, zoom) {
        var _zoom = zoom;
        if(_zoom == undefined) {
            _zoom = 13;
        }
        mds.map.closeInfoBox();
        mds.map.gmap.setCenter(pos);
        if(mds.map.gmap.getZoom() < _zoom) {
            mds.map.gmap.setZoom(_zoom);
        }
    },
    
    /**
     * Remplir la carte avec les markers
     */
    setLayer: function(layer) {
        for(id in layer) {
            var layerObject = layer[id];
            filterLayerObject(layerObject, mds.map.layerFilter);
            if(!layerObject.display) {
                continue;
            }
            setLayerObjectIcon(layerObject);
            var options = layerObject.markerOption;
            options.labelAnchor = new google.maps.Point(100, 0);
            options.position = new google.maps.LatLng(options.lat, options.lng);
            var marker = new MarkerWithLabel(options);
            google.maps.event.addListener(marker, 'click', 
                mds.map.getMarkerClickListener(marker, layerObject.articles));
            google.maps.event.addListener(marker, 'mouseover', 
                mds.map.getMarkerMouseOverListener(layerObject.articles));
            google.maps.event.addListener(marker, 'mouseout', 
                mds.map.getMarkerMouseOutListener(layerObject.articles));
            layerObject.marker = marker;
            mds.map.markerClusterer.addMarker(marker);
        }
        mds.map.geoLayer = layer;
    },
    
    /**
     * Filtre les articles en fonction des catégories.
    */
    setLayerFilter: function(fdClass, fdCat) {
        mds.map.closeInfoBox();
        if(fdClass != "") {
            mds.map.layerFilter.fdclass = parseInt(fdClass);
        } else {
            mds.map.layerFilter.fdclass = undefined;
        }
        mds.map.freeLayer();
        mds.map.setLayer(mds.map.geoLayer);
    },
    
    /**
     * Nettoie les markers en cours.
    */
    freeLayer: function() {
        if(mds.map.geoLayer) {
            //console.log('freeLayer');
        } else {
            mds.map.geoLayer = new Object();
        }
        mds.map.infoBox.close();
        mds.map.currentArticles = [];
        var markers = mds.map.markerClusterer.getMarkers();
        for(i=0; i < markers.length; i++) {
            //Libère les évènements associés aux markers.
            google.maps.event.clearInstanceListeners(markers[i]);
        }
        //Libère le cluster
        mds.map.markerClusterer.clearMarkers();
    },
    
    /**
     * Charge les articles
     * clause: clause supplémentaire, doit commencer en SQL.
     */
    loadArticles: function(clause) {
        mds.map.gmap.setCenter(mds.map.mapCenter);
        mds.map.gmap.setZoom(mds.map.mapDefaultZoom);
        mds.general.openLoadDialog();
                
        if(mds.map.worker) {
            mds.map.worker.terminate();
        }
        if(mds.map.xhr) {
            mds.map.xhr.abort();
        }
        mds.map.freeLayer();
        var sql = 'SELECT * FROM ' + mds.map.articleTable 
            + ' WHERE ETAT='+mds.constant.LIST_EDITED;
        if(clause) {
            sql += ' AND '+clause;
        }
        mds.map.xhr = mds.common.fusionTableQuery(sql, function(rows){
//            Sans WebWorker            
            var layer = handleArticlesRows(rows);
            if(typeof layer === "undefined") {
                mds.calendar.loadCalendar();
            } else {
                mds.map.setLayer(layer);
            }
//            mds.map.worker = new Worker('js/mapWorker.js');
//            mds.map.worker.onmessage = function(e) {
//                mds.map.setLayer(e.data);
            if(mds.map.loadCallBack) {
                mds.map.loadCallBack();
            }
            mds.map.worker = undefined;
            mds.general.closeLoadDialog();
//            }
//            mds.map.worker.onerror = function(e) {
//                alert('woker error: '+e.message);
//                console.log('woker error: '+e.message);
//            }
//            mds.map.worker.postMessage(rows);
            mds.map.xhr = undefined;
        });
    },
    
    /**
     * Charge et affiche un article particulier
     * id: identifiant de l'article dans la base de données.
    */
    displayId: function(id) {
        mds.map.closeInfoBox();
        mds.map.loadCallBack = function(){
            var markers = mds.map.markerClusterer.getMarkers();
            if(markers.length !== 1) {
                alert("Pas d'article!");
                return;
            }
            mds.map.gmap.setCenter(markers[0].getPosition());
            mds.map.gmap.setZoom(13);
            setTimeout(function(){
                google.maps.event.trigger(markers[0], 'click');
                mds.map.loadCallBack = undefined;
            }, 1000);
        };
        mds.map.loadArticles("ID='"+id+"'");
    },
    
    /**
     * Charge les articles du mois
     * year: année
     * month: mois
    */
    displayMap: function(year, month) {
        mds.map.closeInfoBox();
        var conditions = '';
        if(year) {
            conditions += "ANNEE='"+year+"'";
        }
        if(month !== undefined) {
            if(conditions.length>0) {
                conditions += ' AND ';
            }
            conditions += "MOIS='"+month+"'";
        }
        mds.map.loadArticles(conditions);
    },
    
    updateMapOptions: function() {
        mds.map.mapOptions.zoom = mds.map.gmap.getZoom();
        mds.map.mapOptions.center = mds.map.gmap.getCenter();
    },
    /**
     * 
     * Initialisation de la carte
     * @param {type} menuSelector
     * @param {type} mapSelector
     * @returns {undefined}
     */
    initMap: function (menuSelector, mapSelector) {
        if(mds.general.embedded) {
            mds.map.mapDefaultZoom = 5,
            mds.map.mapOptions.zoom = 5;
        }
        mds.map.gmap = new google.maps.Map(mapSelector.get(0), mds.map.mapOptions);
        mds.map.markerClusterer = new MarkerClusterer(
            mds.map.gmap, [], 
            {
                gridSize: 40, 
                imagePath: 'img/tm',
                minimumClusterSize: 2,
                maxZoom: 14 
            });
        if(mds.general.embedded) {
            mds.map.infoBoxOption.infoBoxClearance = new google.maps.Size(0, 0);
        }
        mds.map.infoBox = new InfoBox(mds.map.infoBoxOption);
        google.maps.event.addListener(
            mds.map.infoBox, 
            'domready', 
            mds.map.infoBoxReady);
        //INFO
        var info = $('<div></div>');
        info.attr('id', mds.map.MAP_CTRL_INFO.id);
        info.attr('class', 'ui-widget ui-state-default ui-corner-all');
        info.html(mds.map.MAP_CTRL_INFO.title);
        //Ajoute mes contrôles à la carte
        mds.map.gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(menuSelector.get(0));
        mds.map.gmap.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(info.get(0));
        if(mds.map.DEBUG) {
            //DEBUG
            var debug = $('<div id="'+mds.map.MAP_DEBUG+'">DEBUG'
                +'<div id="'+mds.map.MAP_DEBUG_ZOOM+'"></div>'
                +'<div id="'+mds.map.MAP_DEBUG_CENTER+'"></div>'
                +'<div id="'+mds.map.MAP_DEBUG_BOUNDS+'"></div>'
                +'<div id="'+mds.map.MAP_DEBUG_STATUS+'"></div>'
                +'<div id="'+mds.map.MAP_DEBUG_ARICLE+'"></div>'
                +'</div>');
            
            mds.map.gmap.controls[google.maps.ControlPosition.RIGHT_TOP].push(debug.get(0));
        }
        
        //POST INIT
        google.maps.event.addListenerOnce(mds.map.gmap, 'idle', function() {                
            
        });
        //Gestion du zoom
        google.maps.event.addListener(mds.map.gmap, 'zoom_changed', mds.map.zoomHandler);
        //Gestion du centre
        google.maps.event.addListener(mds.map.gmap, 'center_changed', mds.map.centerHandler);
        //Gestion des limites visuelles
        google.maps.event.addListener(mds.map.gmap, 'bounds_changed', mds.map.boundsHandler);
        if(mds.map.DEBUG) {
            mds.map.zoomHandler();
            mds.map.centerHandler();
            mds.map.boundsHandler();
        }
    },
    
    /**
     * Limiter le zoom maximum
     **/
    zoomHandler: function() {
        var _current_zoom = mds.map.gmap.getZoom();
        if(_current_zoom < mds.map.mapDefaultZoom) {
            mds.map.gmap.setZoom(mds.map.mapDefaultZoom);
        }
        if(mds.map.DEBUG && _current_zoom) {
            $('#'+mds.map.MAP_DEBUG_ZOOM).html('zoom: '+_current_zoom);
            $('#'+mds.map.MAP_DEBUG_STATUS).html('Status: scrollwheel='+mds.map.mapOptions.scrollwheel);
        }
    },
    
    /**
     * Limiter la zone d'affichage de la carte
     **/
    boundsHandler: function() {
        var _current_bounds = mds.map.gmap.getBounds();
        if(mds.map.DEBUG && _current_bounds) {
            $('#'+mds.map.MAP_DEBUG_BOUNDS).html('Bounds: <br/>NE='
                +_current_bounds.getNorthEast()+'<br/>SW='+_current_bounds.getSouthWest());
        }
    },
    /**
     * Limiter le centre d'affichage de la carte
     **/
    centerHandler: function() {
        var _current_center = mds.map.gmap.getCenter();
        if(mds.map.DEBUG && _current_center) {
            $('#'+mds.map.MAP_DEBUG_CENTER).html('center: '+_current_center);
        }
    },
    
    /**
     * Si sélection multiple.
     */
    isMulti: function() {
        if(mds.map.currentArticles === undefined) {
            alert('artciles indéfinis');
            return false;
        }
        return (mds.map.currentArticles.length>1);
    },
    
    /**
     * Si le contenu est null.
     * @param {type} data
     */
    isNull: function(data) {
        return !data || (''+data).length === 0 || (''+data).toLowerCase() === 'null';
    }
    
};

