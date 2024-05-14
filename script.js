let nextLevel = 50;

/* O "= 6" indica que o valor padrão (se não passado) é de 6. */
function rollDice(dice = 6) {
    return Math.floor(Math.random() * dice) + 1;
}

function update(player) {
    player_hp.innerHTML = player.hp;
    player_mp.innerHTML = player.mp;
    player_str.innerHTML = player.str;
    player_dex.innerHTML = player.dex;
    player_int.innerHTML = player.int;

    player_lvl.innerHTML = player.lvl;
    player_exp.innerHTML = player.exp;
    nxt_level.innerHTML = nextLevel;

    player_pot.innerHTML = player.potion;

    player_weapon.innerHTML = player.weapon.name;
    str_mult.innerHTML = player.weapon.scalingStr;
    dex_mult.innerHTML = player.weapon.scalingDex;
    int_mult.innerHTML = player.weapon.scalingInt;

    enemy_name.innerHTML = player.room.enemy.name;
    enemy_hp.innerHTML = player.room.enemy.hp;
    enemy_lvl.innerHTML = player.room.enemy.lvl;

    room_num.innerHTML = player.room.num;

    player.room.enemy.frame();
}

function strUp(p) {
    p.str++;
    update(p);
    level_up.innerHTML = ``;
}

function dexUp(p) {
    p.dex++;
    update(p);
    level_up.innerHTML = ``;
}

function intUp(p) {
    p.int++;
    update(p);
    level_up.innerHTML = ``;
}

function chkLevel(p) {
    if (p.exp >= nextLevel) {
        p.lvl++;
        p.exp = p.exp - nextLevel;
        nextLevel += Math.floor(nextLevel * 0.2);

        level_up.innerHTML = `<div class ="cllumn">
                    <p>Level Up</p>
                    <p>STR <button onclick="strUp(player)">+</button></p>
                    <p>DEX <button onclick="dexUp(player)">+</button></p>
                    <p>INT <button onclick="intUp(player)">+</button></p>
                </div>`;
    } else return;
}

function chkTurn(p, e) {
    chkLevel(p);
    if (p.hp > 0 && e.hp > 0) {
        p.action = false;
    } else if (e.hp <= 0) {
        if (e.dropChance) {
            potionDrop();
            if (p.mp < p.maxMp) {
                p.mp += 10;
            } else {
                p.mp = p.maxMp;
            }

            e.dropChance = false;
        }
        e.hp = 0;
        p.exp += e.exp;
        e.exp = 0;
        p.room.isThereEnemy = false;
    } else if (p.hp <= 0) {
        alert(
            "Você foi dissolvido nas entranhas da dungeon... Para tentar novamente reinicie a pagina!"
        );
        body.innerHTML = "";
    }
}

function potionDrop() {
    let d10 = rollDice(10);

    if (d10 >= 7) {
        player.potion++;
        alert("O inimigo dropou uma poção");
    } else return;

    update(player);
}

function ignore(p) {
    p.room.isThereLoot = false;
    weapon_desc.innerHTML = "";
}

function equip(p, w) {
    p.room.isThereLoot = false;
    p.weapon = w;
    weapon_desc.innerHTML = "";
    update(p);
}

function enemyTurn(p, e) {
    if (e.hp > 0) {
        let d20 = rollDice(20);
        let d6 = rollDice(6);

        let enemyDmg = e.lvl * d6 + e.damage;

        if (d20 <= 20 && d20 >= 16) {
            enemyDmg * 2;
            p.hp -= enemyDmg;
        } else if (d20 < 16 && d20 >= 12) {
            p.hp -= enemyDmg;
            e.hp += Math.floor(enemyDmg * 0.2);
        } else {
            p.hp -= enemyDmg;
        }

        console.log("resultado d6 inimigo: " + d6);
        console.log("resultado d20 inimigo: " + d20);
        enemy_dmg.innerHTML = enemyDmg;
    } else return;
}

let dagger = {
    name: "Adaga Danificada",
    scalingStr: 0,
    scalingDex: 2,
    scalingInt: 0,
};

let staff = {
    name: "Cajado de Pinho",
    scalingStr: 0,
    scalingDex: 0,
    scalingInt: 2,
};

let axe = {
    name: "Machado cego",
    scalingStr: 2,
    scalingDex: 0,
    scalingInt: 0,
};

