( function ( w ) {

    function renderHp( hp, maxHp ) {
        var currentHp = ( hp / maxHp ) * 100 + "%";

        var result = '<div class="hp">' +
            '<div class="current" style="width:' + currentHp + ';"></div>' +
            '<div class="max"></div>' +
        '</div>';

        return result;
    }

    function renderAvatar( status, atkSpeed, atkSpeedCounter ) {
        var animationStyle = "";

        if ( status === "attacking" ) {
            // TODO: constant 20 = max attack move distance
            var x = atkSpeedCounter / (atkSpeed / 2);
            x = x < 1 ?
                x * 20 : (2 - x) * 20;
            var pos = "-webkit-transform: translateX(" + x + "px);";
            animationStyle += pos;
        }

        var result = '<div class="avatar ' + status + '" ' +
            'style="' + animationStyle + '"></div>';

        return result;
    };

    function PlayerRender( playerDOM ) {
        this.dom = playerDOM;

        return this;
    }

    PlayerRender.prototype.getDOM = function getDOM() {
        return this.dom;
    };

    PlayerRender.prototype.update = function update( player ) {
        // TODO: add class for canLevelUp effect
        var content = '<div class="info">' +
                     renderHp( player.hp, player.maxHp ) +
                '</div>' +
                    renderAvatar( player.status,
                        player.atkSpeed, player.atkSpeedCounter );

        this.dom.className = "player-avatar player-" +
                player.name;
        this.dom.innerHTML = content;
    };

    w.PlayerRender = PlayerRender;

} )( window );
