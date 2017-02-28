if( typeof( mds ) == "undefined" ) mds = {};

mds.legend = {
    
    dialog: undefined,
    menuIndex: undefined,
    containerId: 'legend_container',
    selectId: 'legend_select',
    categorieClass: 'legend_cat_class',
    titleClass: 'legend_title_class',
    imageClass: 'legend_image_class',
    textClass: 'legend_text_class',
    
    create: function(selector) {
        
        var container = $('<div></div>');
        container.attr('id', mds.legend.containerId);
        
        selector.append(container);
        mds.legend.dialog = selector.dialog({
            draggable: true, 
            resizable: true, 
            autoOpen: false, 
            position: ['right', 'bottom'],
            title: 'Catégories', 
            width: 250, 
            height: 435,
            close: function() {
                if(mds.legend.menuIndex != undefined) {
                    mds.menu.setItemState(mds.legend.menuIndex, false);
                    mds.legend.setFilterSelection(undefined);
                    mds.map.setLayerFilter("");
                }
            }
        });
    },
    
    init: function() {
        var accordion = $('<div></div>');
        accordion.attr('id', 'legend_accordion');
        
        var selectElement = $('<select id="cat_filter_selector"></select>');
        var selectHTML = '<option selected="true" value="">Toutes</option>';
        var legendItems = new Object();
        for (catId in mds.constant.FD_CATEGORY) {
            var CAT = mds.constant.FD_CATEGORY[catId];
            if( ! legendItems[CAT.classe]) {
                legendItems[CAT.classe] = new Object();
            }
            if(! legendItems[CAT.classe][CAT.icon] ) {
                legendItems[CAT.classe][CAT.icon] = new Object();
                legendItems[CAT.classe][CAT.icon].categories = [];
            }
            legendItems[CAT.classe][CAT.icon].categories.push(CAT.text);
            legendItems[CAT.classe][CAT.icon].icon = mds.constant.getIconCat(CAT);
        }
        var ROW_DIV = '<tr></tr>';
        var COL_DIV = '<td></td>';
        for(p = mds.constant.FD_CLASS_SIZE-1; p >= 0; p--) {
            var classe = undefined;
            for(FD_C in mds.constant.FD_CLASS) {
                if(mds.constant.FD_CLASS[FD_C].index == p) {
                    classe = FD_C;
                    break;
                }
            }
            var tab = $('<h3></h3>');
            var tabTitle = $('<a></a>').html(mds.constant.FD_CLASS[classe].text);
            tab.append(tabTitle)
            var tabContent = $('<div></div>')
                .attr('id', 'legend_id_'+mds.constant.FD_CLASS[classe].index)
                .attr('class', 'legend_content');
            
            var table = $('<table></table>');
            selectHTML += '<option value="'
                +mds.constant.FD_CLASS[FD_C].index+'">'
                +mds.constant.FD_CLASS[classe].text
                +'</option>';
            var legendClass = legendItems[classe];
            if(legendClass) {
                
                for(icon in legendClass) {                    
                    var legendIcon = legendClass[icon];
                    //ROW
                    var catRow = $(ROW_DIV);
                    //ICON
                    var iconCol = $(COL_DIV);
                    iconCol.attr('class', mds.legend.imageClass);
                    iconCol.html('<img src="'+legendIcon.icon+'">');
                    catRow.append(iconCol);
                    //CHECKBOX
//                    var checkBoxCol = $(COL_DIV);
//                    checkBoxCol.append(checkBox);
//                    catRow.append(checkBoxCol);
                    //CAT
                    var catCol = $(COL_DIV);
                    catCol.attr('class', mds.legend.textClass);
                    var catItem = $('<div></div>');
                    catItem.attr('class', mds.legend.titleClass);
                        
                    for(i = 0; i < legendIcon.categories.length; i++) {
                        var checkBox = $('<input></input>');
                        checkBox.attr('type', 'checkbox');
                        checkBox.attr('checked', 'checked');
                        checkBox.attr('name', legendIcon.categories[i]);
                        //catItem.append(checkBox);
                        catItem.append(legendIcon.categories[i]);
                        if(i!=legendIcon.categories.length-1) {
                            catItem.append($('<br/>'));
                        }
                    }
                    catCol.append(catItem);
                    catRow.append(catCol);
                    table.append(catRow);
                }
            }
            tabContent.append(table);
            accordion.append(tab);
            accordion.append(tabContent);
        }
        var selectContainer = $('<div></div>');
        selectContainer.html('<strong>Filtrer par catégorie</strong><br/>');
        selectHTML = selectHTML;
        selectElement.html(selectHTML).change(function(){
            mds.general.openLoadDialog("Filtrage...");
            var catVal = $(this).val();
            setTimeout(function() {
                
                mds.legend.updateAccordion(catVal);
                mds.map.setLayerFilter(catVal);
                mds.general.closeLoadDialog();
            }, 100);
            
            
        });
        selectContainer.append(selectElement);
        accordion.accordion({animated: false});
        $('#'+mds.legend.containerId).append(selectContainer);
        $('#'+mds.legend.containerId).append(accordion);
        
        mds.legend.menuIndex = mds.menu.addButton('Catégories', function(){
            mds.legend.dialog.dialog('open');
//            mds.menu.closeMenu();
        }, function(){
            mds.legend.dialog.dialog('close');
        })
    },
    
    setFilterSelection: function(filter) {
        var selectVal = filter == undefined? "":""+filter; 
        $('#cat_filter_selector').val(selectVal);
        mds.legend.updateAccordion(selectVal);
            
    },
    updateAccordion: function(val) {
        if(val == undefined || val == "") {
            $('#legend_accordion')
                .accordion('activate', 0);
//                .accordion('option', 'false', false);
        } else {
            $('#legend_accordion')
                .accordion('activate', 5-parseInt(val));
//                .accordion('option', 'disabled', true);
        }
    }
}



