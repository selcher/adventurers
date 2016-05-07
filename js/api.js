// Game Api

(function(w,
    utils,
    data,
    battle,
    PlayerClass,
    EnemyClass,
    PlayerRenderComp,
    EnemyRenderComp,
    topMenu,
    stage,
    statusMenu) {

    /**
     * Function: addPlayersToContainer
     */
    function addPlayersToContainer( players, container ) {
        for ( var i = 0, len = players.length; i < len; i++ ) {
            container.appendChild( players[ i ].getDOM() );
        }
    }

    /**
     * Function: setPlayers
     */
    function setPlayers( playersList ) {
        this.players = playersList;
    }

    /**
     * Function: createPlayer
     */
    function createPlayer( data, element ) {

        return new PlayerClass(
                data,
                new PlayerRenderComp( element )
            );
    }

    /**
     * Function: createPlayers
     */
    function createPlayers( playersData ) {

        var playerList = [];

        for ( var i = playersData.length; i--; ) {

            playerList.push(
                this.createPlayer(
                    playersData[ i ],
                    utils.createElement( "div" )
                )
            );
        }

        return playerList;
    }

    /**
     * Function: resetPlayers
     */
    function resetPlayers( players ) {

        for ( var i = players.length; i--; ) {
            players[ i ].resetStatus();
        }
    }

    /**
     * Function: createEnemy
     */
    function createEnemy( data, element ) {

        return new EnemyClass(
            data,
            new EnemyRenderComp( element )
        );
    }

    /**
     * Function: createEnemies
     */
    function createEnemies( total, enemiesData ) {

        var enemies = [];

        for ( var i = total; i--; ) {

            enemies.push(
                this.createEnemy(
                    enemiesData[ utils.getRandom( enemiesData ) ],
                    utils.createElement( "div" )
                )
            );
        }

        return enemies;
    }

    /**
     * Function: resetEnemy
     */
    function resetEnemy( enemy, newData ) {

        return new EnemyClass(
            newData,
            enemy.renderer
        );
    }

    // TODO:
    // Consider using pub sub for calling levelUp
    // Currently passed, then called from statusMenu
    /**
     * Function: levelUp
     */
    function levelUp( playerName ) {
        var currentPlayer = null;

        for ( var i = this.players.length; i--; ) {

            if ( this.players[i].name === playerName ) {

                currentPlayer = this.players[i];

                    if ( currentPlayer.canLevelUp( this.experience ) ) {

                     // Update Top Menu
                     this.experience -= currentPlayer.getMaxExperience();
                     this.updateTopMenu();

                     // Update Player
                     currentPlayer.levelUp();
                     this.updateStatusMenu();

                     console.log( "levelUp:", name, currentPlayer );

                } else {
                    console.log( "More experience required" );
                }
            }
        }
    }

    /**
     * Function: updateTopMenu
     */
    function updateTopMenu() {
        topMenu.render( this.experience, this.zeny );
    }

    /**
     * Function: updateStatusMenu
     */
    function updateStatusMenu() {
        statusMenu.render( this.players, this.experience );
    }

    // TODO:
    // Doing too many things,
    // consider breaking down to separate modules if possible
    w.gameApi = {

        // Players
        "players": [],
        "setPlayers": setPlayers,

        "addPlayersToContainer": addPlayersToContainer,

        "createPlayer": createPlayer,
        "createPlayers": createPlayers,
        "resetPlayers": resetPlayers,

        "levelUp": levelUp,

        "createEnemy": createEnemy,
        "createEnemies": createEnemies,
        "resetEnemy": resetEnemy,

        // Menus
        "updateTopMenu": updateTopMenu,
        "updateStatusMenu": updateStatusMenu,

        // Selected location on Map
        "map": "poring_field",
        "locations": [],
        "setLocation": function( locationName ) {

            data.setLocation( locationName );
            this.map = locationName;
        },
        "getNextLocation": function( locationName ) {

            var locationData = data.getlocationData( locationName );

            return locationData.next;
        },
        "unlockLocation": function( locationName ) {
            data.unlockLocation( locationName );
        },

        // Battle
        "battleLoop": false,
        "stopBattle": function() {
            this.battleLoop = false;
        },
        "startBattle": function( type, locationName, battleDone ) {

            this.battleLoop = true;

            var battleStrategy = battle[ type ];

            if ( battleStrategy ) {
                battleStrategy.apply(
                    this,
                    [
                        this.players,
                        data.getlocationData( locationName ),
                        battleDone
                    ]
                );
            } else {
                // TODO: handle battleStrategy not found
            }

        },

        // Experience
        "experience": 0,
        "setExperience": function setExperience( newExp ) {
            this.experience = newExp;
        },

        // Zeny
        "zeny": 0,
        "setZeny": function setZeny( newZeny ) {
            this.zeny = newZeny;
        }
    };

})(window,
    window.utilsApi,
    window.dataApi,
    window.battleApi,
    Player,
    Enemy,
    window.PlayerRender,
    window.EnemyRender,
    window.topMenuApi,
    window.stageApi,
    window.statusMenuApi);
