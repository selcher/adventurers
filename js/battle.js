// Battle Api
// requestAnimationFrame(function gameLoop() {
//     processInput();
//     update();
//     render();
// });

(function( w, utils, stage ) {

    // TODO:
    // Refactor common parts of each battle type (strategy pattern)

    function normalBattle( players, locationData, battleDone ) {

        var game = this;

        // Init Players
        game.resetPlayers( players );
        var playersContainer = utils.createElement( "div", "stage-players" );
        game.addPlayersToContainer( players, playersContainer );
        stage.add( playersContainer );

        // Init Enemies
        var enemiesData = locationData.enemies.slice();
        var enemies = this.createEnemies( 4, enemiesData );
        var enemiesContainer = utils.createElement( "div", "stage-enemies" );
        game.addPlayersToContainer( enemies, enemiesContainer );
        stage.add( enemiesContainer );

        requestAnimationFrame(function gameLoop() {

            var currentPlayer = null;
            var currentEnemy = null;

            // Updating
            for (var i = players.length; i--;) {
                currentPlayer = players[i];
                currentPlayer.update();

                if ( currentPlayer.status === "attack" ) {
                    currentEnemy = utils.pickRandomTarget( enemies );
                    if (currentEnemy) {
                        players[i].attack( currentEnemy );
                    }
                }
            }

            for (var i = enemies.length; i--;) {
                currentEnemy = enemies[i];
                currentEnemy.update();

                if ( currentEnemy.status === "attack" ) {
                    currentPlayer = players[ utils.getRandom( players ) ];
                    if (currentPlayer) {
                        enemies[i].attack( currentPlayer );
                    } else {
                        // TODO: show miss emoticon
                    }
                } else if ( currentEnemy.status === "dead" ) {
                    game.setExperience(
                        game.experience + currentEnemy.getExperience()
                    );
                    game.setZeny(
                        game.zeny + currentEnemy.getZeny()
                    );
                    game.updateTopMenu();
                } else if ( currentEnemy.status === "alive" ) {
                    enemies[i] = game.resetEnemy(
                        currentEnemy,
                        enemiesData[ utils.getRandom( enemiesData ) ]
                    );
                }
            }

            // Battle conditions
            if ( game.battleLoop ) {
                requestAnimationFrame( gameLoop );
            } else {
                game.resetPlayers( players );
                game.setPlayers( players );
            }

        });
    }

    function bossBattle( players, locationData, battleDone ) {

        var game = this;
        var victory = false;

        // Init Players
        game.resetPlayers( players );
        var playersContainer = utils.createElement( "div", "stage-players" );
        game.addPlayersToContainer( players, playersContainer );
        stage.add( playersContainer );

        // Init Enemies
        var enemiesData = locationData.enemies.slice();
        var enemies = this.createEnemies( 4, enemiesData );
        var enemiesContainer = utils.createElement( "div", "stage-enemies" );
        game.addPlayersToContainer( enemies, enemiesContainer );
        stage.add( enemiesContainer );

        // Init players
        var remainingPlayers = players.length;

        // Init enemies
        var bossData = locationData.boss;
        var boss = this.createEnemy(
            locationData.boss,
            utils.createElement( "div" )
        );
        var remainingMinions = bossData.minions;

        console.log("start boss battle:", players, enemies);

        requestAnimationFrame(function gameLoop() {

            var totalPlayers = players.length;
            var currentPlayer = null;
            var totalEnemies = enemies.length;
            var currentEnemy = null;

            // Updating
            for(var i = totalPlayers; i--;) {
                currentPlayer = players[i];
                currentPlayer.update();
                if ( currentPlayer.status === "attack" ) {
                    currentEnemy = utils.pickRandomTarget( enemies );
                    if (currentEnemy) {
                        players[i].attack( currentEnemy );
                    }
                } else if ( currentPlayer.status === "dead" ) {
                    players[ i ].status = "standby";
                    remainingPlayers--;
                }
            }

            for(var i = totalEnemies; i--;) {
                currentEnemy = enemies[i];
                currentEnemy.update();
                if ( currentEnemy.status === "attack" ) {
                    currentPlayer = players[ utils.getRandom( players ) ];

                    if (currentPlayer) {
                        enemies[i].attack( currentPlayer );
                    } else {
                        // TODO: show miss emoticon
                    }
                } else if ( currentEnemy.status === "dead" ) {

                    game.setExperience(
                        game.experience + currentEnemy.getExperience()
                    );
                    game.setZeny(
                        game.zeny + currentEnemy.getZeny()
                    );
                    game.updateTopMenu();

                    console.log("loop dead - minions - boss:",
                        remainingMinions, boss.isAlive());

                } else if ( currentEnemy.status === "alive" ) {
                    if ( remainingMinions && remainingMinions > 4 ) {
                        // If there are still more than 4 left
                        // add more enemies
                        remainingMinions--;
                        enemies[i] = game.resetEnemy(
                            enemies[i],
                            enemiesData[ utils.getRandom( enemiesData ) ]
                        );
                    } else {
                        remainingMinions--;
                        // remove from dom
                        enemiesContainer.removeChild( enemies[i].getDOM() );
                        // remove enemy from list
                        // since only 4 can be shown on the battle stage
                        enemies.splice( i, 1 );
                    }

                    if ( remainingMinions <= 0 && enemies.length <= 0
                        && boss.isAlive() ) {

                        console.log("add boss:", remainingMinions, enemies);
                        enemies = [ boss ];
                        enemiesContainer.appendChild( boss.getDOM() );
                    }

                    console.log("loop alive - minions - boss:",
                        remainingMinions, boss.isAlive());
                }
            }

            // Battle Conditions
            if ( !boss.isAlive() ) {

                // Victory - all enemies defeated
                game.battleLoop = false;
                victory = true;

            } else if ( remainingPlayers <= 0 ) {

                // Defeat - all players defeated
                game.battleLoop = false;
                victory = false;
            }

            if ( game.battleLoop ) {
                requestAnimationFrame( gameLoop );
            } else {
                console.log("boss battle done:", remainingMinions, enemies);

                // TODO:
                // show message unlocked next map
                // unlock next map
                if ( victory ) {
                    var nextLocation = game.getNextLocation( game.map );
                    game.unlockLocation( nextLocation );
                }

                battleDone();
            }

        });

    }

    w.battleApi = {
        "normal": normalBattle,
        "boss": bossBattle
    };

})( window, window.utilsApi, window.stageApi );
