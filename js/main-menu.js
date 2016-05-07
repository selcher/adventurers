(function ( w, gameContent, controls ) {

    function renderContent( element, content ) {
        element.innerHTML = content;
    };

    var container = null;
    var menu = {
        "start": {
            "label": "NEW GAME",
            "className": "new-game-button",
            "action": onClickNewGame
        },
        "continue": {
            "label": "CONTINUE",
            "className": "continue-button",
            "action": onClickContinue
        },
        "credits": {
            "label": "CREDITS",
            "className": "credits-button",
            "action": onClickCredits
        }
    };

    function init( element ) {

        container = element;
        container.addEventListener( "click", onClickMainMenu );

        return this;
    }

    function onClickMainMenu( e ) {

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

    function onClickNewGame() {
        hide();
        gameContent.show();
        controls.clickMap();
    }

    function onClickContinue() {
        hide();
        gameContent.show();
    }

    function onClickCredits() {
        hide();
        gameContent.show();
    }

    function render() {

        var content = [
            '<div class="main-menu-label">',
                '<h1 class="header">ADVENTURERS</h1>',
                '<h4 class="sub-header">AUTO RPG</h4>',
            '</div>'
        ].join( "" );

        content += '<div class="button-container">';

        for ( var i in menu ) {

            info = menu[ i ];
            content += '<div class="' + info.className + ' button">' +
                info.label +
                '</div>';
        }

        content += "</div>";

        renderContent( container, content );

        return this;
    }

    function show() {
        container.classList.remove( "hide" );
    }

    function hide() {
        container.classList.add( "hide" );
    }

    window.mainMenuApi = {
        "init": init,
        "render": render,
        "show": show,
        "hide": hide
    };

})( window, window.contentApi, window.controlsApi );
