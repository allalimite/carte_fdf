if( typeof( mds ) === "undefined" ) mds = {};

mds.general = {
    
    currentYear: undefined,
    currentMonth: undefined,
    first: true,
    embedded: false,
    
    loadDate: function(year, month) {
        mds.general.currentYear = year;
        mds.general.currentMonth = month;
        var title = 'Carte de la délinquance - ';
        if(month !== undefined) {
            title += mds.constant.MONTHS[month]+' ';
        }
        if(year) {
            title += year + '';
        }
        $('#page_header').html(title);
        mds.map.displayMap(year, month);
        mds.heatmap.displayMap(year, month);
        if(mds.general.first) {
            mds.map.loadCallBack = function() {
                mds.menu.openMenu();
                //mds.menu.items[mds.heatmap.menuIndex].primaryAction();
                mds.menu.items[mds.legend.menuIndex].primaryAction();
                mds.map.loadCallBack = undefined;
                mds.calendar.loadCalendar();
            };
            mds.calendar.loadCallBack = function() {
                var statFunc = undefined;
                if(month !== undefined) {
                    statFunc = mds.calendar.getCalendarStat(year, month, mds.calendar.stats[year][month].stat);
                } else {
                    statFunc = mds.calendar.getCalendarYearStat(year, mds.calendar.stats[year]);
                }
                mds.calendar.loadCallBack = undefined;
                if(statFunc !== undefined) {
                    statFunc();
                }
                mds.general.first = false;
            };
        }
        
    },
    
    goToCity: function(city) {
        mds.localization.geoCoder.geocode({
            address: city,
            region: '.eu',
            language: 'fr'
        },function(results, status){
            if(status === google.maps.GeocoderStatus.OK) {
                var pos = results[0].geometry.location;
                mds.map.gotoPosition(pos, 12);
            } 
        });
    },
    
    filterCategory: function(filter) {
        
        var fdclass = mds.constant.FD_CLASS[filter.toUpperCase()];
        if(fdclass !== undefined) {
            var cat = fdclass.index;
            mds.legend.setFilterSelection(cat);
            mds.map.setLayerFilter(cat+"");
        } else {
            mds.logging.console('Catégorie incorrecte: '+filter);
        }
    },
    
    loadId: function(id) {
        mds.map.displayId(id);
    },
    
    loadDefaultDate: function() {
        var curDate = new Date();
        mds.general.loadDate(curDate.getUTCFullYear(), undefined);
    },
    
    checkBrower: function() {
        var browser = $.browser;
        var ver = browser.version;
        var nums = ver.split('.');
        var upper = 0;
        if(nums.length > 1) {
            upper = parseInt(nums[0]);
        }
        var lower = 0;
        if(nums.length > 1) {
            lower = parseInt(nums[1]);
        }
        if(browser.webkit) {
            //console.log("check for webkit v-"+browser.version);
            return {
                name: 'Safari ou Chrome',
                version: browser.version,
//                ready: upper >= 533,
                ready: true,
                recommandation: {
                    Safari: 'http://www.apple.com/fr/safari/',
                    Chrome: 'http://www.google.fr/chrome'
                }
            };
        } else if(browser.msie) {
            //console.log("check for ie v-"+browser.version);
            return {
                name: 'Internet Explorer',
                version: browser.version,
                ready: upper >= 7,
                recommandation: {
                    InternetExplorer: 'http://www.microsoft.com/france/windows/internet-explorer/telecharger-ie9.aspx'
                }
            };
        } else if(browser.mozilla) {
            //console.log("check for ie v-"+browser.version);
            return {
                name: 'Mozilla',
                version: browser.version,
                ready: upper >= 2,
                recommandation: {
                    Firefox: 'http://www.mozilla.org/fr/firefox/new/'
                }
            };
        } else if(browser.opera) {
            //console.log("check for ie v-"+browser.version);
            return {
                name: 'Opera',
                version: browser.version,
                ready: upper >= 10,
                recommandation: {
                    Opera: 'http://www.opera.com/'
                }
            };
        } else {
            return {
                ready: true
            };
        }
    },
    
    init:function () {  
        if(mds.general.embedded) {
            mds.general.first = false;
            $('#main_bar').hide();
            $('#map').css('height', '100%');
        }  
        mds.general.initMenu($('#menu'));
        $( '#load_dialog' ).dialog({
            title: 'Chargement en cours...',
            width: 230,
            height: 110,
            autoOpen: false,
            resizable: false,
            modal: true,
            draggable: false
        });
        mds.map.initMap($('#menu'), $('#map'));
        mds.calendar.select = function(year, month) {
            mds.general.loadDate(year, month);
        }
        
    },
    
    initMenu: function (selector) {
//        mds.theme.create($('#theme_dialog'));
        mds.menu.create(selector);
        mds.menu.init();
        mds.localization.create($('#localization_dialog'));
        mds.calendar.create($('#calendar_dialog'));
        mds.stat.create($('#stat_dialog'));
        mds.legend.create($('#legend_dialog'));
        //mds.heatmap.create($('#heatmap_dialog'));
        mds.calendar.init();
        mds.localization.init();
        //mds.heatmap.init();
        mds.legend.init();
//        mds.theme.init();
        //CREDIT
        var creditIndex = mds.menu.addButton(
        'Crédits', 
        function(){
            $('#credit').dialog('open');
            mds.menu.closeMenu();
        }, 
        function(){
            $('#credit').dialog('close');
        });
        $('#credit').html(mds.message.credit);
        $('#credit').dialog({
            draggable: true, 
            resizable: false, 
            autoOpen: false, 
            modal: true,
            title: 'Crédits', 
            width: 470, 
            height: 335,
            close: function() {
                mds.menu.setItemState(creditIndex, false);
            }
        });
        
        //ABOUT
        var aboutIndex = mds.menu.addButton(
        'À propos', 
        function(){
            $('#about').dialog('open');
            mds.menu.closeMenu();
        }, 
        function(){
            $('#about').dialog('close');
        });
        $('#about').html(mds.message.about);
        $('#about').dialog({
            draggable: true, 
            resizable: false, 
            autoOpen: false, 
            modal: true,
            title: 'À propos', 
            width: 260, 
            height: 180,
            close: function() {
                mds.menu.setItemState(aboutIndex, false);
            }
        });
        $(window).resize(function() {
            $("#about").dialog("option", "position", "center");
            $("#credit").dialog("option", "position", "center");
//            $("#theme_dialog").dialog("option", "position", "center");
            $("#localization_dialog").dialog("option", "position", "center");
            $("#calendar_dialog").dialog("option", "position", ['center', 45]);
            $("#heatmap_dialog").dialog("option", "position", ['left', 'bottom']);
            $("#legend_dialog").dialog("option", "position", ['right', 'bottom']);
            $("#stat_dialog").dialog("option", "position", ['right', 45]);
            
        });
    },
    
    openLoadDialog: function(title) {
        if(title) {
            $( '#load_dialog' ).dialog('option', 'title', title);
        } else {
            $( '#load_dialog' ).dialog('option', 'title', "Chargement...");
        }
        $( '#load_dialog' ).dialog('open');
    },
    
    closeLoadDialog: function() {
        $( '#load_dialog' ).dialog('close');
    }
    
};

google.load("gdata", "2.x");
google.load('visualization', '1', {'packages':['corechart']});