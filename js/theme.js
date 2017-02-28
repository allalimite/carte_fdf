if( typeof( mds ) == "undefined" ) mds = {};

mds.theme = {
    
    menuIndex: undefined,
    dialog: undefined,
    
    create: function(selector) {
        var roller = $('<div></div>');
        roller.themeswitcher({
            onOpen: function() {
                selector.dialog('option', 'height', 300);
            },
            onClose: function() {
                selector.dialog('option', 'height', 90);
            },
            loadTheme: mds.config.defaultTheme, 
            width: 320, 
            height: 230
        });
        selector.append(roller);
        mds.theme.dialog = selector.dialog({
            draggable: false, 
            resizable: false, 
            autoOpen: false, 
            modal: true,
            position: 'center',
            title: 'Choisir le thème', 
            width: 350, 
            height: 300,
            close: function() {
                if(mds.theme.menuIndex != undefined) {
                    mds.menu.setItemState(mds.theme.menuIndex, false);
                }
            }
        });
    },
    init: function() {
        mds.theme.menuIndex = mds.menu.addButton('Thème', function(){
            //On met à la taille max pour le centrage
            mds.theme.dialog.dialog('option', 'height', 300);
            mds.theme.dialog.dialog('open');
            mds.theme.dialog.dialog('option', 'height', 90);
            mds.menu.closeMenu();
        }, function(){
            $('#theme_dialog').dialog('close');
        })
    }
}


