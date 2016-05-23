(function ( w ) {

    /**
     * Private variables
     */
    var container = null;
    var menu = {
        "back": {
            "label": "Back to Main Menu",
            "className": "back-button",
            "action": onClickBack
        }
    };


    /**
     * Public api
     */
    w.creditsApi = {
        "init": init,
        "render": render,
        "show": show,
        "hide": hide
    };


    /**
     * Private methods
     */
    function init( element ) {

        container = element;
        container.addEventListener( "click", onClickCredits );

        return this;
    }

    function onClickCredits( e ) {

        var classList = e.target.classList;
        var action = null;

        for ( var i in menu ) {
            if ( classList.contains( menu[ i ].className ) ) {
                action = menu[ i ].action;
            }
        }

        if ( action ) {
            action();
            e.preventDefault();
            return false;
        }
    }

    function onClickBack() {
        hide();
    }

    function render() {

        var backButton = menu.back;
        var content = [
            '<div class="info">',
                '<br/><br/>',
                '<h2>Resources:</h2><br/>',
                renderLink(
                    'Monster Images',
                    'http://ratemyserver.net/index.php?page=map_db'
                ),
            '</div>',
            '<div class="' + backButton.className + '">',
                backButton.label,
            '</div>'
        ].join( "" );

        container.innerHTML = content;

        return this;
    }

    function renderLink( text, url ) {
        return [
            '<a href="' + url + '" ',
                'target="_blank" ',
                'rel="nofollow">',
                text,
            '</a>'
        ].join( "" );
    }

    function show() {
        container.classList.remove( "hide" );
    }

    function hide() {
        container.classList.add( "hide" );
    }

})( window );
