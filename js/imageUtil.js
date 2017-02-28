if( typeof( mds ) == "undefined" ) mds = {};

mds.imageutil = {
    maxWidth: 460*80/100,
    maxHeight: 200,
    wrap: function(selector, container) {
        
        //Cherche l'image
        var img = undefined;
        selector.each(function(i, element) {
            $(element).css('display', 'none');
            if(element.tagName.toLowerCase() == 'img') {
                
                img = $(element);
            } 
        });
        if(img != undefined) {
            var src = img.attr('src');
            img.removeAttr('src');
            img.load(function() {
                var nw = img.get(0).naturalWidth;
                var nh = img.get(0).naturalHeight;
                var rx = mds.imageutil.maxWidth / nw;
                var ry = mds.imageutil.maxHeight / nh;
                selector.each(function(i, element) {
                    $(element).css('display', 'block');
                });
                if(rx < ry) {
                    img.removeAttr("height");
                    img.animate({width: mds.imageutil.maxWidth+'px'}, 100);
                } else {
                    img.removeAttr("width");
                    img.animate({height: mds.imageutil.maxHeight+'px'}, 100);
                }                
            });
            img.error(function() {
                img.load(function(){});
            })
            img.attr('src', src);
            img.attr('width', '1px');
            img.attr('height', '1px');
        }
        
    }
}
