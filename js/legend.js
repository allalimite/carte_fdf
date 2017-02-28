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
            title: 'Légende', 
            width: 230, 
            height: 350,
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
        var table = $('<table></table>');
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
            selectHTML += '<option value="'
                +mds.constant.FD_CLASS[FD_C].index+'">'
                +mds.constant.FD_CLASS[classe].text
                +'</option>';
            var legendClass = legendItems[classe];
            if(legendClass) {
                var classRow = $(ROW_DIV);
                
                var classCol = $(COL_DIV);
//                classCol.attr('class', mds.control.LEGEND_CLASS_CELL_CLASS);
                
                classCol.attr('colspan', 2);
                classCol.attr('class', mds.legend.categorieClass);
                classCol.html(mds.constant.FD_CLASS[classe].text);
                classRow.append(classCol);
                table.append(classRow)
                for(icon in legendClass) {
                    var catRow = $(ROW_DIV);
                    var checkBox = $('<select>test</select>');
                    checkBox.attr('type', 'checkbox');
                    var checkBoxCol = $(COL_DIV);
                    checkBoxCol.append(checkBox);
                    catRow.append(checkBoxCol);
                    
                    var legendIcon = legendClass[icon];
                    var iconCol = $(COL_DIV);
                    iconCol.attr('class', mds.legend.imageClass);
                    iconCol.html('<img src="'+legendIcon.icon+'">');
                    catRow.append(iconCol);

                    var catCol = $(COL_DIV);
                    catCol.attr('class', mds.legend.textClass);
                    for(i = 0; i < legendIcon.categories.length; i++) {
                        var catItem = $('<div></div>');
                        catItem.attr('class', mds.legend.titleClass);
                        catItem.html(legendIcon.categories[i]);
                        catCol.append(catItem)
                    }
                    catRow.append(catCol);
                    table.append(catRow);
                }
            }
        }
        var selectContainer = $('<div></div>');
        selectContainer.html('<strong>Filtrer par catégorie</strong><br/>');
        selectHTML = selectHTML;
        selectElement.html(selectHTML).change(function(){
            var catVal = $(this).val();
            mds.map.setLayerFilter(catVal);
        });
        selectContainer.append(selectElement);
        $('#'+mds.legend.containerId).append(selectContainer);
        $('#'+mds.legend.containerId).append(table);
        mds.legend.menuIndex = mds.menu.addButton('Catégories', function(){
            mds.legend.dialog.dialog('open');
//            mds.menu.closeMenu();
        }, function(){
            mds.legend.dialog.dialog('close');
        })
    },
    
    setFilterSelection: function(filter) {
        
        if(filter == undefined) {
            $('#cat_filter_selector').val("");
        } else {
            $('#cat_filter_selector').val(""+filter);
        }
        
    }
}
