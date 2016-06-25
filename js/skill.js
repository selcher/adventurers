function Skill( info ) {

    if ( info ) {
        this.id = info.id || "";
        this.name = info.name || "";
        this.type = info.type || "passive";
        this.enabled = info.enabled ? info.enabled : false;
        this.requiredLevel = info.requiredLevel || 0;

        this.targetType = info.targetType;
        this.multipleTarget = info.multipleTarget;

        this.activated = false;
        this.autoActivationChance = info.autoActivationChance || 0;
        this.castTime = info.castTime || 0;
        this.action = info.action || function () {};
    }

    return this;

}

Skill.prototype.getId = function getId() {
    return this.id;
};

Skill.prototype.getName = function getName() {
    return this.name;
};

Skill.prototype.isEnabled = function isEnabled() {
    return this.enabled;
};

Skill.prototype.enable = function enable() {
    this.enabled = true;
};

Skill.prototype.disable = function disable() {
    this.enabled = false;
};

Skill.prototype.getRequiredLevel = function getRequiredLevel() {
    return this.requiredLevel;
};

Skill.prototype.getCastTime = function getCastTime() {
    return this.castTime;
};

Skill.prototype.setActivated = function setActivated( activated ) {
    this.activated = activated || false;
};

Skill.prototype.isActivated = function isActivated() {
    return this.activated;
};

Skill.prototype.autoActivate = function autoActivate() {
    this.setActivated( ( Math.floor( Math.random() * 10000 ) / 100 ) <=
        this.autoActivationChance);
};

Skill.prototype.activate = function activate( caster, targets ) {
    this.action( caster, targets );
    this.setActivated( false );
};
