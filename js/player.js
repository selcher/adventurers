// Player Class

function Player( status, renderer ) {

    if ( this instanceof Player ) {
        this.name = status.name;
        this.level = status.level;
        this.experience = status.experience;
        this.maxExperience = status.maxExperience;

        this.state = status.hp ? "standby" : "dead";
        this.prevState = this.state;

        this.class = status.class;

        this.hp = status.hp;
        this.maxHp = status.maxHp;
        this.mp = status.mp;
        this.maxMp = status.mp;

        this.atk = status.atk;
        this.def = status.def;
        this.attackedDelayCounter = 0;
        this.attackedDelay = 10;
        this.atkDelayCounter = 0;
        this.atkDelay = status.atkDelay;
        this.atkSpeedCounter = 0;
        this.atkSpeed = status.atkSpeed;
        this.increase = status.increase;

        this.reviveDelay = status.reviveDelay;

        this.activatedSkill = null;
        this.skills = status.skills || {};

        // Status (poisoned, regenerating, casting, skill effects, ...)
        // TODO: create dict for status info (name, duration)
        this.status = {};
        // TODO: create attribute class ?!
        this.bonusEffects = {
            "hp": 0,
            "mp": 0,
            "atk": 0,
            "def": 0
        };

        this.zeny = status.zeny || 0;

        this.renderer = renderer;

        return this;
    } else {
        return new Player( status );
    }
}

/** HP **/

Player.prototype.getMaxHp = function getMaxHp() {
    return this.maxHp;
};

Player.prototype.setMaxHp = function setMaxHp( maxHp ) {
    this.maxHp = maxHp;
};

Player.prototype.getHp = function getHp() {
    return this.hp;
};

Player.prototype.setHp = function setHp( hp ) {

    this.hp = hp > this.maxHp ? this.maxHp :
        ( hp < 0 ? 0 : hp);
};

Player.prototype.getTotalHp = function getTotalHp() {
    return this.getHp() + this.getBonus( "hp" );
};

/** MP **/

Player.prototype.getMaxMp = function getMaxMp() {
    return this.maxMp;
};

Player.prototype.setMaxMp = function setMaxMp( maxMp ) {
    this.maxMp = maxMp;
};

Player.prototype.getMp = function getMp() {
    return this.mp;
};

Player.prototype.setMp = function setMp( mp ) {

    this.mp = mp > this.maxMp ? this.maxMp :
        ( mp < 0 ? 0 : mp);
};

Player.prototype.getTotalMp = function getTotalMp() {
    return this.getMp() + this.getBonus( "mp" );
};

/** Regen **/

Player.prototype.regen = function regen() {
    this.setHp( this.getHp() + this.getRegenRate() );
};

Player.prototype.getRegenRate = function getRegenRate() {
    return Math.floor( this.getMaxHp() / this.reviveDelay );
};

/** Defense **/

Player.prototype.getDefense = function getDefense() {
    return this.def;
};

Player.prototype.setDefense = function setDefense( newDefense ) {
    this.def = newDefense;
}

Player.prototype.getTotalDefense = function getTotaldefense() {
    return this.getDefense() + this.getBonus( "def" );
};

/** Attack **/

Player.prototype.getAttack = function getAttack() {
    return this.atk;
};

Player.prototype.setAttack = function setAttack( newAttack ) {
    this.atk = newAttack;
};

Player.prototype.getTotalAttack = function getTotalAttack() {
    return this.getAttack() + this.getBonus( "atk" );
};

Player.prototype.attack = function attack( enemy ) {
    if ( enemy && enemy.isAlive() ) {
        enemy.attacked( this.getTotalAttack() );
    }
};

Player.prototype.attacked = function attacked( damage ) {
    var defense = this.getTotalDefense();
    var totalDamage = damage > defense ? damage - defense : 1;

    this.setHp( this.getTotalHp() - totalDamage );
    this.attackedDelayCounter = 0;

    var state = this.getState();

    if ( state !== "attacked" ) {
        this.prevState = state;
        this.setState( "attacked" );
    }
};

/** Bonus stats **/

Player.prototype.getBonus = function getBonus( stat ) {
    return this.bonusEffects[ stat ];
};

Player.prototype.setBonus = function setBonus( stat, value ) {
    this.bonusEffects[ stat ] = value;
};

/** Skill **/

Player.prototype.getActivatedSkill = function getActivatedSkill() {
    return this.activatedSkill;
};

Player.prototype.setActivatedSkill = function setActivatedSkill( skill ) {
    this.activatedSkill = skill;
};

Player.prototype.updateActivatedSkill = function updateActivatedSkill() {
    var skill = null;

    this.setActivatedSkill( null );

    for ( var i in this.skills ) {

        skill = this.skills[ i ];

        if ( skill.isEnabled() ) {

            skill.autoActivate();

            if ( skill.isActivated() ) {
                this.setActivatedSkill( skill );
            }
        }
    }
};

Player.prototype.activateSkill = function activateSkill( targets ) {
    var activatedSkill = this.getActivatedSkill();

    for ( var i = targets.length; i--; ) {
        activatedSkill.activate( this, targets );
    }
};

Player.prototype.updateSkills = function updateSkills() {

    for ( var i in this.skills ) {

        if ( this.level >= this.skills[ i ].getRequiredLevel() ) {
            this.skills[ i ].enable();
        }
    }
};

