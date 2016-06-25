// Battle Api

(function( w, utils, stage, message ) {

    // TODO:
    // Refactor common parts of each battle type (strategy pattern)

    /**
     * Private Variables
     */
    var messageTimer = null;
    var paused = false;
    var battleLoop = null;


    /**
     * Public api
     */
    w.battleApi = {
        "pause": pause,
        "resume": resume,
        "normal": normalBattle,
        "boss": bossBattle
    };


    /**
     * Private methods
     */
    function pause() {
        paused = true;
    }

    function resume() {
        paused = false;
        battleLoop();
    }

    function setBattleLoop( loop ) {
        if ( loop ) {
            battleLoop = loop;
        }
    }

    function showMessage( content, callback, delay ) {

        message.render( content ).show();

        if ( messageTimer ) {
            clearTimeout( messageTimer );
        }

        messageTimer = setTimeout( function() {
            callback && callback();
            message.hide();
        }, delay );
    }

    function getSkillTargets( player, players, enemies ) {

        var targets = [];
        var activatedSkill = player.getActivatedSkill();
        var targetType = activatedSkill.targetType;
        var isMultipleTarget = activatedSkill.multipleTarget;

        if ( targetType === "player" ) {
            targets = players;
        } else if ( targetType === "enemy" ) {
            targets = enemies;
        } else if ( targetType === "self" ) {
            targets = [ player ];
        }

        if ( !isMultipleTarget ) {

            var targetIndex = utils.getRandom( targets );
            var target = targets[ targetIndex ];

            targets = [ target ];
        }

        return targets;
    };

    function normalBattle( players, locationData, battleDone ) {

        message.setType( "battle" );
        showMessage(
            locationData.name,
            function() {},
            3000 );

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

        var gameLoop = function gameLoop() {

            if ( paused ) {
                return;
            }

            var currentPlayerState = null;
            var currentEnemyState = null;

            // Updating
            utils.each( players, function( currentPlayer, i ) {

                currentPlayer.update();
                currentPlayerState = currentPlayer.getState();

                if ( currentPlayerState === "attack" ) {

                    currentEnemy = utils.pickRandomTarget( enemies );

                    if ( currentEnemy ) {
                        currentPlayer.attack( currentEnemy );
                    }

                } else if ( currentPlayerState === "activateSkill" ) {

                    var activatedSkill = currentPlayer.getActivatedSkill();
                    var skillTargets = getSkillTargets(
                        currentPlayer, players, enemies );

                    var messageType = [
                        currentPlayer.name,
                        "skill",
                        activatedSkill.getId(),
                    ].join( " " );

                    message.setType( messageType );
                    showMessage(
                        activatedSkill.getName(),
                        function() {},
                        3000
                    );

                    currentPlayer.activateSkill( skillTargets );
                }
            });

            utils.each( enemies, function( currentEnemy, i ) {

                currentEnemy.update();
                currentEnemyState = currentEnemy.getState();

                if ( currentEnemyState === "attack" ) {

                    currentPlayer = players[ utils.getRandom( players ) ];

                    if ( currentPlayer ) {
                        currentEnemy.attack( currentPlayer );
                    } else {
                        // TODO: show miss emoticon
                    }

                } else if ( currentEnemyState === "dead" ) {

                    game.setExperience(
                        game.getExperience() + currentEnemy.getExperience()
                    );
                    game.setZeny(
                        game.getZeny() + currentEnemy.getZeny()
                    );
                    game.updateTopMenu();

                } else if ( currentEnemyState === "alive" ) {

                    currentEnemy = game.resetEnemy(
                        currentEnemy,
                        enemiesData[ utils.getRandom( enemiesData ) ]
                    );
                }
            });

            // Battle conditions
            if ( game.hasBattleEnded() ) {
                requestAnimationFrame( gameLoop );
            } else {
                game.resetPlayers( players );
                game.setPlayers( players );
            }

        });
    }

    function bossBattle( players, locationData, battleDone ) {

        message.setType( "battle" );
        showMessage(
            locationData.name,
            function() {},
            3000 );

        var game = this;
        var victory = false;

        // Init Players
        game.resetPlayers( players );
        var playersContainer = utils.createElement( "div", "stage-players" );
        game.addPlayersToContainer( players, playersContainer );
        stage.add( playersContainer );

        var remainingPlayers = players.length;

        // Init Enemies
        var enemiesData = locationData.enemies.slice();
        var enemies = this.createEnemies( 4, enemiesData );
        var enemiesContainer = utils.createElement( "div", "stage-enemies" );
        game.addPlayersToContainer( enemies, enemiesContainer );
        stage.add( enemiesContainer );

        var boss = this.createEnemy(
            locationData.boss,
            utils.createElement( "div" )
        );
        var remainingMinions = boss.minions;

        var gameLoop = function gameLoop() {

            if ( paused ) {
                return;
            }

            var totalPlayers = players.length;
            var currentPlayer = null;
            var currentPlayerState = null;
            var totalEnemies = enemies.length;
            var currentEnemy = null;
            var currentEnemyState = null;

            // Updating
            utils.each( players, function( currentPlayer, i ) {

                currentPlayer.update();
                currentPlayerState = currentPlayer.getState();

                if ( currentPlayerState === "attack" ) {

                    currentEnemy = utils.pickRandomTarget( enemies );

                    if ( currentEnemy ) {
                        currentPlayer.attack( currentEnemy );
                    }

                } else if ( currentPlayerState === "activateSkill" ) {

                    var activatedSkill = currentPlayer.getActivatedSkill();
                    var skillTargets = getSkillTargets(
                        currentPlayer, players, enemies );

                    if ( skillTargets && skillTargets.length ) {

                        var messageType = [
                            currentPlayer.name,
                            "skill",
                            activatedSkill.getId(),
                        ].join( " " );

                        message.setType( messageType );
                        showMessage(
                            activatedSkill.getName(),
                            function() {},
                            3000
                        );

                        currentPlayer.activateSkill( skillTargets );
                    }

                } else if ( currentPlayerState === "dead" ) {

                    currentPlayer.disable();
                    remainingPlayers--;
                }
            });

            utils.each( enemies, function( currentEnemy, i ) {

                if ( currentEnemy ) {

                    currentEnemy.update();
                    currentEnemyState = currentEnemy.getState();

                    if ( currentEnemyState === "attack" ) {

                        currentPlayer = players[ utils.getRandom( players ) ];

                        if ( currentPlayer ) {
                            currentEnemy.attack( currentPlayer );
                        } else {
                            // TODO: show miss emoticon
                        }

                    } else if ( currentEnemyState === "dead" ) {

                        game.setExperience(
                            game.getExperience() + currentEnemy.getExperience()
                        );
                        game.setZeny(
                            game.getZeny() + currentEnemy.getZeny()
                        );
                        game.updateTopMenu();

                    } else if ( currentEnemyState === "alive" ) {

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

                            // Add boss if all minions is defeated
                            enemies = [ boss ];
                            enemiesContainer.appendChild( boss.getDOM() );
                        }
                    }
                }
            });

            // Battle Conditions
            if ( !boss.isAlive() ) {

                game.stopBattle();
                victory = true;

            } else if ( remainingPlayers <= 0 ) {

                game.stopBattle();
                victory = false;
            }

            if ( game.hasBattleEnded() ) {

                requestAnimationFrame( gameLoop );

            } else {

                game.resetPlayers( players );
                game.setPlayers( players );

                utils.each( players, function( currentPlayer ) {
                    currentPlayer.update();
                });

                if ( victory ) {
                    var nextLocation = game.getNextLocation( locationData.id );
                    game.unlockLocation( nextLocation );
                }

                message.setType( "battle" );
                showMessage(
                    victory ? "VICTORY" : "DEFEAT",
                    battleDone,
                    3000 );
            }
        });
    }

})( window,
    window.utilsApi,
    window.stageApi,
    window.messageApi
);
