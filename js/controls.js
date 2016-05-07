// Game controls

(function( w, game, topMenu, mapMenu, stage, statusMenu ) {

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
            onLocationSelected: function( locationName ) {
                topMenu.render( game.experience, game.zeny ).show();
                stage.render( locationName ).show();
                game.setLocation( locationName );
                game.startBattle( "normal", locationName,
                    function battleDone() {} );
            }
        });

        mapMenu.render( game.locations );
        mapMenu.show();
    }

    function onClickStatus() {

        game.stopBattle();

        setTimeout(
            function () {
                topMenu.render( game.experience, game.zeny ).show();
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

        statusMenu.render( game.players, game.experience );
        statusMenu.show();
    }

    function onClickBoss() {

        game.stopBattle();

        function battleDone() {
            onClickMap();
            show();
        }

        setTimeout( function() {
            topMenu.render( game.experience, game.zeny ).show();
            stage.render( game.map ).show();
            statusMenu.hide();
            mapMenu.hide();
            hide();

            game.startBattle( "boss", game.map, battleDone );
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

    w.controlsApi = {
        "init": init,
        "render": render,
        "show": show,
        "hide": hide,

        "clickMap": onClickMap
    };

})(window,
    window.gameApi,
    window.topMenuApi,
    window.mapMenuApi,
    window.stageApi,
    window.statusMenuApi);
