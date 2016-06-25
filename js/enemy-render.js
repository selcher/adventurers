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
        var enemyState = enemy.state;
        var content = '<div class="info">' +
                     renderHp( enemyState, enemy.hp, enemy.maxHp ) +
                '</div>' +
                    renderAvatar( enemy.name, enemyState,
                        enemy.atkSpeed, enemy.atkSpeedCounter );

        this.dom.className = "player-avatar";
        this.dom.innerHTML = content;
    };


    /**
     * Private methods
     */
    function renderHp( state, hp, maxHp ) {
        var currentHp = ( hp / maxHp ) * 100;
        var amount = currentHp < 25 ? "low" : "";
        var result = '<div class="hp ' + state + '">' +
            '<div class="current ' + amount + '" style="width:' + currentHp + '%;"></div>' +
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

        var avatarClassName = name + ' avatar enemy ' + state;
        var avatarShadowClassName = name + ' avatar-shadow enemy ' + state;
        var result = [
            '<div class="' + avatarClassName + '" ' + 'style="' + animationStyle + '"></div>',
            '<div class="' + avatarShadowClassName + '"></div>'
        ].join( "" );

        return result;
    };

} )( window );
