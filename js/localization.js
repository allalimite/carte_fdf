if( typeof( mds ) == "undefined" ) mds = {};

mds.localization = {
    
    dialog: undefined,
    menuIndex: undefined,
    geoCoder: undefined,
    
    currentPosition: undefined,
    currentSearch: undefined,
    
    containerId: 'localisation_container',
    
    textClass: 'localisation_text',
    searchInput: 'localisation_search_input',
    searchButton: 'localisation_search_button',
    searchResult: 'localisation_search_result',
    searchGoButton: 'localisation_search_go',
    locateButton: 'localisation_locate',
    
    
    create: function(selector) {
        
        var container = $('<div></div>');
        container.attr('id', mds.localization.containerId);
        container.css('width', 410);
        selector.append(container);
        mds.localization.dialog = selector.dialog({
            draggable: true, 
            resizable: true, 
            autoOpen: false, 
            modal: true,
            position: 'center',
            title: 'Localisation', 
            width: 450, 
            height: 260,
            open: function() {
                $('#'+mds.localization.searchInput).val('');
                mds.localization.currentPosition = undefined;
                mds.localization.updateLocate();
                mds.localization.currentSearch = undefined;
                mds.localization.updateSearch();
            },
            close: function() {
                if(mds.localization.menuIndex != undefined) {
                    mds.menu.setItemState(mds.localization.menuIndex, false);
                }
            }
        });
    },
    init: function() {
        mds.localization.geoCoder = new google.maps.Geocoder();
        var container = $('#'+mds.localization.containerId);
        
        //LOCATE
        var locateButton = $('<button></button>');
        locateButton.attr('id', mds.localization.locateButton);
        locateButton.button();
        locateButton.click(function(){
            if(!mds.localization.currentPosition) {
                mds.localization.locate();
            } else {
                mds.localization.displayToMap(mds.localization.currentPosition);
//                var circle = new google.maps.Circle({
//                    center: mds.localization.currentPosition,
//                    fillColor: 'red',
//                    radius: 50,
//                    map: mds.map.gmap,
//                    zindex: google.maps.Marker.MAX_ZINDEX+1 
//                    
//                });
                    
            }
        });
        var locateP = $('<p></p');
        locateP.attr('align', 'center');
        locateP.append(locateButton);
        
        //SEARCH
        var searchInput = $('<input></input>');
        searchInput.css('width', '60%');
        searchInput.css('margin-right', '8px');
        searchInput.attr('id', mds.localization.searchInput);
        searchInput.attr('type', 'text');
        searchInput.keypress(function (e) {
            if(e.which == 13){
                mds.localization.search();
            }
        });
        
        var searchButton = $('<button></button>');
        searchButton.attr('id', mds.localization.searchButton);
        searchButton.button({
            label: 'Chercher',
            icons: {
                primary: 'ui-icon-search'
            }
        });
        searchButton.click(function(){
            mds.localization.search();
        });
        
        var goToMap = $('<button></button>');
        goToMap.attr('id', mds.localization.searchGoButton);
        goToMap.button({
            label: 'Aller à',
            icons: {
                primary: 'ui-icon-arrowthickstop-1-s'
            }
        });
        goToMap.click(function(){
            if(mds.localization.currentSearch) {
                mds.localization.displayToMap(mds.localization.currentSearch.position)
            }
        });
        
        var searchP = $('<p></p');
        searchP.attr('align', 'center');
        searchP.append(searchInput);
        searchP.append(searchButton);
        
        var resultP = $('<p></p>');
        resultP.attr('align', 'center');
        var resultTable = $('<table></table');
        resultTable.css('width', '100%');
        var resultRow = $('<tr valign="MIDDLE"></tr>');
        var resultCol1 = $('<td></td>');
        resultCol1.append(goToMap)
        var resultCol2 = $('<td></td>');
        var searchResult = $('<span></span>');
        searchResult.attr('id', mds.localization.searchResult);
        resultCol2.append(searchResult)
        resultRow.append(resultCol1);
        resultRow.append(resultCol2);
        resultTable.append(resultRow);
        resultP.append(resultTable);
        
        var searchSep = $('<p>Recherche d\'une localité</p>');
        searchSep.attr('class', mds.localization.textClass);
        var locateSep = $('<p>Geolocalisation</p>');
        locateSep.attr('class', mds.localization.textClass);
        
        //CONTAINER
        container.append(locateSep);
        container.append(locateP);
        container.append(searchSep);
        container.append(searchP);
        container.append(resultP);
        
        mds.localization.menuIndex = mds.menu.addButton('Localisation', function(){
            mds.localization.dialog.dialog('open');
            mds.menu.closeMenu();
        }, function(){
            mds.localization.dialog.dialog('close');
        })
    },
    
    locate: function() {
        mds.localization.currentPosition = undefined;
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                mds.localization.currentPosition
                    = new google.maps.LatLng(lat, lng);
                mds.localization.updateLocate();
            }, function(error) {

                mds.localization.updateLocate();
                mds.error.showError('Erreur de localisation', 
                "Impossible de trouver la position<br/>"+error.message);
            },{
                enableHighAccuracy: true,
                timeout: 5000
            })
        } else {
            mds.error.showError('Erreur de localisation', 
            "La localisation n'est pas supportée par le navigateur");
        }
    },
    
    search: function() {
        mds.localization.currentSearch = undefined;
        mds.localization.updateSearch();
        var searchText = $('#'+mds.localization.searchInput).val();
        if(searchText.length > 0) {
            mds.localization.geoCoder.geocode({
                address: searchText,
                region: '.eu',
                language: 'fr'
            },function(results, status){
                if(status == google.maps.GeocoderStatus.OK) {
                    var searchResult = results[0];
                    mds.localization.currentSearch = {
                        position: searchResult.geometry.location,
                        text: searchResult.formatted_address
                    };
                } else {
                    $('#'+mds.localization.searchResult).html('Aucun résultat');
                }
                mds.localization.updateSearch();
            });
        } else {
            $('#'+mds.localization.searchResult).html('Aucune location à rechercher');
        }
    },
    
    displayToMap: function(latLng) {
        //console.log('displayToMap '+latLng);
        mds.map.gotoPosition(latLng);
        setTimeout(function(){
            mds.localization.dialog.dialog('close');
            mds.menu.setItemState(mds.localization.menuIndex, false);
        }, 600);
    },
    
    updateLocate: function() {
        if(mds.localization.currentPosition) {
            $('#'+mds.localization.locateButton).button({
                label: 'Voir sur la carte',
                icons: {
                    primary: 'ui-icon-arrowthickstop-1-s'
                }
            });
        } else {
            $('#'+mds.localization.locateButton).button({
                label: 'Trouver ma position',
                icons: {
                    primary: 'ui-icon-search'
                }
            });
        }
    },
    
    updateSearch: function() {
        if(mds.localization.currentSearch) {
            $('#'+mds.localization.searchGoButton).css('display', 'block');
            $('#'+mds.localization.searchResult).html(
                mds.localization.currentSearch.text);
        } else {
            $('#'+mds.localization.searchGoButton).css('display', 'none');
            $('#'+mds.localization.searchResult).html('');
        }
    }
}