/** Status **/

Player.prototype.addStatus = function addStatus( status ) {
    var statusId = status ? status.getId() : "";

    if ( !this.status[ statusId ] ) {
        this.status[ statusId ] = status;
    }
};

Player.prototype.removeStatus = function removeStatus( status ) {
    delete this.status[ status.getId() ];
};

Player.prototype.updateStatus = function updateStatus() {
    var currentStatus = null;

    for ( var i in this.status ) {

        currentStatus = this.status[ i ];
        currentStatus.update( this );

        if ( !currentStatus.isActive() ) {
            this.removeStatus( currentStatus );
        }
    }
};

Player.prototype.resetStatus = function resetStatus() {
    this.status = {};
    this.bonusEffects = {
        "hp": 0,
        "mp": 0,
        "atk": 0,
        "def": 0
    };
};

/** Zeny **/

Player.prototype.getZeny = function getZeny() {
    return this.zeny;
};

/** Experience **/

Player.prototype.getExperience = function getExperience() {
    return this.experience;
};

Player.prototype.getMaxExperience = function getMaxExperience() {
    return this.maxExperience;
};

Player.prototype.setMaxExperience = function setMaxExperience( exp ) {
    this.maxExperience = exp;
};

/** Level **/

Player.prototype.getLevel = function getLevel() {
    return this.level;
};

Player.prototype.setLevel = function setLevel( level ) {
    this.level = level;
};

Player.prototype.canLevelUp = function canLevelUp( exp ) {
    return exp >= this.getMaxExperience();
};

Player.prototype.levelUp = function levelUp() {
    var newMaxHp = this.getMaxHp() + this.increase.hp;
    var newMaxMp = this.getMaxMp() + this.increase.mp;
    var newAttack = this.getAttack() + this.increase.atk;
    var newDefense = this.getDefense() + this.increase.def;
    var newMaxExp = Math.floor( 1.63 * this.getMaxExperience() );

    this.setLevel( this.getLevel() + 1 );
    this.setMaxHp( newMaxHp );
    this.setMaxMp( newMaxMp );
    this.setHp( newMaxHp );
    this.setMp( newMaxMp );
    this.setAttack( newAttack );
    this.setDefense( newDefense );
    this.setMaxExperience( newMaxExp );

    this.updateSkills();
};

/** State **/

Player.prototype.isAlive = function isAlive() {
    return !( this.isState( "regen" ) || this.isState( "dead" ) );
};

Player.prototype.isState = function isState( state ) {
    return this.state === state;
};

Player.prototype.getState = function getState() {
    return this.state;
};

Player.prototype.setState = function setState( state ) {
    this.state = state;
};

/**
 * Function: updateState
 *
 * Possible states:
 * standby > attacking > attack > standby
 * dead > regen > alive > standby
 * standby > activateSkill > skill > standby
 * disable
 *
 * TODO:
 * Method is becoming long and complicated
 * Implement state pattern (separate class)
 */
Player.prototype.updateState = function updateState() {

    var state = this.getState();

    if ( state === "regen" ) {
        this.regen();
        if ( this.hp >= this.maxHp ) {
            this.setState( "alive" );
        }
    } else if ( state === "dead" ) {
        this.setState( "regen" );
    } else if ( this.hp <= 0 ) {
        this.setState( "dead" );
    } else if ( state === "alive" ) {
        this.setState( "standby" );
    } else if ( state === "standby" ) {

        this.updateActivatedSkill();

        if ( this.getActivatedSkill() ) {
            this.atkDelayCounter = 0;
            this.setState( "activateSkill" );
        } else {
            this.atkDelayCounter++;
            if ( this.atkDelayCounter >= this.atkDelay ) {
                this.atkDelayCounter = 0;
                this.setState( "attacking" );
            }
        }
    } else if ( state === "activateSkill" ) {
        var activatedSkill = this.getActivatedSkill();

        if ( !activatedSkill.isActivated() ) {
            this.setActivatedSkill( null );
            this.setState( "standby" );
        }
    } else if ( state === "attacking" ) {
        this.atkSpeedCounter++;
        if ( this.atkSpeedCounter >= this.atkSpeed ) {
            this.atkSpeedCounter = 0;
            this.setState( "attack" );
        }
    } else if ( state === "attack" ) {
        this.setState( "standby" );
    } else if ( state === "attacked" ) {
        this.attackedDelayCounter++;
        if ( this.attackedDelayCounter >= this.attackedDelay ) {
            this.attackedDelayCounter = 0;
            this.setState( this.prevState );
        }
    } else if ( state === "disabled" ) {
        // Do nothing if player is disabled
    }
};

Player.prototype.reset = function reset() {
    this.setState( "standby" );
    this.setHp( this.getMaxHp() );
    this.setMp( this.getMaxMp() );
    this.attackedDelayCounter = 0;
    this.atkDelayCounter = 0;
    this.atkSpeedCounter = 0;
    this.activatedSkill = null;
    this.resetStatus();
};

Player.prototype.disable = function disable() {
    this.setState( "disabled" );
};

/** Render **/

Player.prototype.getDOM = function getDOM() {
    return this.renderer.getDOM();
};

Player.prototype.render = function render() {
    this.renderer.update( this );
};

/** Update **/

Player.prototype.update = function update() {
    this.updateStatus();
    this.updateState();
    this.render();
};
