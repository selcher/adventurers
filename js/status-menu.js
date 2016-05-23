// Game Status Menu

(function( w ) {

    /**
     * Private variables
     */
    var container = null;
    var actions = {};


    /**
     * Public api
     */
    w.statusMenuApi = {
        "init": init,
        "setActions": setActions,
        "render": render,
        "show": show,
        "hide": hide
    };


    /**
     * Private methods
     */
    function init( element ) {

        container = element;
        container.addEventListener( "click", onClickStatus );
    }

    function onClickStatus( e ) {

        var target = e.target;

        if ( target.classList.contains( "level-up" ) ) {

            var playerName = target.getAttribute( "data-name" );
            actions.levelUp( playerName );

            e.preventDefault();
            return false;
        }
    }

    function setActions( gameActions ) {
        actions = gameActions;
    }

    function renderExp( currentExp, maxExp ) {

        var exp = ( currentExp / maxExp );
        exp = exp < 1 ? exp : 1;
        exp = exp * 100 + "%";

        var result = '<div class="exp">' +
            '<div class="current" style="width:' + exp + ';"></div>' +
            '<div class="max"></div>' +
            '<div class="label">' + currentExp + ' / ' + maxExp + '</div>' +
        '</div>';

        return result;
    }

    function renderSkillList( level, skills ) {

        var result = '<div class="skill-list">';
        var enabled = false;
        var style = "";

        for ( var i in skills ) {
            enabled = level >= skills[ i ].requiredLevel ?
                "enabled" : "disabled";
            style = "skill " + i + " " + enabled;
            result += '<div class="' + style + '"></div>';
        }

        result += '</div>';

        return result;
    }

    function render( playerList, experience ) {

        var content = "";
        var player = null;

        for ( var i = playerList.length; i--; ) {

            player = playerList[ i ];
            var levelUpClass = player.canLevelUp( experience ) ?
                "level-up" : "level-up hide";
            content += [
                '<div class="player-status">',
                    '<div class="' + player.name + ' avatar"></div>',
                    '<div class="info">',
                        '<div class="name">',
                            player.name + '<br/>',
                        '</div>',
                        '<div class="basic">',
                            '<div class="level">',
                                '<div>' + player.class + '</div>',
                                '<div>',
                                    'Lv ' + player.level,
                                    renderExp( experience, player.maxExperience ),
                                '</div>',
                                '<div class="' + levelUpClass + '" data-name="',
                                    player.name,
                                '"></div>',
                            '</div>',
                            '<div class="stats">',
                                '<div class="stat">',
                                    '<div class="label">Atk</div>',
                                    '<div class="value">' + player.atk + '</div>',
                                '</div>',
                                '<div class="stat">',
                                    '<div class="label">Def</div>',
                                    '<div class="value">' + player.def + '</div>',
                                '</div>',
                                '<div class="stat">',
                                    'Skills',
                                '</div>',
                                renderSkillList( player.level, player.skills ),
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join("");
        }

        container.innerHTML = content;
    }

    function show() {
        container.classList.remove( "hide" );
    }

    function hide() {
        container.classList.add( "hide" );
    }

})( window );
