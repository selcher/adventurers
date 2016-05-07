// Game Data

(function( w, storage ) {

    function loadPlayerData() {
        var deferred = $.Deferred();

        $.ajax(
            "js/data-player.js",
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

    function loadMapData() {
        var deferred = $.Deferred();

        $.ajax(
            "js/data-map.js",
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

    function formatMapData( initialMapData ) {
        var data = {
            "locations": []
        };

        for ( var locationName in initialMapData ) {
            data.locations.push({
                "name": locationName,
                "current": false,
                "locked": true
            });
        }

        data.locations[0].current = true;
        data.locations[0].locked = false;

        return data;
    };

    function formatPlayerData( playerData ) {
        // Update player skills based on current level and jobClass
        return playerData;
    }

    function loadDataFromStorage( callback ) {
        gameData = JSON.parse( storage[ storageName ] );
        callback && callback();
    }

    function loadDataFromDefault( callback ) {

        var loadPlayerDef = loadPlayerData();
        var loadMapDef = loadMapData();

        $.when( loadPlayerDef, loadMapDef ).done(
            function( playerDataResult, mapDataResult ) {

                mapData = JSON.parse( mapDataResult )[ 0 ];
                var playerData = JSON.parse( playerDataResult );

                gameData = {
                    "player": formatPlayerData( playerData ),
                    "experience": experienceData,
                    "zeny": zenyData,
                    "map": formatMapData( mapData )
                };

                setTimeout( function () {
                    callback && callback();
                }, 0 );

            }
        );

    }

    function loadData( callback ) {
        if ( storage && storage[ storageName ] ) {
            loadDataFromStorage( callback );
        } else {
            loadDataFromDefault( callback );
        }
    }

    function saveData( data ) {
        if ( storage ) {
            gameData = data;
            storage[ storageName ] = JSON.stringify( data );
        }
    }

    // Private Variables
    var storageName = "autoRPG";
    var playerData = [];
    var mapData = {};
    var experienceData = 10000;
    var zenyData = 0;
    var gameData = {};

    // Public Api
    var dataApi = {
        "loadData": loadData,
        "saveData": saveData,
        "getPlayers": function() {
            return gameData.player;
        },
        "setPlayers": function( data ) {
            gameData.player = data;
        },
        "setLocation": function( location ) {
            var locations = gameData.map.locations;

            for ( var i = locations.length; i--; ) {
                locations[ i ].current = locations[ i ].name === location;
            }
        },
        "unlockLocation": function( location ) {
            var locations = gameData.map.locations;

            for ( var i = locations.length; i--; ) {
                if ( locations[ i ].name === location ) {
                    locations[ i ].locked = false;
                }
            }
        },
        "getLocations": function() {
            return gameData.map.locations;
        },
        "getlocationData": function( location ) {
            return mapData[ location ];
        },
        "getEnemies": function( map ) {
            return this.getMap( map ).enemies;
        },
        "getBoss": function( map ) {
            return this.getMap( map ).boss;
        },
        "getExperience": function() {
            return gameData.experience;
        },
        "setExperience": function( data ) {
            gameData.experience = data;
        },
        "getZeny": function() {
            return gameData.zeny;
        },
        "setZeny": function( data ) {
            gameData.zeny = data;
        }
    };

    // Attach to global namespace
    w.dataApi = dataApi;

})( window, window.localStorage );
