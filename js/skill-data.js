(function( w, utils, statusRegistry ) {

    /**
     * Private variables
     */
    var skills = {
        "bash": {
            "id": "bash",
            "name": "Bash",
            "enabled": false,
            "requiredLevel": 5,
            "autoActivationChance": 0.1,
            "castTime": 500,
            "targetType": "enemy",
            "multipleTarget": false,
            "action": function( caster, targets ) {
                var target = targets[ 0 ];
                var damage = caster.getAttack() * 2;
                target.attacked( damage );
            }
        },
        "magnum-break": {
            "id": "magnum-break",
            "name": "Magnum Break",
            "enabled": false,
            "requiredLevel": 10,
            "autoActivationChance": 0.1,
            "castTime": 500,
            "targetType": "enemy",
            "multipleTarget": true,
            "action": function( caster, targets ) {
                var damage = caster.getAttack();
                utils.each( targets, function( target ) {
                    target.attacked( damage );
                });
            }
        },
        "hp-recovery": {
            "id": "hp-recovery",
            "name": "HP Recovery",
            "enabled": false,
            "requiredLevel": 15,
            "autoActivationChance": 0.1,
            "castTime": 1000,
            "targetType": "self",
            "multipleTarget": false,
            "action": function( caster, targets ) {
                var target = targets[ 0 ];
                target.setHp( target.getMaxHp() );
            }
        },
        "double-strafe": {
            "id": "double-strafe",
            "name": "Double Strafe",
            "enabled": false,
            "requiredLevel": 5,
            "autoActivationChance": 0.1,
            "castTime": 500,
            "targetType": "enemy",
            "multipleTarget": false,
            "action": function( caster, targets ) {
                var target = targets[ 0 ];
                var damage = caster.getAttack() * 2;
                target.attacked( damage );
            }
        },
        "arrow-shower": {
            "id": "arrow-shower",
            "name": "Arrow Shower",
            "enabled": false,
            "requiredLevel": 10,
            "autoActivationChance": 0.1,
            "castTime": 500,
            "targetType": "enemy",
            "multipleTarget": true,
            "action": function( caster, targets ) {
                var damage = caster.getAttack();
                utils.each( targets, function( target ) {
                    target.attacked( damage );
                });
            }
        },
        "vulture-eye": {
            "id": "vulture-eye",
            "name": "Vulture Eye",
            "enabled": false,
            "requiredLevel": 15,
            "autoActivationChance": 0.1,
            "castTime": 1000,
            "targetType": "self",
            "multipleTarget": false,
            "action": function( caster, targets ) {
                var target = targets[0];
                target.addStatus( statusRegistry.get( "vulture-eye" ) );
            }
        },
        "fire-bolt": {
            "id": "fire-bolt",
            "name": "Fire Bolt",
            "enabled": false,
            "requiredLevel": 5,
            "autoActivationChance": 0.1,
            "castTime": 500,
            "targetType": "enemy",
            "multipleTarget": false,
            "action": function( caster, targets ) {
                var target = targets[ 0 ];
                var damage = caster.getAttack() * 2;
                target.attacked( damage );
            }
        },
        "meteor-shower": {
            "id": "meteor-shower",
            "name": "Meteor Shower",
            "enabled": false,
            "requiredLevel": 10,
            "autoActivationChance": 0.1,
            "castTime": 500,
            "targetType": "enemy",
            "multipleTarget": true,
            "action": function( caster, targets ) {
                var damage = caster.getAttack() * 2;
                utils.each( targets, function( target ) {
                    target.attacked( damage );
                });
            }
        },
        "mp-recovery": {
            "id": "hp-recovery",
            "name": "MP Recovery",
            "enabled": false,
            "requiredLevel": 15,
            "autoActivationChance": 0.1,
            "castTime": 1000,
            "targetType": "self",
            "multipleTarget": false,
            "action": function( caster, targets ) {
                var target = targets[ 0 ];
                target.setMp( target.getMaxMp() );
            }
        },
        "heal": {
            "id": "heal",
            "name": "Heal",
            "enabled": false,
            "requiredLevel": 5,
            "autoActivationChance": 0.1,
            "castTime": 1000,
            "targetType": "player",
            "multipleTarget": false,
            "action": function( caster, targets ) {
                var target = targets[ 0 ];
                var restoredHp = caster.getAttack();
                target.setHp( target.getHp() + restoredHp );
            }
        },
        "blessing": {
            "id": "blessing",
            "name": "Blessing",
            "enabled": false,
            "requiredLevel": 10,
            "autoActivationChance": 0.1,
            "castTime": 2000,
            "targetType": "player",
            "multipleTarget": false,
            "action": function( caster, targets ) {
                var target = targets[0];
                target.addStatus( statusRegistry.get( "blessing" ) );
            }
        },
        "angelus": {
            "id": "angelus",
            "name": "Angelus",
            "enabled": false,
            "requiredLevel": 15,
            "autoActivationChance": 0.1,
            "castTime": 2000,
            "targetType": "player",
            "multipleTarget": true,
            "action": function( caster, targets ) {
                utils.each( targets, function( target ) {
                    target.addStatus( statusRegistry.get( "angelus" ) );
                });
            }
        }
    };


    /**
     * Public api
     */
    window.skillDataApi = {
        "get": get
    };


    /**
     * Private methods
     */
    function get( name ) {
        return skills[ name ];
    }

})( window, window.utilsApi, window.statusRegistryApi );
