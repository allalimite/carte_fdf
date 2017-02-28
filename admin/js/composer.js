/*
 * Edition des articles.
 * 23/06/2013
 * Nouvelle API de fusion table.
 */
if(typeof( mds ) === 'undefined') {
    var mds = {};
}

mds.composer = {
    
    editor: mds.constant.SRC_WAT,    
    GOOGLE_CLIENTID: 'googleClientId',
    GOOGLE_APIKEY: 'googleApiKey',
    GMAIL_USER: 'gmailUser',
    GMAIL_PASSWORD : 'gmailPassword',
    DEFAULT_LOCATION : new google.maps.LatLng(46.9, 2.0),
    DEFAULT_ZOOM : 5,
    SEARCH_ZOOM : 15,
    ARTICLE_POS: 0,
    MAP_POS: 1,
    CONTENT_POS: 2,
    PREVIEW_POS: 3,
    apiKey: undefined,
    clientId: undefined,
    gmailToken: undefined,
    loggedIn : false,
    dateSelector: undefined,
    tableArticle: undefined,
    tableContenu: undefined,
    tableCOG: undefined,
    tablePresse: undefined,
    currentYear: undefined,
    currentMonth: undefined,
    currentArticle: undefined,
    geocoder: undefined,
    map: undefined,
    articles : [],
    articleIndex : -1,
    marker: undefined,
    geoInfo : undefined,
    articlesContent: [],
    contentToDelete: [],
    currentContent: undefined,
    check: {
        geo: false,
        article: false,
        content: false
    },
    loadArticleLock: false,

    initComposer: function() {
        mds.composer.initUI();
        mds.composer.initMap();
        
        //mds.composer.initLogin();
    },

    initMap: function () {
        mds.composer.geocoder =  new google.maps.Geocoder();
        var mapOptions = {
            zoom: mds.composer.DEFAULT_ZOOM,
            center: mds.composer.DEFAULT_LOCATION,
            streetViewControl: false,
            panControl: false,
            scaleControl: false,
            zoomControl: true,
            mapTypeControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        mds.composer.map = new google.maps.Map($('#geo_map').get(0), mapOptions);
    },
  
    loadPresse: function () {
        var sql = "SELECT NOM, LIEN FROM "+mds.composer.tablePresse+" ORDER BY NOM ASC";
        
        mds.query.fusionTableGET(
            sql, 
            function(ftresult) {
                var rows = ftresult.rows;
                var html = '<option value=""></option>';
                for(n = 0; n < rows.length; n++) {
                    var row = rows[n];
                    html += '<option value="' + row[1] + '">' 
                    + row[0] + '</option>';
                }
                $('#article_source_selector').html(html);
            },
            function(status, error) {
                alert('error: '+status+', error='+error);
                console.log(status);
                console.log(error);
            }
        );
    },
    
    loadCalendar: function () {
        mds.composer.articleIndex = -1;
        mds.composer.checkIndex();
        mds.composer.clearAll();
        $('#year_selector').html('');
        $('#month_selector').html('');
        $( '#load_dialog' ).dialog( "option", "title", 'Chargement du calendrier' );
        $( '#load_dialog' ).dialog('open');
        var status = $('#status_selector').val();
        var sql = "SELECT 'ANNEE', 'MOIS', COUNT() FROM "
        + mds.composer.tableArticle 
        //            + " WHERE EDITEUR='" + mds.composer.editor
        +" WHERE ETAT="+status+" GROUP BY 'ANNEE', 'MOIS'";
        mds.query.fusionTableGET(sql, 
            function(ftresult) {
                var res = ftresult.rows;
                mds.composer.setEnable('button_reload', true);
                $( '#load_dialog' ).dialog('close');
                mds.composer.setEnable('button_new', true);
                mds.composer.dateSelector = new Object();
                var calendarInfos = res;
                var size = calendarInfos.length;
                for(n=0; n<size; n++) {
                    var calendarInfo = calendarInfos[n];
                    var annee = calendarInfo[0];
                    var mois = calendarInfo[1];
                    var count = calendarInfo[2];
                    if(! mds.composer.dateSelector[annee]) {
                        mds.composer.dateSelector[annee] = new Object();
                    }
                    if(! mds.composer.dateSelector[annee][mois]) {
                        mds.composer.dateSelector[annee][mois] = new Object();
                    }
                    mds.composer.dateSelector[annee][mois].count = count;
                }
                var htmlYear = '<option></option>';
                for(year in mds.composer.dateSelector) {
                    htmlYear += '<option>';
                    htmlYear += year;
                    htmlYear += '</option>';
                }
                $('#year_selector').html(htmlYear).change(function(){
                    var selectedYear = $('#year_selector option:selected').val();
                    if(selectedYear && selectedYear.length === 4) {
                        mds.composer.currentYear = selectedYear;
                        var htmlMonth = '<option></option>';
                        for(month in mds.composer.dateSelector[selectedYear]) {
                            htmlMonth += '<option value="' + month + '" >';
                            htmlMonth += mds.constant.MONTHS[parseInt(month+'')] + ' (' + 
                            mds.composer.dateSelector[selectedYear][month].count + ')';
                            htmlMonth += '</option>';
                        }
                        $('#month_selector').html(htmlMonth).change(function(){
                            if(!mds.composer.loadArticleLock) {
                                mds.composer.loadArticleLock = true;
                                var selectedMonth = $('#month_selector option:selected').val();
                                if(selectedMonth && selectedMonth.length > 0) {
                                    mds.composer.currentMonth = selectedMonth;
                                    mds.composer.loadArtciles();
                                }
                            } else {
                                mds.composer.loadArticleLock = false;
                            }
                        });
                    }
                }
            );
            
        },
        function(status, error) {
            console.log('error: '+status+', error='+error);
        }
        );
        },

    initDB: function() {
        mds.query.getTablesInfo(
            function(tableInfo) {
                mds.ds.updateTableInfo(tableInfo);
                if(mds.ds.tables.article_prod) {
                    mds.composer.tableArticle = mds.ds.tables.article_prod.tableId;
                }
                if(mds.ds.tables.contenu_prod) {
                    mds.composer.tableContenu = mds.ds.tables.contenu_prod.tableId;
                }
                if(mds.ds.tables.cog) {
                    mds.composer.tableCOG = mds.ds.tables.cog.tableId;
                }
                if(mds.ds.tables.presse) {
                    mds.composer.tablePresse = mds.ds.tables.presse.tableId;
                }
                var tableInfoReady = 
                    typeof(mds.composer.tableArticle) !== "undefined"
                    && typeof(mds.composer.tableContenu) !== "undefined"
                    && typeof(mds.composer.tableCOG) !== "undefined"
                    && typeof(mds.composer.tablePresse) !== "undefined";
                if(tableInfoReady) {
                    mds.composer.loadPresse();
                    mds.composer.loadCalendar();
                } else {
                    alert('Impossible de recuperer les informations des tables');
                }
            },
            mds.composer.handleError
        );
    },

    initUI: function() {
        
        //BUTTONS
        mds.composer.setEnable('button_reload', false);
        mds.composer.setEnable('button_prev', false);
        mds.composer.setEnable('button_next', false);
        mds.composer.setEnable('button_new', false);
        mds.composer.setEnable('button_valid', false);
        mds.composer.setEnable('button_del', false);
        
        var editorChoice = '<option value="'+mds.constant.SRC_WAT+'" selected="selected" >Waterman</option>';
        editorChoice += '<option value="'+mds.constant.SRC_FDS+'" >FDS</option>';
        $('#button_reset_credential').click(function(){
            if(localStorage) {
                localStorage.removeItem(mds.composer.GOOGLE_CLIENTID);
                localStorage.removeItem(mds.composer.GOOGLE_APIKEY);
            }
            mds.composer.initLogin();
        });
        $('#button_login').click(function(){
            mds.composer.initLogin();
        });

        $('#status_selector').change(function(){
            mds.composer.loadCalendar();
        });
        $('#editor_selector').html(editorChoice).change(function(){
            mds.composer.editor = $(this).val();
        });
        $('#button_reload').click(function(){
            mds.composer.loadCalendar();
        });        
        $('#button_prev').click(function(){
            mds.composer.previous();
        });        
        $('#button_next').click(function(){
            mds.composer.next();
        });
        $('#article_index_text').keypress(function (e) {
            if(e.which === 13){
                try {
                    var idx = parseInt($(this).val());
                    if(idx > 0 && idx <= mds.composer.articles.length){
                        mds.composer.displayArticle(idx-1);
                        mds.composer.checkIndex();
                        mds.composer.updateEdited();
                    } else {
                        $(this).val('');
                    }
                } catch(e) {
                    $(this).val('');
                }
            }
        });
        $('#article_id_text').keypress(function (e) {
            if(e.which === 13){
                mds.composer.loadArtciles($('#article_id_text').val());
            }
        });
        $('#button_status').click(function(){
            mds.composer.checkArticle();
            mds.composer.checkContent();
            mds.composer.checkGeo();
        }); 
        $('#button_new').click(function(){
            mds.composer.newArticle();
        });        
        $('#button_valid').click(function(){
            mds.composer.saveArticle();
        });        
        $('#button_del').click(function(){
            mds.composer.suppr();
        });        
        //DIALOGS
        $( '#login_dialog' ).dialog({
            width: 500,
            height: 100,
            autoOpen: false,
            resizable: false,
            modal: true,
            draggable: false,
            title: 'Connexion au compte Gmail'
        });
        $( '#load_dialog' ).dialog({
            width: 250,
            height: 150,
            autoOpen: false,
            resizable: false,
            modal: true,
            draggable: false
        });
        $( '#press_dialog' ).dialog({
            width: 500,
            height: 250,
            autoOpen: false,
            resizable: true,
            draggable: true,
            title: "Ajout d'une source de presse / internet"
        });
        //LOGIN
//        $( '#accountButton').click(function(){
//            if(mds.composer.loggedIn) {
//                $('#accountUser').html("Non connecté");
//                $('#accountButton').html("Connection" );
//                mds.composer.loggedIn = false;
//                localStorage.clear();
//                mds.composer.login();
//            } else {
//                mds.composer.login();
//            }
//            return false;
//        });
//        $( '#loginButton').click(function(){
//            var userId = $('#loginUser').val();
//            var passId = $('#loginPassword').val();
//            if(userId && passId && userId.length>11 && passId.length>5) {
//                $('#loginInfo').html("Connection...");
//                mds.composer.gmailAccountLogin(userId, passId);
//            } else {
//                $('#loginInfo').html("Login ou MDP incorrects");
//            }
//            return false;
//        });
        
        //Article DETAIL
        //DATE
        $('#article_date').datepicker();
        //CATEGORY
        var htmlCats = '<option value=""></option>';
        for(cat in mds.constant.FD_CATEGORY) {
            htmlCats += '<option value="'+cat+'">';
            htmlCats += mds.constant.FD_CATEGORY[cat].text;
            htmlCats += '</option>';
        }
        $('#fd_cat_selector').html(htmlCats).change(function(){
            mds.composer.checkArticle();
        });
        //LINKS
        $('#article_src_lien_link').click(function(){
            var link = $('#article_src_lien').val();
            
            if(link && link.indexOf('http://') === 0) {
                mds.composer.displayIFrame(link);
            }
        });
        /*$('#article_blog_lien_link').click(function(){
            var link = $('#article_blog_lien').val();
            if(link && link.indexOf('http://') === 0) {
                mds.composer.displayIFrame(link);
            }
        });*/
        $('#article_src_search').click(function(){
            mds.composer.searchSource($('#article_src_lien').val());
        });        
        $('#article_src_add').click(function(){
            $('#press_name').val('');
            $('#press_link').val('');
            $('#press_info').html('');
            $( '#press_dialog' ).dialog('open');
        });
        $('#article_src_custom').keypress(function (e) {
            if(e.which === 13){
                mds.composer.checkArticle();
            }
        });
        $('#press_valid').click( function () {
            mds.composer.validPress();
        });
        //LEFT PANEL
        var contentTypeHtml = '';
        contentTypeHtml += '<option selected="selected" value="'+mds.constant.CONTENT_TEXT+'">';
        contentTypeHtml += 'Texte</option>';
        contentTypeHtml += '<option value="'+mds.constant.CONTENT_IMAGE+'">';
        contentTypeHtml += 'Image</option>';
        contentTypeHtml += '<option value="'+mds.constant.CONTENT_MULTIMEDIA+'">';
        contentTypeHtml += 'Multimedia</option>';
        $('#content_type').html(contentTypeHtml);
        $('#left_panel').tabs({
            select: function(event, ui) { 
                var tabIndex = ui.index;
                if(tabIndex === mds.composer.PREVIEW_POS) {
                    $('#article_preview').empty();
                    var par = $('<p><strong>'+$('#article_titre').val()+'</strong></p>');
                    $('#article_preview').append(par);
                    for(n=0; n < mds.composer.articlesContent.length; n++) {
                        var cont = mds.composer.articlesContent[n];
                        var classe;
                        var align;
                        if(cont.type === mds.constant.CONTENT_TEXT) {
                            align = 'left';
                            classe = 'text_content_class'; 
                        } else if(cont.type === mds.constant.CONTENT_IMAGE) {
                            align = 'center';
                            classe = 'image_content_class'; 
                        } else if(cont.type === mds.constant.CONTENT_MULTIMEDIA) {
                            align = 'center';
                            classe = 'video_content_class'; 
                        }
                        if(cont.html) {
                            par = $('<p></p>');
                            par.attr('class', classe);
                            par.attr('align', align);
                            par.html(cont.html);
                            $('#article_preview').append(par);
                        }
                    }
                }
            }
        });
        $('#left_panel').tabs( "select" , mds.composer.MAP_POS);        
        $('#left_panel').tabs( "disable" , mds.composer.PREVIEW_POS);        
        $('#button_content_add').click(function(){
            var type = $('#content_type option:selected').val();
            console.log('type: '+type);
            var size = $('#content_list option').size();
            var html = $('#content_list').html();
            html += '<option value="' + size + '">Contenu#' 
            + (size+1) + ' (' + type +')</option>';
            
            $('#content_list').html(html);
            if(type === mds.constant.CONTENT_TEXT) {
                mds.composer.articlesContent.push({
                    type: type,
                    text: ''
                });
            } else if(type === mds.constant.CONTENT_IMAGE) {
                mds.composer.articlesContent.push({
                    type: type,
                    url: '',
                    w: '80%',
                    h: '',
                    credit: ''
                });
                $('#image').empty();
            } else if(type === mds.constant.CONTENT_MULTIMEDIA) {
                mds.composer.articlesContent.push({
                    type: type,
                    code: ''
                });
                $('#video').empty();
            }
            $('#button_article_content_valid').css('display', 'none');
            $('#content_list').val(''+size);
            mds.composer.selectContent(size);
        });        
        $('#button_content_del').click(function(){
            var selected = $('#content_list option:selected').val();
            if(selected) {
                console.log('del '+selected);
                
                if(mds.composer.articlesContent[selected].rowid) {
                    mds.composer.contentToDelete.push(mds.composer.articlesContent[selected]);
                }
                mds.composer.articlesContent.splice(selected, 1);
                var selectHtml;
                var contentLength = mds.composer.articlesContent.length;
                if(contentLength > 0) {
                    for(p = 0; p < contentLength; p++) {
                        selectHtml += '<option value="' + p + '">Contenu#' 
                        + (p+1) + ' (' + mds.composer.articlesContent[p].type +')</option>';
                    }
                    $('#content_list').html(selectHtml);
                    $('#content_list').val('0');//.attr('selected', true);
                    mds.composer.selectContent(0);
                } else {
                    $('#article_content_text_id').css('display', 'none');
                    $('#article_content_image_id').css('display', 'none');
                    $('#article_content_video_id').css('display', 'none');
                    $('#content_list').html('');
                    mds.composer.currentContent = undefined;
                    $('#left_panel').tabs( "disable" , mds.composer.PREVIEW_POS);
                }
                mds.composer.checkContent();
            }
        });        
        $("#content_list").change(function () {
            var selected = $('#content_list option:selected').val();
            mds.composer.selectContent(selected);
        });                  
        $('#article_content_text').bind('textchange', function () {
            var text = $(this).text();
            $('#button_article_content_valid').css('display', 'block');
        });        
        $( '#button_apply_image' ).click(function(){
            $('#image').empty();
            var url = $('#image_url').val();
            if(url && url.length > 5) {
                var image = $('<img></img>');
                image.attr('src', url);
                var w = $('#image_w').val();
                if(w && w.length > 0 ) {
                    image.attr('width', w);
                }
                var h = $('#image_h').val();
                if(h && h.length > 0 ) {
                    image.attr('height', h);
                }
                
                $('#image').append(image);
                var credit = $('#image_credit').val();
                if(credit && credit.length > 0) {
                    var creditSpan = $('<span class="image_credit_class"></span>');
                    creditSpan.html(credit);
                    $('#image').append($('<br />'));
                    $('#image').append(creditSpan);
                }
                $('#button_article_content_valid').css('display', 'block');
            }
        });        
        $( '#button_apply_video' ).click(function(){            
            $('#video').empty();
            var code = $('#video_embed').val();
            if(code && code.length>10) {
                $('#video').html(code);
                $('#button_article_content_valid').css('display', 'block');
            }
        });        
        $( '#button_article_content_valid').click(function(){
            var content = mds.composer.currentContent;
            if(content.type === mds.constant.CONTENT_TEXT) {
                content.html = $('#article_content_text').val();
                content.text = $('#article_content_text').val();
            } else if(content.type === mds.constant.CONTENT_IMAGE) {
                content.url = $('#image_url').val();
                content.w = $('#image_w').val();
                content.h = $('#image_h').val();
                content.credit = $('#image_credit').val();
                content.html = $('#image').html();
            } else if(content.type === mds.constant.CONTENT_MULTIMEDIA) {
                content.code = $('#video_embed').html();
                content.html = $('#video').html();
            } 
            $('#button_article_content_valid').css('display', 'none');
            mds.composer.checkContent();
        });        
        $('#button_article_content_valid').css('display', 'none');
    },
    /**
     * 
     * @returns {undefined}
     */
    clearContent: function(){
        mds.composer.articlesContent = [];
        $('#content_list').html('');
        $('#article_content_text').val('');
        $('#image_url').val('');
        $('#image_w').val('');
        $('#image_h').val('');
        $('#image').html('');
        $('#video_embed').val('');
        $('#video').html('');
        $('#article_content_text_id').css('display', 'none');
        $('#article_content_image_id').css('display', 'none');
        $('#article_content_video_id').css('display', 'none');
        mds.composer.checkContent();
        $('#left_panel').tabs( "disable" , mds.composer.PREVIEW_POS);
    },
    /**
     * 
     * @returns {unresolved}
     */
    checkAll: function() {
        var ready = mds.composer.check.geo 
        && mds.composer.check.article
        && mds.composer.check.content;
        mds.composer.setEnable('button_valid', ready);
        return ready;
    },
    /**
     * 
     * @returns {Boolean}
     */
    checkIndex: function() {
        
        var idx = mds.composer.articleIndex;
        if(idx < 0) {
            mds.composer.setEnable('button_prev', false);
            mds.composer.setEnable('button_next', false);
            mds.composer.setEnable('button_valid', false);
            mds.composer.setEnable('button_del', false);
            $('#article_index').html('..&nbsp;/&nbsp;..');
            return true;
        } else {
            var first = idx === 0;
            var last = idx === mds.composer.articles.length-1;
            mds.composer.setEnable('button_prev', !first);
            mds.composer.setEnable('button_next', !last);
            mds.composer.setEnable('button_valid', true);
            mds.composer.setEnable('button_del', true);
            return false;
        }
        
    },
    /**
     * 
     * @returns {undefined}
     */
    checkArticle: function() {
        var title = $('#article_titre').val();
        var author = $('#article_author').val();
        var fdCat = $('#fd_cat_selector option:selected').val();
        var srcNom = $('#article_source_selector option:selected').val();
        if(!srcNom || srcNom.length === 0) {
            srcNom = $('#article_src_custom').val();
        }
        var srcLink = $('#article_src_lien').val();
        var date = $('#article_date').val();
        
        var articleReady = (
            //            date && 
            date.length > 5 
            //            && title 
            && title.length > 5 
            //            && author 
            && author.length > 0 
            //            && srcLink 
            && srcLink.length > 5 
            //            && srcNom 
            && srcNom.length > 3
            //            && fdCat 
            && fdCat.length >= 3);
        mds.composer.setIcon('article', articleReady);
        mds.composer.check.article = articleReady;
        mds.composer.checkAll();
    },
    /**
     * 
     * @returns {undefined}
     */
    checkContent: function() {
        var contentReady = mds.composer.articlesContent.length > 0;
        if(contentReady) {
            $('#left_panel').tabs( "enable" , mds.composer.PREVIEW_POS);
        } 
        mds.composer.setIcon('content', contentReady);
        mds.composer.check.content = contentReady;
        mds.composer.checkAll();
    },
    /**
     * 
     * @returns {undefined}
     */
    checkGeo: function() {
        var geoReady = typeof(mds.composer.geoInfo) !== 'undefined';
        mds.composer.setIcon('geo', geoReady);
        mds.composer.check.geo = geoReady;
        mds.composer.checkAll();
    },
    /**
     * 
     * @param {type} id
     * @param {type} valid
     * @returns {undefined}
     */
    setIcon: function(id, valid) {
        $('#'+id+'_status_icon').attr('src', 
            valid? 'img/active.png': 'img/error.png');
    },
    /**
     * 
     * @returns {undefined}
     */
    newArticle: function(){
        var row = [
        undefined, 
        undefined, 
        undefined, 
        undefined, 
        undefined, 
        undefined, 
        undefined, 
        undefined];
        var index = mds.composer.articleIndex;
        mds.composer.clearAll();
        mds.composer.articles = [];
        mds.composer.articleIndex = -1;
        mds.composer.articles.splice(mds.composer.articleIndex + 1, 1, row);
        $('#left_panel').tabs( "select" , mds.composer.ARTICLE_POS);
        mds.composer.next();
    },
    /**
     * 
     * @param {type} index
     * @returns {undefined}
     */
    selectContent: function(index) {
        mds.composer.currentContent = mds.composer.articlesContent[index];
        if(mds.composer.currentContent.type === mds.constant.CONTENT_TEXT) {
            $('#text_decoration').css('display', 'block');
            $('#article_content_text_id').css('display', 'block');
            $('#article_content_image_id').css('display', 'none');
            $('#article_content_video_id').css('display', 'none');
            $('#article_content_text').val(mds.composer.currentContent.text);
            if(mds.composer.currentContent.bold) {
                $('#text_bold').attr('checked', 'checked');
            } else {
                $('#text_bold').removeAttr('checked');
            }
            if(mds.composer.currentContent.cite) {
                $('#text_cite').attr('checked', 'checked');
            } else {
                $('#text_cite').removeAttr('checked');
            }
        } else if (mds.composer.currentContent.type === mds.constant.CONTENT_IMAGE) {
            $('#text_decoration').css('display', 'none');
            $('#article_content_text_id').css('display', 'none');
            $('#article_content_image_id').css('display', 'block');
            $('#article_content_video_id').css('display', 'none');
            $('#image_url').val(mds.composer.currentContent.url);
            $('#image_w').val(mds.composer.currentContent.w);
            $('#image_h').val(mds.composer.currentContent.h);
            $('#image_credit').val(mds.composer.currentContent.credit);
            
        } else if (mds.composer.currentContent.type === mds.constant.CONTENT_MULTIMEDIA) {
            $('#text_decoration').css('display', 'none');
            $('#article_content_text_id').css('display', 'none');
            $('#article_content_image_id').css('display', 'none');
            $('#article_content_video_id').css('display', 'block');
            $('#video_embed').val(mds.composer.currentContent.code);
        }
    },
    /**
     * 
     * @param {type} id
     * @param {type} enable
     * @returns {undefined}
     */
    setEnable: function(id, enable) {
        if(enable) {
            $('#'+id).removeAttr('disabled');
        } else {
            $('#'+id).attr('disabled', 'disabled');
        }
    },
    /**
     * 
     * @returns {undefined}
     */
    previous: function() {
        if(mds.composer.articleIndex > 0 ) {
            mds.composer.displayArticle(mds.composer.articleIndex - 1);
            mds.composer.checkIndex();
            mds.composer.checkAll();
            mds.composer.updateEdited();
        }
    },
    /**
     * 
     * @returns {undefined}
     */
    next: function() {
        console.log('next');
        mds.composer.geoInfo = undefined;
        mds.composer.displayArticle(mds.composer.articleIndex + 1);
        mds.composer.checkIndex();
        mds.composer.checkAll();
        mds.composer.updateEdited();
    },
    /**
     * 
     * @param {type} rowid
     * @returns {String}
     */
    getArticleUpdateQuery: function(rowid) {
        var date = $('#article_date').datepicker( "getDate" );
        var cat = $('#fd_cat_selector option:selected').val();
        var srcName = $('#article_source_selector option:selected').html();
        if(srcName.length === 0) {
            srcName = $('#article_src_custom').val();
        }
        var geoInfo = mds.composer.geoInfo;
        var geom = '<Point><coordinates>'+geoInfo.lng+','+geoInfo.lat;
        geom += '</coordinates></Point>';
        var sql ='UPDATE '+mds.composer.tableArticle+' SET';
        sql += " ETAT='1'";
        sql += ", DATE='"+date.getTime()+"'";
        sql += ", ANNEE='"+date.getFullYear()+"'";
        sql += ", MOIS='"+date.getMonth()+"'";
        sql += ", TITRE='" + mds.common.escapeSQL($('#article_titre').val())+"'";
        sql += ", AUTEUR='" + mds.common.escapeSQL($('#article_author').val())+"'";
        //sql += ", LIEN='" + mds.common.escapeSQL($('#article_blog_lien').val())+"'";
        sql += ", SRC_LIEN='" + mds.common.escapeSQL($('#article_src_lien').val())+"'";
        sql += ", SRC_NOM='" + mds.common.escapeSQL(srcName)+"'";
        sql += ", FD_CAT='" + mds.common.escapeSQL(cat)+"'";
        if(geoInfo.update) {
            sql += ", GEO_CAT='"+mds.common.escapeSQL(geoInfo.cat)+"'";
            sql += ", GEO_INFO='"+mds.common.escapeSQL(geoInfo.detail)+"'";
            sql += ", COM='"+mds.common.escapeSQL(geoInfo.com)+"'";
            sql += ", DEP='"+mds.common.escapeSQL(geoInfo.dep)+"'";
            sql += ", REG='"+mds.common.escapeSQL(geoInfo.reg)+"'";
            sql += ", PAYS='"+mds.common.escapeSQL(geoInfo.pays)+"'";
            sql += ", LAT='"+geoInfo.lat+"'";
            sql += ", LNG='"+geoInfo.lng+"'";
            sql += ", GEOM='"+geom+"'";
        }
        sql += " WHERE ROWID='"+rowid+"';";
        return sql;
    },
    /**
     * 
     * @param {type} id
     * @returns {String}
     */
    getArticleCreateQuery: function(id) {
        
        var date = $('#article_date').datepicker( "getDate" );
        var cat = $('#fd_cat_selector option:selected').val();
        var srcName = $('#article_source_selector option:selected').html();
        if(srcName.length === 0) {
            srcName = $('#article_src_custom').val();
        }
        var geoInfo = mds.composer.geoInfo;
        var geom = '<Point><coordinates>'+geoInfo.lng+','+geoInfo.lat;
        geom += '</coordinates></Point>';
        var sql ='INSERT INTO '+mds.composer.tableArticle 
        + ' (ID,ETAT,DATE,ANNEE,MOIS,TITRE,AUTEUR,SRC_LIEN,SRC_NOM,FD_CAT,'
        + 'GEO_CAT,GEO_INFO,COM,DEP,REG,PAYS,LAT,LNG,GEOM) VALUES(';
        sql += "'"+id+"'";
        sql += ",'1'";
        sql += ",'"+date.getTime()+"'";
        sql += ",'"+date.getFullYear()+"'";
        sql += ",'"+date.getMonth()+"'";
        sql += ",'" + mds.common.escapeSQL($('#article_titre').val())+"'";
        sql += ",'" + mds.common.escapeSQL($('#article_author').val())+"'";
        //sql += ",'" + mds.common.escapeSQL($('#article_blog_lien').val())+"'";
        sql += ",'" + mds.common.escapeSQL($('#article_src_lien').val())+"'";
        sql += ",'" + mds.common.escapeSQL(srcName)+"'";
        sql += ",'" + mds.common.escapeSQL(cat)+"'";
        sql += ",'"+mds.common.escapeSQL(geoInfo.cat)+"'";
        sql += ",'"+mds.common.escapeSQL(geoInfo.detail)+"'";
        sql += ",'"+mds.common.escapeSQL(geoInfo.com)+"'";
        sql += ",'"+mds.common.escapeSQL(geoInfo.dep)+"'";
        sql += ",'"+mds.common.escapeSQL(geoInfo.reg)+"'";
        sql += ",'"+mds.common.escapeSQL(geoInfo.pays)+"'";
        sql += ",'"+geoInfo.lat+"'";
        sql += ",'"+geoInfo.lng+"'";
        sql += ",'"+geom+"');";
        return sql;
    },
    /**
     * 
     * @param {type} id
     * @returns {Array}
     */
    getContentCreateQuery: function(id) {
        
        var queries = [];
        for(i = 0; i < mds.composer.contentToDelete.length; i++) {
            queries.push({
                msg: "Suppression contenu #"+(i+1),
                sql: "DELETE FROM " + mds.composer.tableContenu+
                " WHERE rowid='"+mds.composer.contentToDelete[i].rowid+"'",
                update: true 
            });    
        }
        for(i = 0; i < mds.composer.articlesContent.length; i++) {
            var cont = mds.composer.articlesContent[i];
            if(cont.rowid) {
                queries.push({
                    msg: "Suppression contenu #"+(i+1),
                    sql: "DELETE FROM " + mds.composer.tableContenu+
                    " WHERE rowid='"+cont.rowid+"'",
                    update: true 
                });
            }
            var sql = "INSERT INTO " + mds.composer.tableContenu
            + " (ID, POS, TAG, DTYPE, DONNEE)"
            + " VALUES ('"+id+"', '"+i+"', 'p', '"+cont.type+"', '" 
            + mds.common.escapeSQL(cont.html)+"');"; 
            queries.push({
                msg: "Ajout contenu #"+(i+1),
                sql: sql,
                update: false
            });
        }
        return queries;
    },
    
    maxRetry: 2,
    
    nbSaveTry: 0,
    /**
     * 
     * @param {type} queryIndex
     * @param {type} queries
     * @returns {undefined}
     */
    saveContents: function(queryIndex, queries) {
        $( '#load_dialog' ).dialog( "option", "title", queries[queryIndex].msg );
        
        console.log('Content query: '+queries[queryIndex].sql);
        var SQLquery = queries[queryIndex].sql;
        mds.query.fusionTablePOST(
            SQLquery, 
            function(ftresult) {
                if(mds.query.checkSingleResult(SQLquery, ftresult)){
                    if(queryIndex < queries.length-1) {
                        setTimeout(function(){
                            mds.composer.saveContents(queryIndex+1, queries);
                        }, 300);
                    } else {
                        $( '#load_dialog' ).dialog( "option", "title", 'Sauvegarde terminée');
                        if(mds.composer.articles.length > 0 
                            && mds.composer.articleIndex < mds.composer.articles.length - 1) {
                            mds.composer.next();
                        } else {
                            mds.composer.clearAll();
                        }
                        setTimeout(function(){
                            $( '#load_dialog' ).dialog('close');
                            $('#left_panel').tabs( "select" , mds.composer.ARTICLE_POS);
                        }, 500);
                    }
                } else {
                    $( '#load_dialog' ).dialog('option', 'width', 800);
                    $( '#load_dialog' ).dialog('option', 'height', 600);
                    $('#load_dialog_msg').html('Erreur: sql='+queries[queryIndex]);
                }
            },
            function(status, error) {
                mds.composer.nbSaveTry ++;
                if(mds.composer.nbSaveTry <= mds.composer.maxRetry) {
                    setTimeout(function(){
                        mds.composer.saveContents(queryIndex, queries);
                    }, 300);
                } else {
                    mds.composer.handleError(status, error);
                }
            });
    },
    /**
     * 
     * @returns {unresolved}
     */
    saveArticle: function() {
        
        mds.composer.checkArticle();
        mds.composer.checkGeo();
        if(!mds.composer.checkAll()) {
            alert('La vérification des champs article a échoué!');
            return;
        }
        if(!mds.composer.currentArticle) {
            alert('CurrentArticle null!');
            return;
        }
        if(!mds.composer.geoInfo) {
            alert('GeoInfo null!');
            return;
        }
        var updateMsg;
        var sqlArtcle = '';
        var contenQueries = undefined;
        var rowid = mds.composer.currentArticle.rowid;
        var create = typeof(rowid) === 'undefined';
        var id;
        
        if(create) {
            id = new Date().getTime();
            updateMsg = "Création de l'article";
            sqlArtcle = mds.composer.getArticleCreateQuery(id);
        } else {
            id = mds.composer.currentArticle.id;
            updateMsg = "Mise à jour de l'article";
            sqlArtcle = mds.composer.getArticleUpdateQuery(rowid);
        }
        contenQueries = mds.composer.getContentCreateQuery(id);
        console.log('Article query: '+sqlArtcle);
        $( '#load_dialog' ).dialog( "option", "title", updateMsg );
        $( '#load_dialog' ).dialog('open');
        mds.composer.nbSaveTry = 1;
        mds.query.fusionTablePOST(
            sqlArtcle, 
            function(ftresult) {
                
                if(mds.query.checkSingleResult(sqlArtcle, ftresult)) {
                    mds.composer.saveContents(0, contenQueries);
                } else {
                    $( '#load_dialog' ).dialog('option', 'width', 800);
                    $( '#load_dialog' ).dialog('option', 'height', 600);
                    $('#load_dialog_msg').html('Erreur: sql='+sqlArtcle);
                }
            }, 
            mds.composer.handleError);
    },
    /**
     * 
     * @returns {undefined}
     */
    suppr: function() {
        $( '#load_dialog' ).dialog( "option", "title", 'Suppression de l\'article');
        $( '#load_dialog' ).dialog('open');
        var sql = "UPDATE " + mds.composer.tableArticle 
        + " SET ETAT='2' WHERE ROWID='" + mds.composer.currentArticle.rowid+"'";
        mds.query.fusionTablePOST(
            sql, 
            function(ftresult){
                $( '#load_dialog' ).dialog('close');
                if(mds.query.checkUpdate(ftresult, 1)) {
                    $( '#load_dialog' ).dialog( "option", "title", 'Article supprimé');
                    mds.composer.checkIndex();
                    if(mds.composer.articleIndex < mds.composer.articles.length-1) {
                        mds.composer.next();
                    }
                    setTimeout(function(){
                        $( '#load_dialog' ).dialog('close');
                    }, 700);
                } else {
                    alert('Erreur mise a jour:'+ res);
                }    
            }, 
            mds.composer.handleError);         
    },
    /**
     * 
     * @param {type} id
     * @returns {undefined}
     */
    loadArtciles: function(id) {
        $( '#load_dialog' ).dialog( "option", "title", 'Chargement des articles' );
        $( '#load_dialog' ).dialog('open');
        var sql = '';
        if(!id) {
            var status = $('#status_selector').val();
            sql+= "SELECT ID, DATE, TITRE, AUTEUR, SRC_NOM, SRC_LIEN, "+
            "ROWID, ETAT, FD_CAT, LAT, LNG"
            + " FROM " + mds.composer.tableArticle
            + " WHERE ANNEE=" + mds.composer.currentYear
            + " AND MOIS=" + mds.composer.currentMonth
            + " AND ETAT="+status
            //+ " AND EDITEUR='"+mds.composer.editor+"'"
            + " ORDER BY DATE ASC";
        } else {
            sql+= "SELECT ID, DATE, TITRE, AUTEUR, SRC_NOM, SRC_LIEN, "+
            "ROWID, ETAT, FD_CAT, LAT, LNG"
            + " FROM " + mds.composer.tableArticle
            + " WHERE ID=" + id;
        }        
        console.log('load articles: '+sql);
        mds.query.fusionTableGET(
            sql, 
            function(ftresult) {
                mds.composer.articleIndex = -1;
                mds.composer.articles = ftresult.rows;
                console.log('loadArticles res: '+mds.composer.articles.length);
                if(mds.composer.articles.length > 0) {
                    $('#left_panel').tabs( "select" , mds.composer.ARTICLE_POS);
                    mds.composer.setEnable('button_new', false);
                    mds.composer.next();
                }
                $( '#load_dialog' ).dialog('close');
            },
            mds.composer.handleError
            );
    },
    /**
     * 
     * @param {type} status
     * @param {type} error
     * @returns {undefined}
     */
    handleError: function(status, error) {
        console.log(status);
        console.log(error);
        alert('status= '+status+', error='+error);
    },
    /**
     * 
     * @param {type} source
     * @returns {undefined}
     */
    searchSource: function(source) {
        if(source && source.length > 5) {
            var srcSelection = undefined;
            $('#article_source_selector option').each(function(){
                var val = $(this).attr('value');
                if(typeof(srcSelection) === 'undefined' && val.length > 0 && 
                    source.indexOf(val) === 0) {
                    srcSelection = val;
                }
            });
            
            if(srcSelection) {
                $('#article_source_selector').val(srcSelection);
                if(mds.composer.currentArticle) {
                    mds.composer.currentArticle.src_nom = srcSelection;
                }
            } else {
                $('#article_source_selector').val('');
            }
        }
    },
    /**
     * 
     * @returns {undefined}
     */
    clearAll: function() {
        
        mds.composer.clearContent();
        mds.composer.geoInfo = undefined;
        
        $('#article_index_text').val('');
        $('#article_id_text').val('');
        $('#fd_cat_selector').val('');
        $('#article_titre').val('');
        $('#article_author').val('');
        $('#fd_cat_selector').val('');
        $('#article_date').val('');
        $('#article_src_lien').val('');
        $('#article_source_selector').val('');
        $('#article_src_custom').val('');
        //$('#article_blog_lien').val('');
        mds.composer.checkArticle();
        mds.composer.checkGeo();
        mds.composer.checkContent();
    },
    /**
     * 
     * @param {type} index
     * @returns {undefined}
     */
    displayArticle: function(index) {
        mds.composer.clearAll();
        mds.composer.setIcon('article', false);
        mds.composer.setIcon('content', false);
        if(index >= 0) {
            mds.composer.articleIndex = index;
            $('#article_index').html((index+1) + '&nbsp;/&nbsp;' + mds.composer.articles.length);
            mds.composer.currentArticle = new Object();
            mds.composer.currentArticle.id = mds.composer.articles[index][0];
            mds.composer.currentArticle.date = mds.composer.articles[index][1];
            mds.composer.currentArticle.titre = mds.composer.articles[index][2];
            mds.composer.currentArticle.auteur = mds.composer.articles[index][3];
            if(mds.composer.editor === mds.constant.SRC_WAT) {
                mds.composer.currentArticle.auteur = 'Waterman';
            }
            //mds.composer.currentArticle.lien = mds.composer.articles[index][4];
            mds.composer.currentArticle.src_nom = mds.composer.articles[index][4];
            mds.composer.currentArticle.src_lien = mds.composer.articles[index][5];
            mds.composer.currentArticle.rowid = mds.composer.articles[index][6];
            mds.composer.currentArticle.status = mds.composer.articles[index][7];

            var date = new Date(parseInt(mds.composer.currentArticle.date));
            $('#article_date').datepicker('setDate', date);
            $('#article_index_text').val(index+1);
            $('#article_id_link').attr('href', '../index.php?id='+mds.composer.currentArticle.id);
            $('#article_id_text').val(mds.composer.currentArticle.id);
            $('#article_titre').val(mds.composer.currentArticle.titre);
            $('#article_author').val(mds.composer.currentArticle.auteur);
            $('#article_src_lien').val(mds.composer.currentArticle.src_lien);
            //$('#article_blog_lien').val(mds.composer.currentArticle.lien);
            mds.composer.searchSource(mds.composer.currentArticle.src_lien);
            
            $('#geo_search').val('');
            if(mds.composer.marker) {
                mds.composer.marker.setVisible(false);
            }
            mds.composer.map.panTo(mds.composer.DEFAULT_LOCATION);
            mds.composer.map.setZoom(mds.composer.DEFAULT_ZOOM);
            $('#geo_result').html('');
            $('#fd_cat_selector').val('');
            mds.composer.displayIFrame();
        } 
    },
    /**
     * 
     * @returns {undefined}
     */
    updateEdited: function() {
        $('#article_preview').html('');
        mds.composer.contentToDelete = [];
        mds.logging.logText('');
        if(mds.composer.currentArticle.status === mds.constant.LIST_EDITED
            || mds.composer.currentArticle.status === mds.constant.LIST_REEDIT) {
            var index = mds.composer.articleIndex;
            //UPDATE AUTHOR
            $('#article_author').val(mds.composer.articles[index][3]);
            //UPDATE CATEGORY
            $('#fd_cat_selector').val(mds.composer.articles[index][9]);
            mds.composer.checkArticle();
            //UPDATE GEO
            var currentLocation = new google.maps.LatLng(
                parseFloat(mds.composer.articles[index][10]),
                parseFloat(mds.composer.articles[index][11])
                );
            if(!mds.composer.marker) {
                mds.composer.marker = new google.maps.Marker({
                    map: mds.composer.map,
                    position: currentLocation,
                    draggable: false
                });
            } else {
                mds.composer.marker.setPosition(currentLocation);
                mds.composer.marker.setVisible(true);
            }
            mds.composer.map.setZoom(mds.composer.SEARCH_ZOOM);
            mds.composer.map.setCenter(currentLocation);
            mds.composer.geoInfo = {
                update: false
            };
            mds.composer.checkGeo();
            var sql = 'SELECT ROWID, POS, DTYPE, DONNEE FROM '+ mds.composer.tableContenu+
            ' WHERE ID='+mds.composer.currentArticle.id+' ORDER BY POS ASC';
            mds.query.fusionTableGET(
                sql, 
                function(ftresult){
                    var rows = ftresult.rows;
                    $('#content_list').html('');
                    mds.composer.articlesContent = [];
                    for(n = 0; n < rows.length; n++) {
                        var type = rows[n][2];
                        var articleContent = {
                            type: type,
                            html: rows[n][3],
                            rowid: rows[n][0]
                        };
                        var size = $('#content_list option').size();
                        var html = $('#content_list').html();
                        html += '<option value="' + size + '">Contenu#' 
                        + (size+1) + ' (' + type +')</option>';

                        $('#content_list').html(html);
                        if(type === mds.constant.CONTENT_TEXT) {
                            articleContent.text = articleContent.html;
                        
                            $('#article_content_text').empty();
                        } else if(type === mds.constant.CONTENT_IMAGE) {
                            var cont = $(articleContent.html);
                            var img = $(cont.get(0));
                            var credit = $(cont.get(2));
                            articleContent.url = img.attr('src');
                            articleContent.w = img.attr('width');
                            articleContent.h = img.attr('height');
                            articleContent.credit = credit.html();
                            $('#image').empty();
                        } else if(type === mds.constant.CONTENT_MULTIMEDIA) {
                            articleContent.code = articleContent.html;
                        
                            $('#video').empty();
                        }
                        mds.composer.articlesContent.push(articleContent);
                    }
                    mds.composer.checkContent();
                    mds.composer.checkAll();
                }, 
                mds.composer.handleError);
        }
    },
    /**
     * 
     * @param {type} origin
     * @returns {undefined}
     */
    displayIFrame: function(origin) {
        var link;
        if(origin) {
            link = origin;
        } else {
            if(mds.composer.currentArticle.src_lien && mds.composer.currentArticle.src_lien.length > 0 ) {
                link = mds.composer.currentArticle.src_lien;
            } else {
                link = mds.composer.currentArticle.lien;
            }
        }
        var html = '';
        var valid_link = (link && link.length > 0);
        //http://you.leparisien.fr/actu/2010/07/02/photos-incendie-de-voitures-a-melun-2228.html
        var black_listed = valid_link 
        && (link.indexOf("http://www.leparisien.fr") >= 0
            || link.indexOf("http://you.leparisien.fr") >= 0
            || link.indexOf("http://www.lepoint.fr") >= 0);
        
        if(valid_link && ! black_listed) {
            
            html += '<iframe';
            html += ' src="' + link + '" ';            
            html += ' style="width: 100%; height: 100%;" ';
            html += '>';
            html += '</iframe>';
            
        } else {
            html += '<div';
            html += ' style="background: white;" >';
            if(black_listed) {
                html += '<div style="margin: 10px;"><img src="img/error.png"/><br /><strong>Le site ne peut être affiché correctement.</strong><br />'
                + 'Cliquer sur le lien suivant pour ouvrir la page dans un nouvel onglet.<br />'
                + '<a href="'+link+'" target="_blank">';
                if(mds.composer.currentArticle.src_nom) {
                    html+= mds.composer.currentArticle.src_nom;
                } else {
                    html += "Lien";
                }
                html += "</a></div>";
            } else {
                html += 'Article non disponible';
                html += '<img src="img/construction.png" ></img>';  
            }
            html += '</div>';
        }
        $('#article_frame').html(html);
    },
    /**
     * 
     * @param {type} geoComps
     * @param {type} location
     * @returns {Object}
     */
    parseGeoInfo: function(geoComps, location) {
        var geoResult = new Object();
        geoResult.loc = location;
        var geoTemp = new Object();
        for(i = 0; i < geoComps.length; i++){
            geoTemp[geoComps[i].types[0]] = mds.common.removeDiacritics(geoComps[i].long_name).toUpperCase();
        }
        if(geoTemp['country']) {
            geoResult.pays = geoTemp['country'];
            geoResult.cat = mds.constant.GEO_CAT['GEO_PAYS'];
            delete geoTemp['country'];
        }
        if(geoTemp['administrative_area_level_1']) {
            geoResult.region = geoTemp['administrative_area_level_1'];
            geoResult.cat = mds.constant.GEO_CAT['GEO_REG'];
            delete geoTemp['administrative_area_level_1'];
        }
        if(geoTemp['administrative_area_level_2']) {
            geoResult.dep = geoTemp['administrative_area_level_2'];
            geoResult.cat = mds.constant.GEO_CAT['GEO_DEP'];
            delete geoTemp['administrative_area_level_2'];
        }
        if(geoTemp['locality']) {
            geoResult.com = geoTemp['locality'];
            geoResult.cat = mds.constant.GEO_CAT['GEO_COM'];
            delete geoTemp['locality'];
        }
        if(geoTemp['neighborhood']) {
            geoResult.cat = mds.constant.GEO_CAT['GEO_QUART'];
            geoResult.sub = geoTemp['neighborhood'];
            delete geoTemp['neighborhood'];
        }
        if(geoTemp['sublocality']) {
            geoResult.cat = mds.constant.GEO_CAT['GEO_ARRD'];
            geoResult.sub = geoTemp['sublocality'];
            delete geoTemp['sublocality'];
        }
        if(geoTemp['route']) {
            geoResult.cat = mds.constant.GEO_CAT['GEO_RUE'];
            geoResult.detail = geoTemp['route'];
            delete geoTemp['route'];
        }
        if(geoTemp['street_number']) {
            geoResult.cat = mds.constant.GEO_CAT['GEO_ADDR'];
            geoResult.detail = geoTemp['street_number']+', '+geoResult.detail;
            delete geoTemp['street_number'];
        }
        if(geoTemp['postal_code']) {
            geoResult.id = geoTemp['postal_code'];
            delete geoTemp['postal_code'];
        }
        for(id in geoTemp) {
            if(geoResult.poi) {
                alert("Le POI existe deja: poi="+geoResult.poi+", nouveau="+geoTemp[id]);
                console.log(geoTemp);
            }
            geoResult.cat = mds.constant.GEO_CAT['GEO_POI'];
            geoResult.poi = geoTemp[id];
        }
        return geoResult;
    },
    /**
     * 
     * @param {type} geoComps
     * @param {type} location
     * @returns {mds.composer.simpleParseGeoInfo.geoResult}
     */
    simpleParseGeoInfo: function(geoComps, location) {
        var geoResult = {
            update: true
        };
        geoResult.lat = location.lat();
        geoResult.lng = location.lng();
        var geoTemp = new Object();
        for(i = 0; i < geoComps.length; i++){
            geoTemp[geoComps[i].types[0]] = mds.common.removeDiacritics(geoComps[i].long_name).toUpperCase();
        }
        if(geoTemp['country']) {
            geoResult.pays = geoTemp['country'];
        }
        if(geoTemp['locality']) {
            geoResult.com = geoTemp['locality'];
        }
        return geoResult;
    },
    /**
     * 
     * @param {type} info
     * @returns {undefined}
     */
    validGeoInfo: function(info) {

        var sql = "SELECT * FROM " + mds.composer.tableCOG;  
        if(info.com) {   
            sql += " WHERE COM LIKE '" + mds.common.escapeSQL(info.com)+"'";
            if(info.dep) {
                sql += " AND DEP LIKE '" + mds.common.escapeSQL(info.dep) + "'";
            } else if(info.reg)
                sql += " AND REG LIKE '" + mds.common.escapeSQL(info.reg) + "'";
        } else if (info.dep){

            sql += " WHERE DEP = '" + mds.common.escapeSQL(info.dep) + "' LIMIT 1";
        } else if (info.reg){

            sql += " WHERE REG = '" + mds.common.escapeSQL(info.reg) + "' LIMIT 1";
        } else {
            alert('ValidGeoInfo: verification impossible');
            console.log(info);
        }
        console.log(sql);
        
        mds.query.fusionTableGET(sql, function(res){
            var cogs = res.rows;
            if(cogs.length === 1) {
                mds.composer.geoInfo = {
                    update: true
                };
                mds.composer.geoInfo.lat = info.loc.lat();
                mds.composer.geoInfo.lng = info.loc.lng();
                mds.composer.geoInfo.cat = info.cat;
                var cog = cogs[0];
                mds.composer.geoInfo.pays = info.pays;
                if(info.cat > 0) {
                    mds.composer.geoInfo.reg = cog[0]+';'+cog[1];
                }
                if(info.cat > 1) {
                    mds.composer.geoInfo.dep = cog[2]+';'+cog[3];
                }
                if(info.cat > 2) {
                    mds.composer.geoInfo.com = cog[4]+';'+cog[5];
                    mds.composer.geoInfo.cp = cog[6];
                }
                if(info.cat > 3 && info.cat < 6) {
                    mds.composer.geoInfo.detail = info.sub;
                //                    if(info.cat == 5) {
                //                        var arrNum = parseInt(info.sub)+'';
                //                        mds.composer.geoInfo.detail = cog[2]+ mds.common.addZero(arrNum, 3)+";"+info.sub;
                //                    }
                }
                if(info.cat > 5 && info.cat < 8) {
                    mds.composer.geoInfo.detail = info.detail;
                }
                if(info.cat > 7 ) {
                    mds.composer.geoInfo.detail = info.poi;
                }
                for(cat in mds.constant.GEO_CAT) {
                    if(mds.constant.GEO_CAT[cat] === info.cat) {
                        mds.composer.geoInfo.cat = cat;
                        break;
                    }
                }
            } else {
                alert('Non trouve dans le COG');
            }
            mds.composer.checkGeo();
        },mds.composer.handleError);
    },
    /**
     * 
     * @returns {undefined}
     */
    geoSearch: function() {
        
        mds.composer.geoInfo = undefined;
        mds.composer.checkGeo();
        var searchString = $('#geo_search').val();
        mds.composer.geocoder.geocode({
            address: searchString,
            region: 'FR'
        }, 
        function(results, status){
            if(status === google.maps.GeocoderStatus.OK) {
                var searchResult = results[0];
                var currentLocation = searchResult.geometry.location;
                mds.composer.map.panTo(currentLocation);
                mds.composer.map.setZoom(mds.composer.SEARCH_ZOOM);
                if(!mds.composer.marker) {
                    mds.composer.marker = new google.maps.Marker({
                        map: mds.composer.map,
                        position: currentLocation,
                        draggable: false
                    });
                //                    google.maps.event.addListener(mds.composer.marker, 'dragend', function(mouseEvent){
                //                        if(mds.composer.geoInfo) {
                //                            console.log('Old position: '+mds.composer.geoInfo.lat+', '+mds.composer.geoInfo.lng);
                //                            mds.composer.geoInfo.lat = mds.composer.marker.getPosition().lat();
                //                            mds.composer.geoInfo.lng = mds.composer.marker.getPosition().lng();
                //                            console.log('New position: '+mds.composer.geoInfo.lat+', '+mds.composer.geoInfo.lng);
                //                        }
                //                    });
                } else {
                    mds.composer.marker.setPosition(currentLocation);
                    mds.composer.marker.setVisible(true);
                }
                var table = '<table id="geo_table">';
                var verify = true;
                var addrComps = searchResult.address_components;
                for(var i=0; i<addrComps.length; i++) {
                    if(addrComps[i].types[0] && addrComps[i].types[0] === 'country') {
                        if(addrComps[i].long_name !== 'France') {
                            verify = false;
                        }
                    }
                    table += '<tr id="geo_row">';
                    table += '<td id="geo_cell_title">';
                    for(t=0; t < addrComps[i].types.length; t++) {

                        table += addrComps[i].types[t];
                        if(t < addrComps[i].types.length-1) {
                            table += ';'; 
                        }
                    }
                    table += '</td>';
                    table += '<td id="geo_cell_val">';
                    table += addrComps[i].long_name;
                    table += '</td>';
                    table += '</tr>';
                }
                table += '</table>';
                $('#geo_result').html(table);
                if(verify) {
                    mds.composer.validGeoInfo(mds.composer.parseGeoInfo(addrComps, currentLocation));
                } else {
                    mds.composer.geoInfo = mds.composer.simpleParseGeoInfo(addrComps, currentLocation);
                    mds.composer.checkGeo();
                }
            } else {
                if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                    $('#geo_result').html('Pas de résultat');
                } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT ) {
                    $('#geo_result').html('Capacite dépasée');
                } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED ) {
                    $('#geo_result').html('Requete interdite');
                } else if (status === google.maps.GeocoderStatus.INVALID_REQUEST  ) {
                    $('#geo_result').html('Requete invalide');
                }
            }
        });
    },
    /**
     * 
     * @returns {undefined}
     */
    validPress: function() {
        var name = $('#press_name').val();
        var link = $('#press_link').val();
        var sql = "INSERT INTO "+mds.composer.tablePresse + " (NOM, LIEN) VALUES ('" 
        + mds.common.escapeSQL(name)+"', '"+mds.common.escapeSQL(link)+"')";
        $('#press_info').html('Validation en cours...');
        mds.query.fusionTablePOST(
            sql, 
            function(res){
                if(mds.query.checkInsert(res, 1)) {
                    $('#edit_info').html('Réussi, rechargement des sources..');
                    mds.composer.loadPresse();
                    setTimeout(function(){
                        $( '#press_dialog' ).dialog('close');
                    }, 600);
                } else {
                    $('#edit_info').html('Echec!');
                }
            }, mds.composer.handleError
        );
    },
    /**
     * 
     * @returns {undefined}
     */
    initLogin: function() {
        $('#login_input').css('display', 'none');
        $('#login_info').html('Vérification compte...');
        $('#login_dialog').dialog('open');
        mds.auth.checkAccount($('#account_checker'), function(res) {
            if(res) {
                $( '#account_checker' ).css('display', 'none');
                $( '#login_info' ).html('Authentification...');
                mds.composer.login();
            } else {
                $( '#login_info' ).html('Compte gmail inaccessible!');
            }
        });
    },
    /**
     * 
     * @returns {undefined}
     */
    login: function() {
        if(localStorage) {
            this.clientId = localStorage.getItem(mds.composer.GOOGLE_CLIENTID);
            this.apiKey = localStorage.getItem(mds.composer.GOOGLE_APIKEY);
            if(this.clientId && this.apiKey) {
                this.getCredential();
            } else {
                $('#login_dialog').dialog('option', 'height', 350);
                $('#login_input').css('display', 'block');
                $('#login_btn').click(function() {
                    mds.composer.clientId = $('#login_clientid').val();
                    localStorage.setItem(mds.composer.GOOGLE_CLIENTID, mds.composer.clientId);
                    mds.composer.apiKey = $('#login_apikey').val();
                    localStorage.setItem(mds.composer.GOOGLE_APIKEY, mds.composer.apiKey);
                    mds.composer.getCredential();
                });
            }
        } else {
            $( '#login_info' ).html('Fonction stockage non présente(localstorage)');
        }
    }, 
    /**
     * 
     * @returns {undefined}
     */
    getCredential: function() {
        var scope = 'https://www.googleapis.com/auth/fusiontables';
        mds.auth.authorize(this.apiKey, this.clientId, scope, function(res){
            if(res && res.expiration) {
                mds.query.loginInfo = res;
                $('#login_info').html('Utilisateur authentifié');
                setTimeout(function() {
                    $('#login_dialog').dialog('close');
                    mds.composer.initDB();
                }, 1000);
                setTimeout(function() {
                    mds.composer.getCredential();
                }, res.expiration*900);
                
            }
        });
    }
};
