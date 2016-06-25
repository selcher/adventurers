// Game Api

(function(w,
    utils,
    data,
    message,
    battle,
    SkillClass,
    PlayerClass,
    EnemyClass,
    enemyRegistry,
    mapRegistry,
    PlayerRenderComp,
    EnemyRenderComp,
    topMenu,
    stage,
    statusMenu) {

    /**
     * Private Variables
     */
    var players = [];
    var experience = 0;
    var zeny = 0;
    var battleLoop = false;


    /**
     * Public api
     */
    w.gameApi = {

        // Data
        "getData": getData,
        "setData": setData,

        // Player
        "getPlayers": getPlayers,
        "setPlayers": setPlayers,

        "addPlayersToContainer": addPlayersToContainer,

        "createPlayer": createPlayer,
        "createPlayers": createPlayers,
        "resetPlayers": resetPlayers,

        "levelUp": levelUp,

        // Enemy
        "createEnemy": createEnemy,
        "createEnemies": createEnemies,
        "resetEnemy": resetEnemy,

        // Menus
        "updateTopMenu": updateTopMenu,
        "updateStatusMenu": updateStatusMenu,

        // Map
        "getLocation": getLocation,
        "setLocation": setLocation,
        "getNextLocation": getNextLocation,
        "unlockLocation": unlockLocation,

        // Battle
        "startBattle": startBattle,
        "stopBattle": stopBattle,
        "hasBattleEnded": hasBattleEnded,

        // Experience
        "getExperience": getExperience,
        "setExperience": setExperience,

        // Zeny
        "getZeny": getZeny,
        "setZeny": setZeny
    };


    /**
     * Private methods
     */

    /** Data methods **/

    function getData() {

        return {
            "player": this.getPlayers(),
            "experience": this.getExperience(),
            "zeny": this.getZeny()
        }
    }

    function setData( newData ) {

        var playerList = this.createPlayers( newData.player );

        this.setPlayers( playerList );
        this.setExperience( newData.experience );
        this.setZeny( newData.zeny );
    }


    /** Player methods */

    function getPlayers() {
        return players;
    }

    function setPlayers( playerList ) {
        players = playerList.slice();
    }

    function addPlayersToContainer( playerList, container ) {

        utils.each( playerList, function( player ) {
            container.appendChild( player.getDOM() );
        });
    }

    function initPlayerSkills( playerLevel, skillsData ) {

        var skills = {};
        var skillInfo = null;

        for ( var i in skillsData ) {

            skillInfo = new SkillClass( skillsData[ i ] );

            if ( playerLevel >= skillInfo.getRequiredLevel() ) {
                skillInfo.enable();
            }

            skills[ i ] = skillInfo;
        }

        return skills;
    }

    function createPlayer( data, element ) {

        if ( data.skills ) {
            data.skills = initPlayerSkills( data.level, data.skills );
        }

        return new PlayerClass(
                data,
                new PlayerRenderComp( element )
            );
    }

    function createPlayers( playersData ) {

        var playerList = [];

        utils.each( playersData, function( playerData ) {

            playerList.push(
                this.createPlayer(
                    playerData,
                    utils.createElement( "div" )
                )
            );
        }, this );

        return playerList;
    }

    function resetPlayers( playerList ) {

        utils.each( playerList, function( player ) {
            player.reset();
        });
    }

    // TODO:
    // Consider using pub sub for calling levelUp
    // Currently passed, then called from statusMenu
    function levelUp( playerName ) {

        var currentPlayer = null;

        utils.each( this.getPlayers(), function( player ) {

            if ( player.name === playerName ) {

                currentPlayer = player;

                // Update Top Menu
                this.setExperience(
                    this.getExperience() - currentPlayer.getMaxExperience()
                );
                this.updateTopMenu();

                // Update Player
                currentPlayer.levelUp();
                this.updateStatusMenu();
            }
        }, this );
    }


    /** Enemy methods **/

    function getEnemyData( name ) {
        return enemyRegistry.get( name );
    }

    function createEnemy( name, element ) {

        return new EnemyClass(
            getEnemyData( name ),
            new EnemyRenderComp( element )
        );
    }

    function createEnemies( total, enemyNames ) {

        var enemies = [];

        for ( var i = total; i--; ) {

            enemies.push(
                this.createEnemy(
                    enemyNames[ utils.getRandom( enemyNames ) ],
                    utils.createElement( "div" )
                )
            );
        }

        return enemies;
    }

    function resetEnemy( enemy, newEnemyName ) {

        return createEnemy(
            newEnemyName,
            enemy.renderer.getDOM()
        );
    }


    /** Menu methods **/

    function updateTopMenu() {
        topMenu.render( this.getExperience(), this.getZeny() );
    }

    function updateStatusMenu() {
        statusMenu.render( this.getPlayers(), this.getExperience() );
    }


    /** Map methods **/

    function getLocation() {
        return mapRegistry.getCurrent();
    }

    function setLocation( locationName ) {
        mapRegistry.current( locationName );
    }

    function getNextLocation( locationName ) {

        var locationData = mapRegistry.get( locationName );

        return locationData.next;
    }

    function unlockLocation( locationName ) {
        mapRegistry.unlock( locationName );
    }


    /** Battle methods **/

    function startBattle( type, locationId, battleDone ) {

        battleLoop = true;

        var battleStrategy = battle[ type ];

        if ( battleStrategy ) {

            battleStrategy.apply(
                this,
                [
                    this.getPlayers(),
                    mapRegistry.get( locationId ),
                    battleDone
                ]
            );

        } else {
            // TODO: handle battleStrategy not found
        }

    }

    function stopBattle() {
        battleLoop = false;
    }

    function hasBattleEnded() {
        return battleLoop;
    }


    /** Experience methods **/

    function getExperience() {
        return experience;
    }

    function setExperience( newExp ) {
        experience = newExp;
    }


    /** Zeny methods **/

    function getZeny() {
        return zeny;
    }

    function setZeny( newZeny ) {
        zeny = newZeny;
    }

})( window,
    window.utilsApi,
    window.dataApi,
    window.messageApi,
    window.battleApi,
    Skill,
    Player,
    Enemy,
    window.enemyRegistryApi,
    window.mapRegistryApi,
    window.PlayerRender,
    window.EnemyRender,
    window.topMenuApi,
    window.stageApi,
    window.statusMenuApi
);
