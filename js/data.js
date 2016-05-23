// Game Data

(function( w, storage, jq, utils,
    classData, skillData,
    enemyRegistry, mapRegistry ) {

    /**
     * Private Variables
     */
    var version = "1.0.0";
    var storageName = "autoRPG";
    var autoSave = false;

    var playerDataUrl = "js/player-data.js";
    var mapDataUrl = "js/map-data.js";
    var enemyDataUrl = "js/enemy-data.js";

    var defaultExperience = 0;
    var defaultZeny = 0;


    /**
     * Public Api
     */
    w.dataApi = {
        "loadData": loadData,
        "saveData": saveData,
        "hasSavedData": hasSavedData,
        "enableAutoSave": enableAutoSave,
        "isAutoSaveEnabled": isAutoSaveEnabled,
        "loadSavedUserData": loadSavedUserData,
        "loadDefaultUserData": loadDefaultUserData
    };


    /**
     * Private methods
     */
    function loadData( callback ) {

        var loadGameDataDef = loadGameData();
        var loadUserDataDef = null;

        loadGameDataDef.then(function( status ) {
            if ( status ) {
                callback && callback();
            }
        });
    }


    function saveData( data ) {

        data.version = version;
        data.map = mapRegistry.getUnlockedLocations();

        setTimeout(function() {
            setStorageData( data );
        });
    }


    function hasSavedData() {
        return hasStorageData();
    }


    function loadGameData() {

        var loadDeferred = jq.Deferred();
        var loadMapDef = getDataRequest( mapDataUrl );
        var loadEnemyDef = getDataRequest( enemyDataUrl );

        jq.when( loadMapDef, loadEnemyDef ).done(
            function( mapDataResult, enemyDataResult ) {

                registerMapData( utils.parse( mapDataResult ) );
                registerEnemyData( utils.parse( enemyDataResult ) );

                loadDeferred.resolve( "success" );
            }
        );

        return loadDeferred;
    }


    function loadUserData() {

        var loadDeferred = null;

        if ( hasSavedData() ) {
            loadDeferred = loadSavedUserData();
        } else {
            loadDeferred = loadDefaultUserData();
        }

        return loadDeferred;
    }


    function loadSavedUserData() {

        var loadDeferred = jq.Deferred();
        var userData = getStorageData();

        utils.each(userData.map, function( locationId ) {
            mapRegistry.unlock( locationId );
        });

        loadDeferred.resolve( userData );

        return loadDeferred;
    }


    function loadDefaultUserData() {

        var loadDeferred = jq.Deferred();
        var loadPlayerDef = getDataRequest( playerDataUrl );

        jq.when( loadPlayerDef ).done(
            function( playerDataResult ) {

                var playerData = utils.parse( playerDataResult );

                var result = {
                    "player": formatPlayerData( playerData ),
                    "experience": defaultExperience,
                    "zeny": defaultZeny,
                    "map": mapRegistry.getUnlockedLocations()
                };

                loadDeferred.resolve( result );
            }
        );

        return loadDeferred;
    }


    function getDataRequest( url ) {

        var deferred = jq.Deferred();

        jq.ajax(
            url,
            {
                "type": "GET",
                "success": function ( data, status, xhr ) {
                    deferred.resolve( data );
                },
                "error": function ( xhr, status ) {
                    deferred.reject( null );
                }
            }
        );

        return deferred;
    }


    function hasStorageData() {
        return storage && storage[ storageName ];
    }


    function getStorageData() {
        return utils.parse( storage[ storageName ] );
    }


    function setStorageData( data ) {
        storage[ storageName ] = utils.toString( data );
    }


    function formatPlayerData( playerData ) {

        utils.each( playerData, function( data, i ) {
            playerData[ i ].skills = buildSkillList( data );
        });

        return playerData;
    }


    function buildSkillList( playerData ) {

        var playerClassData = classData[ playerData.class.toLowerCase() ];
        var classSkillList = playerClassData ? playerClassData.skills : [];
        var skillName = "";
        var skills = {};

        utils.each( classSkillList, function( skillName, i ) {
            skills[ skillName ] = skillData.get( skillName );
        });

        return skills;
    }


    function registerEnemyData( enemyData ) {
        utils.each( enemyData, function( enemy ) {
            enemyRegistry.register( enemy.name, enemy );
        });
    }


    function registerMapData( mapData ) {
        utils.each( mapData, function( location ) {
            mapRegistry.register( location.id, location );
        });
    }


    function isAutoSaveEnabled() {
        return autoSave;
    }


    function enableAutoSave() {
        autoSave = true;
    }

})( window,
    window.localStorage,
    $,
    window.utilsApi,
    window.classDataApi,
    window.skillDataApi,
    window.enemyRegistryApi,
    window.mapRegistryApi
);
