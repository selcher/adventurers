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
        var pos = "";

        if ( status === "attacking" ) {
            // TODO: constant 20 = max attack move distance
            var x = atkSpeedCounter / (atkSpeed / 2);
            x = x < 1 ?
                -x * 20 : -(2 - x) * 20;
            var pos = "-webkit-transform: translateX(" + x + "px);";
        }

        var result = '<div class="avatar enemy ' + status + '" ' +
            'style="' + pos + '"></div>';

        return result;
    };

    function EnemyRender( enemyDOM ) {
        this.dom = enemyDOM;

        return this;
    }

    EnemyRender.prototype.getDOM = function getDOM() {
        return this.dom;
    };

    EnemyRender.prototype.update = function update( enemy ) {
        // TODO: add class for canLevelUp effect
        var content = '<div class="info">' +
                     renderHp( enemy.hp, enemy.maxHp ) +
                '</div>' +
                    renderAvatar( enemy.status,
                        enemy.atkSpeed, enemy.atkSpeedCounter );

        this.dom.className = "player-avatar player-" +
                enemy.name;
        this.dom.innerHTML = content;
    };

    w.EnemyRender = EnemyRender;

} )( window );
