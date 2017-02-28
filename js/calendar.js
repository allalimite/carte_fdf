if( typeof( mds ) === "undefined" ) mds = {};

mds.calendar = {
    
    dialog: undefined,
    menuIndex: undefined,
    
    stats: undefined,
    
    containerId: 'calendar_container',
    tableId: 'calendar_table',
    //statId: 'calendar_stat',
    
    yearRowClass: 'calendar_year_row_class',
    monthRowClass: 'calendar_month_row_class',
    articleRowClass: 'calendar_article_row_class',
    
    yearDataClass: 'calendar_year_data_class',
    montDataClass: 'calendar_month_data_class',
    articleDataClass: 'calendar_article_data_class',
    iconDataClass: 'calendar_icon_data_class',
    loadContent: '',
    select: undefined,
    loadCallBack: undefined,
    
    create: function(selector) {
        
        mds.calendar.loadContent = '<p align="center">'
        +'<strong>Chargement en cours</strong>'
        +'</p>';
    
        mds.calendar.loadContent += '<p align="center">'
        +'<img src="img/vloader.gif"/>'
        +'</p>';
        var container = $('<div></div>');
        container.attr('id', mds.calendar.containerId);
        selector.append(container);
        mds.calendar.dialog = selector.dialog({
            draggable: true, 
            resizable: true, 
            autoOpen: false, 
            position: ['center', 45],
            title: 'Calendrier', 
            width: 500, 
            height: 150,
            open: function() {
                mds.calendar.loadCalendar();
            },
            close: function() {
                if(mds.calendar.menuIndex != undefined) {
                    mds.menu.setItemState(mds.calendar.menuIndex, false);
                }
            }
        });
    },
    
    loadCalendar: function() {
        var calContainer = $('#'+mds.calendar.containerId);
        calContainer.html(mds.calendar.loadContent);
        var sql = "SELECT ANNEE, MOIS, FD_CAT, COUNT() FROM "
            + mds.map.articleTable + " WHERE ETAT='1' GROUP BY 'ANNEE', 'MOIS', 'FD_CAT' ORDER BY ANNEE DESC";
            
        mds.common.fusionTableQuery(sql, function(rows){
            //Création de l'objet stat
            var table = $('<table></table>');
            table.attr('id', mds.calendar.tableId);
            var periods = new Object();
            for(i=0; i<rows.length; i++) {
                var year = rows[i][0]+'';
                var month = rows[i][1]+'';
                var cat= rows[i][2]+'';
                var count = rows[i][3]+'';
                if( !periods[year] ) {
                    periods[year] = new Object();
                }
                if( !periods[year][month] ) {
                    periods[year][month] = new Object();
                    periods[year][month].count = 0;
                }
                if( !periods[year][month][cat] ) {
                    periods[year][month][cat] = new Object();
                }
                periods[year][month][cat].count = parseFloat(count);
                periods[year][month].count += parseFloat(count);
            }
            //On calcul le max
            var max = 0;
            for(_year in periods) {
                for(_month in periods[_year]) {
                    if(periods[_year][_month].count > max) {
                        max = periods[_year][_month].count;
                    }
                }
            }
            //Mise à jour de la table
            var yearRow = $('<tr></tr>')
                .attr('align', 'center')
                .attr('class', mds.calendar.yearRowClass);
            var monthRow = $('<tr></tr>')
            .attr('class', mds.calendar.monthRowClass)
//            .attr('width', '100px')
            .attr('VALIGN', 'MIDDLE');
            var articleRow = $('<tr></tr>').attr('class', mds.calendar.articleRowClass);
            var backYears = [];
            for(_y in periods) {
                backYears.push(parseInt(_y));
            }
            backYears.sort(mds.calendar.sortInt);
            var len = backYears.length;
            for(k=len-1; k>=0 ;k--) {
                year = backYears[k]+"";
//            for(year in periods) {
                //YEAR ROW
                var nmonth = 0;
                for(mnth in periods[year]) {
                    nmonth ++;
                }
                var yearData = $('<td></td>')
                    .attr('colspan', nmonth*2)
                    .attr('class', mds.calendar.yearDataClass)
                    .attr('align', 'center');
                var yearText = $('<span></span>')
                    
                    .css("float", "left")
                    .html(year);
                var yearLoad = $('<span></span>')
                    .attr('class', 'ui-state-default ui-corner-all')
                    .attr('title', 'Voir sur la carte')
                    .css('margin-left', '10px')
                    .css('float', 'left')
                    .html('<span class="ui-icon ui-icon-search"></span>');
                var yearStat = $('<span></span>')
                    .attr('class', 'ui-state-default ui-corner-all')
                    .css('margin-left', '10px')
                    .css('float', 'left')
                    .attr('title', 'Voir les statistiques')
                    .html('<span class="ui-icon ui-icon-contact"></span>')
                    .click(
                        mds.calendar.getCalendarYearStat(year, periods[year])
                    );
                
                yearLoad.click (
                    mds.calendar.hanleSelection(year, undefined)
                );
                var yearSpan = $('<span></span>')
                    .css("padding-left", "10px")
                    .css("padding-right", "10px")
                    .css("width", "130px")
                    .css('display', 'inline-block');
                yearSpan.append(yearText);
                yearSpan.append(yearLoad);
                yearSpan.append(yearStat);
                yearData.append(yearSpan);
                yearRow.append(yearData);
                var monthArray = [];
                for(month in periods[year]) {
                    monthArray.push(parseInt(month));
                }
                monthArray.sort(mds.calendar.sortInt);
                var monthLen = monthArray.length;
                for(mi=monthLen-1; mi>=0; mi--) {
//                for(month in periods[year]) {
                    month = monthArray[mi]+"";
                    var nbMonth = periods[year][month].count;
                    periods[year][month].stat = new Object();
                    periods[year][month].stat.count = nbMonth;
                    for(cat in periods[year][month]){
                        if(cat != 'count' && cat != 'stat') {
                            var nbClasse = periods[year][month][cat].count;
                            var classe = mds.constant.FD_CATEGORY[cat].classe;
                            var _fdClasse = mds.constant.FD_CLASS[classe];
                            if(!periods[year][month].stat[_fdClasse.text]) {
                                periods[year][month].stat[_fdClasse.text] = new Object();
                                periods[year][month].stat[_fdClasse.text].color = _fdClasse.color;
                                periods[year][month].stat[_fdClasse.text].index = _fdClasse.index;
                                periods[year][month].stat[_fdClasse.text].count = 0;
                            }
                            periods[year][month].stat[_fdClasse.text].count += nbClasse;
                        }
                    }
                    //MONTH ROW
                    var monthIconData = $('<td></td>');
                    monthIconData.attr('class', mds.calendar.iconDataClass);
                    
                    var monthIcon = $('<div></div>');
                    monthIcon.attr('class', 'ui-state-default ui-corner-all');
                    monthIcon.attr('title', 'Voir sur la carte');
                    monthIcon.html('<span class="ui-icon ui-icon-search"></span>');
                    monthIconData.append(monthIcon);
                    monthRow.append(monthIconData);
                    monthIcon.click(mds.calendar.hanleSelection(year, month));
                    
                    var monthData = $('<td></td>');
//                    monthData.attr('class', mds.calendar.montDataClass);
                    monthData.attr('width', 200);
                    
                    monthData.html(mds.constant.MONTHS[month+'']);
                    monthRow.append(monthData);
                    
                    //ARTICLEROW
                    var artIconData = $('<td></td>');
                    artIconData.attr('class', mds.calendar.iconDataClass);
                    var artIcon = $('<div></div>');
                    artIcon.attr('class', 'ui-state-default ui-corner-all');
                    artIcon.attr('title', 'Voir les statistiques');
                    artIcon.html('<span class="ui-icon ui-icon-contact"></span>');
                    artIconData.append(artIcon);
                    articleRow.append(artIconData);
                    artIcon.click(
                        mds.calendar.getCalendarStat(year, month, periods[year][month].stat)
                    );
                    var articleData = $('<td></td>');
                    articleData.attr('class', mds.calendar.viewDataClass);
                    articleData.html(periods[year][month].count+' articles');
                    articleRow.append(articleData);
                    
                }
            }
            table.append(yearRow);
            table.append(monthRow);
            table.append(articleRow);
            calContainer.empty();
            calContainer.append(table);
            mds.calendar.stats = periods;
            if(mds.calendar.loadCallBack !== undefined) {
                mds.calendar.loadCallBack();
            }
        });
        
    },
    
    init: function() {
        mds.calendar.menuIndex = mds.menu.addButton('Calendrier', function(){
            mds.calendar.dialog.dialog('open');
//            var left = mds.calendar.dialog.parent().css('left');
//            var positions = [parseInt(left), 40];
//            mds.calendar.dialog.dialog( "option", "position", positions );
            
        }, function(){
            mds.calendar.dialog.dialog('close');
        });
    },
    
    getCalendarStat: function(year, month, stats) {
        return function() {
            //console.log('getCalendarStat '+month+'/'+year);
            mds.stat.setStatInfo(year, month, stats);
        };
    },
    getCalendarYearStat: function(year, stats) {
        return function() {
            //console.log('getCalendarStat '+month+'/'+year);
            var statRes = {count: 0};
            for(month in stats) {
                
                for(cat in stats[month].stat) {
                    if(cat !== "count") {
                        statRes.count += stats[month].stat[cat].count;
                        if(!statRes[cat]) {
                            statRes[cat] = {count: stats[month].stat[cat].count};
                        } else {
                            statRes[cat].count += stats[month].stat[cat].count;
                        }
                    }
                    
                }
            }
            mds.stat.setStatInfo(year, undefined, statRes);
        };
    },
    hanleSelection: function(year, month) {
        
        return function() {
            //console.log('hanleSelection '+month+'/'+year);
            if(mds.calendar.select) {
                mds.general.first = false;
                mds.calendar.select(year, month);
            }
        };
    },
    sortInt: function(a, b) {
        return a-b;
    }
};