let rogue = {
    name: "Valira, the shadow",
    frame: function () {
        palyer_img.innerHTML = `<img src="./assets/rogue.jpg"></img>`;
    },
    hp: 120,
    mp: 60,
    str: 1,
    dex: 3,
    int: 1,
    strtWeapon: dagger,
    skill: {
        name: "Estocada",
        cost: 15,
        dmg: 60,
    },
};

let mage = {
    name: "Kadgar, the magnificent",
    frame: function () {
        palyer_img.innerHTML = `<img src="./assets/mage.jpg"></img>`;
    },
    hp: 100,
    mp: 100,
    str: 1,
    dex: 1,
    int: 4,
    strtWeapon: staff,
    skill: {
        name: "Bola de fogo",
        cost: 20,
        dmg: 80,
    },
};

let warrior = {
    name: "Garrosh, the crusher",
    frame: function () {
        palyer_img.innerHTML = `<img src="./assets/warrior.jpg"></img>`;
    },
    hp: 200,
    mp: 20,
    str: 4,
    dex: 1,
    int: 0,
    strtWeapon: axe,
    skill: {
        name: "Quebra-Craneo",
        cost: 10,
        dmg: 40,
    },
};

let room1 = {
    num: 1,
    isThereLoot: true,
    isThereEnemy: true,
    enemy: {
        name: "Crawler",
        frame: function () {
            enemy_img.innerHTML = `<img src="./assets/crawler.jpg"></img>`;
        },
        dropChance: true,
        lvl: 1,
        hp: 50,
        damage: 10,
        exp: 60,
    },
    weapon: {
        name: "Adaga Afiada",
        scalingStr: 1,
        scalingDex: 8,
        scalingInt: 0,
    },
};

let room2 = {
    num: 2,
    isThereLoot: false,
    isThereEnemy: true,
    enemy: {
        name: "Goblin",
        frame: function () {
            enemy_img.innerHTML = `<img src="./assets/goblin.jpg"></img>`;
        },
        dropChance: true,
        lvl: 2,
        hp: 80,
        damage: 12,
        exp: 80,
    },
    weapon: {
        name: "Cajado de ancião",
        scalingStr: 0,
        scalingDex: 0,
        scalingInt: 10,
    },
};

let room3 = {
    num: 3,
    isThereLoot: true,
    isThereEnemy: true,
    enemy: {
        name: "Orc",
        dropChance: true,
        frame: function () {
            enemy_img.innerHTML = `<img src="./assets/orc.jpg"></img>`;
        },
        hp: 160,
        lvl: 4,
        damage: 12,
        exp: 120,
    },
    weapon: {
        name: "Martelo de guerra",
        scalingStr: 12,
        scalingDex: 2,
        scalingInt: 0,
    },
};

let room4 = {
    num: 4,
    isThereLoot: false,
    isThereEnemy: true,
    enemy: {
        name: "Orc Blindado",
        frame: function () {
            enemy_img.innerHTML = `<img src="./assets/orcBlindado.jpg"></img>`;
        },
        dropChance: true,
        hp: 280,
        lvl: 8,
        damage: 14,
        exp: 220,
    },
    weapon: {
        name: "Adaga encantada",
        scalingStr: 0,
        scalingDex: 10,
        scalingInt: 12,
    },
};

let room5 = {
    num: 5,
    isThereLoot: false,
    isThereEnemy: true,
    enemy: {
        name: "Drake",
        frame: function () {
            enemy_img.innerHTML = `<img src="./assets/drake.jpg"></img>`;
        },
        dropChance: true,
        hp: 500,
        lvl: 10,
        damage: 20,
        exp: 1100,
    },
    weapon: "",
};

function procedRoom(p, r) {
    if (!p.room.isThereEnemy) {
        p.room = r;
    } else {
        alert("Um inimigo bloqueia seu caminho");
    }
    proced.innerHTML = `<button onclick="procedRoom2(player, room3)">Avançar</button>`;
    chkLevel(p);
    update(p);
}

function procedRoom2(p, r) {
    if (!p.room.isThereEnemy) {
        p.room = r;
    } else {
        alert("Um inimigo bloqueia seu caminho");
    }
    proced.innerHTML = `<button onclick="procedRoom3(player, room4)">Avançar</button>`;
    chkLevel(p);
    update(p);
}

