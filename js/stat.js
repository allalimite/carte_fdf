if( typeof( mds ) == "undefined" ) mds = {};

mds.stat = {
    
    dialog: undefined,
    containerId: "calendar_stat_id",
    year: undefined,
    month: undefined,
    stats: undefined,
    drawn: false,
    
    create: function(selector) {
        
        var container = $('<div></div>');
        container.attr('id', mds.stat.containerId);
        selector.append(container);
        mds.stat.dialog = selector.dialog({
            position: ['right', 45],
            draggable: true, 
            resizable: false, 
            autoOpen: false, 
            title: 'Statistiques', 
            width: 290, 
            height: 230
        });
    },
    
    setStatInfo: function(year, month, stats) {
        mds.stat.year = year;
        mds.stat.month = month;
        mds.stat.stats = stats;
        mds.stat.displayStat();
    },
    
    displayStat: function() {
        mds.stat.dialog.dialog('open');
        var left = mds.stat.dialog.parent().css('left');
        var top = mds.stat.dialog.parent().css('top');
        if(parseInt(top) == 0) {
            var positions = [parseInt(left), 40];
            mds.stat.dialog.dialog( "option", "position", positions );
        }
        var title = '';
        if(mds.stat.month != undefined){
            title += ' ' + mds.constant.MONTHS[mds.stat.month];
        }
        if(mds.stat.year){
            title += ' ' + mds.stat.year;
        }
        title += ': '+mds.stat.stats.count+' article(s)';
        mds.stat.dialog.dialog('option', 'title', title);
        mds.chart.createCalendarChart(mds.stat.stats, $('#'+mds.stat.containerId));
        
//        
    }
}

