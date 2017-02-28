if(typeof( mds ) === "undefined") {
    var mds = {};
}

mds.heatmap = {
    
    dialog: undefined,
    table: 1621839,
    gmap: undefined,
    layer: undefined,
    menuIndex: undefined,
    selector: undefined,
    create: function(_selector) {
        mds.heatmap.selector = _selector;
        
        var map = $('<div></div>');
        map.attr('id', 'heat_map');
//        map.width(120);
//        map.height(110);
        var container = $('<div></div>');
        container.attr('id', 'heat_map_container');
        container.attr('class', 'ui-helper-clearfix');
//        container.attr('class', 'ui-helper-zfix ui-helper-clearfix');
        container.append(map)
        mds.heatmap.selector.append(container);
        
    },
    
    init: function() {
        mds.heatmap.mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(51, -5.3),
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            draggable: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        mds.heatmap.dialog = mds.heatmap.selector.dialog({
            draggable: true, 
            resizable: false, 
            autoOpen: false, 
            position: ['left', 'bottom'],
            title: 'Densité', 
            width: 180, 
            height: 220,
            close: function() {
                if(mds.heatmap.menuIndex != undefined) {
                    mds.menu.setItemState(mds.heatmap.menuIndex, false);
                }
            }
        });
        mds.heatmap.menuIndex = mds.menu.addButton('Densité', function(){
            mds.heatmap.dialog.dialog('open');
            
        }, function(){
            mds.heatmap.dialog.dialog('close');
        });
        mds.heatmap.gmap = new google.maps.Map($('#heat_map').get(0), mds.heatmap.mapOptions);
        
    },
    
    /**
     * 
     */
    displayMap: function(year, month) {
        if(mds.heatmap.layer) {
            mds.heatmap.layer.setMap(null);
        }
        var conditions = '';
        if(year) {
            conditions += "ANNEE='"+year+"'";
            
        }
        if(month) {
            if(conditions.length>0) {
                conditions += ' AND ';
            }
            conditions += "MOIS='"+month+"'";
        }
        mds.heatmap.layer = new google.maps.FusionTablesLayer({
            query: {
                from: mds.heatmap.table+'',
                select: 'GEOM',
                where: conditions
            },
            heatmap: {
              enabled: true
            }
        });
        mds.heatmap.layer.setMap(mds.heatmap.gmap);
    }
}


