// Game controls

(function( w, game, mapRegistry, audio, topMenu, mapMenu, stage, statusMenu ) {

    /**
     * Private Variables
     */
    var container = null;
    var controls = {
        "map": {
            "label": "MAP",
            "className": "map-button",
            "action": onClickMap
        },
        "boss": {
            "label": "BOSS",
            "className": "boss-button",
            "action": onClickBoss
        },
        "status": {
            "label": "STATUS",
            "className": "status-button",
            "action": onClickStatus
        }
    };


    /**
     * Public api
     */
    w.controlsApi = {
        "init": init,
        "render": render,
        "show": show,
        "hide": hide,

        "clickMap": onClickMap
    };


    /**
     * Private methods
     */
    function init( element ) {

        container = element;
        container.addEventListener( "click", onClickControls );

        return this;
    }


    function onClickControls( e ) {

        var classList = e.target.classList;
        var action = null;

        for ( var i in controls ) {
            if ( classList.contains( controls[ i ].className ) ) {
                action = controls[ i ].action;
            }
        }

        if ( action ) {
            action();
            e.preventDefault();
            return false;
        }
    }


    function onClickMap() {

        audio.play( "map" );
        game.stopBattle();

        setTimeout(
            function () {
                topMenu.hide();
                statusMenu.hide();
                stage.hide();
                showMap();
            },
            100
        );
    }


    function showMap() {

        mapMenu.setActions({
            onLocationSelected: function( locationId ) {
                showTopMenu();
                audio.play( locationId );
                stage.render( locationId ).show();
                game.setLocation( locationId );
                game.startBattle( "normal", locationId,
                    function battleDone() {} );
            }
        });

        mapMenu.render( mapRegistry.getLocations() );
        mapMenu.show();
    }


    function showTopMenu() {
        topMenu.render(
            game.getExperience(),
            game.getZeny()
        ).show();
    }


    function onClickStatus() {

        game.stopBattle();

        setTimeout(
            function () {
                audio.play( "status" );
                showTopMenu();
                showStatusMenu();
                mapMenu.hide();
                stage.hide();
            },
            100
        );
    }


    function showStatusMenu() {

        statusMenu.setActions({
            "levelUp": game.levelUp.bind( game )
        });

        statusMenu.render( game.getPlayers(), game.getExperience() );
        statusMenu.show();
    }


    function onClickBoss() {

        game.stopBattle();

        function battleDone() {
            onClickMap();
            show();
        }

        setTimeout( function() {
            var currentLocation = game.getLocation();
            var locationId = currentLocation.id;

            showTopMenu();
            audio.play( "boss" );
            stage.render( locationId ).show();
            statusMenu.hide();
            mapMenu.hide();
            hide();

            game.startBattle( "boss", locationId, battleDone );
        }, 100 );
    }


    function render() {

        var content = "";
        var info = null;

        for ( var i in controls ) {

            info = controls[ i ];
            content += '<div class="' + info.className + ' button">' +
                info.label +
                '</div>';
        }

        container.innerHTML = content;

        return this;
    }


    function show() {
        container.classList.remove( "hide" );
    }


    function hide() {
        container.classList.add( "hide" );
    }

})( window,
    window.gameApi,
    window.mapRegistryApi,
    window.audioApi,
    window.topMenuApi,
    window.mapMenuApi,
    window.stageApi,
    window.statusMenuApi
);