function procedRoom3(p, r) {
    if (!p.room.isThereEnemy) {
        p.room = r;
    } else {
        alert("Um inimigo bloqueia seu caminho");
    }
    proced.innerHTML = `<button onclick="procedRoom3(player, room5)">Avançar</button>`;
    chkLevel(p);
    update(p);
}

let player = {
    class: function (clss) {
        this.hp = clss.hp;
        this.maxHp = clss.hp;
        this.mp = clss.mp;
        this.maxMp = clss.hp;
        this.str = clss.str;
        this.dex = clss.dex;
        this.int = clss.int;
        this.skill = clss.skill;
        this.weapon = clss.strtWeapon;

        this.room = room1;
        player_name.innerHTML = clss.name;
        player_weapon.innerHTML = this.weapon.name;
        battle_info.innerHTML = `
            <p>Sala: <span id="room_num"></span></p>
            <p>Dano jogador: <span id="player_dmg"></span></p>
            <p>Dano inimigo: <span id="enemy_dmg"></span></p>
            `;

        attack.innerHTML = '<button onclick="player.attack()">Atacar</button>';
        skill.innerHTML = `<button onclick="player.cast()">${clss.skill.name}</button>`;
        heal.innerHTML = '<button onclick="player.heal()">Curar</button>';
        loot.innerHTML = '<button onclick="player.chkLoot()">Vasculhar</button>';
        proced.innerHTML = '<button onclick="player.proced()">Avançar</button>';

        clss.frame();
        update(this);
    },
    lvl: 1,
    maxHp: 0,
    hp: 0,
    maxMp: 0,
    mp: 0,
    exp: 0,
    str: 0,
    dex: 0,
    int: 0,
    potion: 1,
    action: false,
    skill: "",
    weapon: "",
    room: "",
    attack: function () {
        if (this.room.isThereEnemy) {
            let d6 = rollDice(6);
            let d20 = rollDice(20);

            let playerStatusCalc =
                this.weapon.scalingStr * this.str +
                this.weapon.scalingDex * this.dex +
                this.weapon.scalingInt * this.int;
            let playerDmg = this.lvl * d6 + playerStatusCalc;

            if (!this.action) {
                if (d20 <= 20 && d20 >= 16) {
                    alert(crit);
                    this.room.enemy.hp -= playerDmg * 2;
                } else {
                    this.room.enemy.hp -= playerDmg;
                }
            }

            console.log("resultado d6 player: " + d6);
            console.log("resultado d20 player: " + d20);
            enemyTurn(this, this.room.enemy);
            player_dmg.innerHTML = playerDmg;
        } else {
            alert("Não há ninguem para atacar...");
        }

        chkTurn(this, this.room.enemy);
        update(this);
    },
    cast: function () {
        if (this.room.isThereEnemy) {
            if (this.mp >= this.skill.cost) {
                let d10 = rollDice(10);
                let skillDmg = this.skill.dmg + d10;

                this.room.enemy.hp -= skillDmg;
                this.mp -= this.skill.cost;

                player_dmg.innerHTML = skillDmg;
                enemyTurn(this, this.room.enemy);
            } else {
                alert("MP insuficiente!");
            }
        } else {
            alert("Não há ninguem para atacar...");
        }

        chkTurn(this, this.room.enemy);
        update(this);
    },
    heal: function () {
        if (this.potion >= 1) {
            if (this.hp < this.maxHp) {
                this.hp += 50;
            } else if (this.hp >= this.maxHp) {
                this.hp = this.maxHp;
            }

            if (this.potion <= 0) {
                this.potion = this.potion;
            } else {
                this.potion--;
            }
        } else {
            alert("Sem poções");
        }
        update(this);
    },
    chkLoot: function () {
        if (!this.room.isThereEnemy) {
            if (!this.room.isThereLoot) {
                alert("Você vasculha a sala, mas não encontra nada...");
            } else {
                weapon_desc.innerHTML = `<p>Voce encontrou ${this.room.weapon.name} </p>
                <p>Multiplicador força: ${this.room.weapon.scalingStr}</p>
                <p>Multiplicador destreza: ${this.room.weapon.scalingDex}</p>
                <p>Multiplicador inteligencia: ${this.room.weapon.scalingInt}</p>
                <button onclick="equip(player, player.room.weapon)">Equipar</button>
                <button onclick="ignore(player)">Ignorar</button>`;
            }
        } else {
            alert("O inimigo te impede de vasculhar a sala");
        }
    },
    proced: function () {
        procedRoom(this, room2);
    },
};
