(function ( w, data, game, message, audio, gameContent, controls, credits ) {

    /**
     * Private variables
     */
    var container = null;
    var menu = {
        "start": {
            "label": "NEW GAME",
            "enabled": true,
            "className": "new-game-button",
            "action": onClickNewGame
        },
        "continue": {
            "label": "CONTINUE",
            "enabled": false,
            "className": "continue-button",
            "action": onClickContinue
        },
        "credits": {
            "label": "CREDITS",
            "enabled": true,
            "className": "credits-button",
            "action": onClickCredits
        }
    };


    /**
     * Public api
     */
    w.mainMenuApi = {
        "init": init,
        "render": render,
        "show": show,
        "hide": hide,
        "enableOption": enableOption
    };


    /**
     * Private methods
     */
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

        if ( data.hasSavedData() ) {
            showResetSavedGameMessage();
        } else {
            startNewGame();
        }
    }

    function showResetSavedGameMessage() {
        message.setTitle( "NEW GAME" );
        message.setType( "reset-saved-game" );
        message.setButtons([
            {
                "id": "continue-button",
                "class": "button confirm",
                "text": "Continue",
                "click": startNewGame
            },
            {
                "id": "cancel-button",
                "class": "button cancel",
                "text": "Cancel",
                "click": hideResetSavedGameMessage
            }
        ]);
        message.render( "Saved game data will be reset." ).show();
    }

    function hideResetSavedGameMessage() {
        message.hide(function() {
            message.reset();
        });
    }

    function startNewGame() {

        var loadData = data.loadDefaultUserData();

        loadData.then( function( userData ) {
            hideResetSavedGameMessage();
            startGame( userData );
        });
    }

    function onClickContinue() {

        var loadData = data.loadSavedUserData();

        loadData.then( function( userData ) {
            startGame( userData );
        });
    }

    function startGame( userData ) {

        audioApi.pause();
        data.enableAutoSave();
        game.setData( userData );

        hide();
        gameContent.show();
        controls.show();
        controls.clickMap();
    }

    function onClickCredits() {
        credits.show();
    }

    function renderContent( element, content ) {
        element.innerHTML = content;
    };

    function render() {

        var content = [
            renderMainMenuTitle(),
            renderMainMenuButtons()
        ].join( "" );

        renderContent( container, content );

        return this;
    }

    function renderMainMenuTitle() {

        return [
            '<div class="main-menu-label">',
                '<h1 class="header">ADVENTURERS</h1>',
                '<h4 class="sub-header">AUTO RPG</h4>',
            '</div>'
        ].join( "" );
    }

    function renderMainMenuButtons() {

        var content = '<div class="button-container">';

        for ( var i in menu ) {

            info = menu[ i ];

            if ( info.enabled ) {
                content += '<div class="' + info.className + ' button">' +
                    info.label +
                    '</div>';
            }
        }

        content += "</div>";

        return content;
    }

    function show() {
        container.classList.remove( "hide" );
    }

    function hide() {
        container.classList.add( "hide" );
    }

    function enableOption( option ) {
        menu[ option ].enabled = true;
    }

})( window,
    window.dataApi,
    window.gameApi,
    window.messageApi,
    window.audioApi,
    window.contentApi,
    window.controlsApi,
    window.creditsApi
);
