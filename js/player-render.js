( function ( w ) {

    /**
     * Public api
     */
    w.PlayerRender = PlayerRender;

    function PlayerRender( playerDOM ) {
        this.dom = playerDOM;

        return this;
    }

    PlayerRender.prototype.getDOM = function getDOM() {
        return this.dom;
    };

    PlayerRender.prototype.update = function update( player ) {
        var content = '<div class="info">' +
                    renderHp( player.hp, player.maxHp ) +
                '</div>' +
                    renderAvatar( player.name, player.state,
                        player.atkSpeed, player.atkSpeedCounter );

        this.dom.className = "player-avatar";
        this.dom.innerHTML = content;
    };


    /**
     * Private methods
     */
    function renderHp( hp, maxHp ) {
        var currentHp = ( hp / maxHp ) * 100 + "%";
        var result = '<div class="hp">' +
            '<div class="current" style="width:' + currentHp + ';"></div>' +
            '<div class="max"></div>' +
        '</div>';

        return result;
    }

    function renderAvatar( name, state, atkSpeed, atkSpeedCounter ) {
        var animationStyle = "";

        if ( state === "attacking" ) {
            var maxMoveDistance = 20;
            var x = atkSpeedCounter / (atkSpeed / 2);

            x = x < 1 ? x * maxMoveDistance : (2 - x) * maxMoveDistance;
            animationStyle += "-webkit-transform: translateX(" + x + "px);";
        }

        var className = name + ' avatar ' + state;
        var result = '<div class="' + className + '" ' +
            'style="' + animationStyle + '"></div>';

        return result;
    };

} )( window );
