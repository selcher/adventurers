( function ( w ) {

    /**
     * Public api
     */
    w.EnemyRender = EnemyRender;

    function EnemyRender( enemyDOM ) {
        this.dom = enemyDOM;

        return this;
    }

    EnemyRender.prototype.getDOM = function getDOM() {
        return this.dom;
    };

    EnemyRender.prototype.update = function update( enemy ) {
        var content = '<div class="info">' +
                     renderHp( enemy.hp, enemy.maxHp ) +
                '</div>' +
                    renderAvatar( enemy.name, enemy.state,
                        enemy.atkSpeed, enemy.atkSpeedCounter );

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

            x = x < 1 ?
                -x * maxMoveDistance : -(2 - x) * maxMoveDistance;
            animationStyle = "-webkit-transform: translateX(" + x + "px);";
        }

        var className = name + ' avatar enemy ' + state;
        var result = '<div class="' + className + '" ' +
            'style="' + animationStyle + '"></div>';

        return result;
    };

} )( window );
