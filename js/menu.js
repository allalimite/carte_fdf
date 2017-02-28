if( typeof( mds ) == "undefined" ) mds = {};

mds.menu = {
    MENU_ID: 'map_menu_id',
    MENU_BUTTON_ID: 'map_menu_button_id',
    MENU_VIEWPORT_ID: 'map_menu_viewport_id',
    
    mainSelector: undefined,
    buttonSelector: undefined,
    viewPortSelector: undefined,
    onItemSelect: undefined,
    items: [],
    effect: 'blind',
    closing: false,
    
    create: function(selector) {
        //BUTTON
        mds.menu.buttonSelector = $('<button>Menu</button>');
        mds.menu.buttonSelector.attr('id', mds.menu.MENU_BUTTON_ID);
        //VIEWPORT
        mds.menu.viewPortSelector = $('<div></div>');
        mds.menu.viewPortSelector.attr('id', mds.menu.MENU_VIEWPORT_ID);
        mds.menu.viewPortSelector.css('display', 'none');
        //MAIN
        mds.menu.mainSelector = $('<div></div>');        
        mds.menu.mainSelector.attr('id', mds.menu.MENU_ID);
        mds.menu.mainSelector.append(mds.menu.buttonSelector);
        mds.menu.mainSelector.append(mds.menu.viewPortSelector);
        selector.append(mds.menu.mainSelector);
    },
    
    init: function() {
        
        mds.menu.buttonSelector.button({
            icons:{
                primary: "ui-icon-gear",
                secondary: "ui-icon-triangle-1-s"
            }
        });
        mds.menu.buttonSelector.click(function(){
            var opened = mds.menu.viewPortSelector.css('display') === 'block';
            mds.menu.closing = opened;
            if(opened) {
                mds.menu.closeMenu();
            } else {
                mds.menu.openMenu();
            }    
        });
        mds.menu.viewPortSelector.mouseleave(function(){
//            console.log('mouseleave');
            if(!mds.menu.closing) {
                mds.menu.closeMenu();
            }
            
        });
    },
    
    closeMenu: function() {
        mds.menu.viewPortSelector.delay(300).hide(mds.menu.effect, [], 500);
        setTimeout(function(){
            mds.menu.buttonSelector.button('option', 'icons', {
                primary: "ui-icon-gear",
                secondary: "ui-icon-triangle-1-s"
            });
        }, 800);
        mds.menu.closing = true;
        
    },
    openMenu: function() {
        mds.menu.viewPortSelector.show(mds.menu.effect, [], 500);
        setTimeout(function(){
            mds.menu.buttonSelector.button('option', 'icons', {
                primary: "ui-icon-gear",
                secondary: "ui-icon-triangle-1-n"
            });
        }, 500);        
    },
    
    addButton: function(title, primaryAction, secondaryAction) {
        var index = mds.menu.items.length;
        
        var button = $('<button>'+title+'</button>');
        button.button({
            icons:{
                secondary: "ui-icon-pin-w"
            }
        });
        button.css('width', '160px');
        
        button.click(function(){
            var buttonItem = mds.menu.items[index];
            if(buttonItem.docked) {
                if(buttonItem.secondaryAction) {
                    buttonItem.secondaryAction();
                }
                mds.menu.setItemState(index, false);
            } else {
                if(buttonItem.primaryAction) {
                    buttonItem.primaryAction();
                }
                mds.menu.setItemState(index, true);
            }
        });
        
        var item = {
            button: button,
            primaryAction: primaryAction,
            secondaryAction: secondaryAction,
            docked: false
        }
        mds.menu.items.push(item);
        var container = $('<div></div>');
        container.append(button);
        mds.menu.viewPortSelector.append(container);
        return index;
    },
    
    setItemState: function (itemIndex, docked) {
        
        var icon = docked? 'ui-icon-pin-s': 'ui-icon-pin-w';
        mds.menu.items[itemIndex].button.button(
        'option', 
        'icons', 
        {
            secondary: icon
        });
        mds.menu.items[itemIndex].docked = docked;
    }
};


