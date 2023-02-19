class Creature {
    constructor (_color, _reproductiveUrge = 20, _life = 100) {
        this.color = _color;
        this.life = _life;
        this.maxLife = _life;
        this.reproductiveUrge = _reproductiveUrge;
    }
}
class Rgb {
    constructor (_r, _g, _b) {
        this.r = _r;
        this.g = _g;
        this.b = _b;
    }
}
const can = document.createElement("canvas");
const ctx = can.getContext('2d');
can.width = 1000;
can.height = 1000;
document.body.appendChild(can);
const size = 100;
const directions = [-size,1,size,-1]
const tiles = [];
let ticksExpected = 0;
let tickRate = 60;
let mutationRate = 20;
const hasSide = getWallData(size);
tiles[toIndex(0,0)] = new Creature(new Rgb(255, 0, 0));
tiles[toIndex(size-1,size-1)] = new Creature(new Rgb(0, 0, 255));
let lastUpdate = Date.now();
update();
function update () {
    const deltaTime = Date.now()-lastUpdate;
    lastUpdate = Date.now();
    ticksExpected += deltaTime/(1000/tickRate);
    for (let i = 0; i < Math.floor(ticksExpected); i++) {
        fixedUpdate();
    }
    ticksExpected -= Math.floor(ticksExpected);
    draw();
    requestAnimationFrame(update);
}
function fixedUpdate() {
    const hasTile = [];
    for (let i = 0; i < size*size; i++) {
        hasTile[i] = !!(tiles[i]);
    }
    for (let i = 0; i < size*size; i++) {
        if (hasTile[i]) {
            tiles[i].life--;
            for (let j = 0; j < 4; j++) {
                if (hasSide[i][j]) {
                    if (!tiles[i+directions[j]]) {
                        const finalColor = new Rgb(0,0,0);
                        let finalRep = 0;
                        let finalLife = 0;
                        let count = 0;
                        for (let k = 0; k < 4; k++) {
                            if (hasSide[i+directions[j]][k]) {
                                if (hasTile[i+directions[j]+directions[k]]) {
                                    if (tiles[i+directions[j]+directions[k]]) {
                                        const col = tiles[i+directions[j]+directions[k]].color;
                                        finalColor.r += col.r;
                                        finalColor.g += col.g;
                                        finalColor.b += col.b;
                                        finalRep += tiles[i+directions[j]+directions[k]].reproductiveUrge;
                                        finalLife += tiles[i+directions[j]+directions[k]].maxLife;
                                        count++;
                                    }
                                }
                            }
                        }
                        finalColor.r /= count;
                        finalColor.g /= count;
                        finalColor.b /= count;
                        finalRep /= count;
                        finalLife /= count;
                        if (randomChange(tiles[i].reproductiveUrge)) {
                            tiles[i+directions[j]] = new Creature(
                                new Rgb(finalColor.r+(Math.random()*mutationRate*(Math.round(Math.random()) ? 1 : -1)),
                                finalColor.g+(Math.random()*mutationRate*(Math.round(Math.random()) ? 1 : -1)),
                                finalColor.b+(Math.random()*mutationRate*(Math.round(Math.random()) ? 1 : -1))),
                                finalRep*(1+(Math.random()*(mutationRate/20)*(Math.round(Math.random()) ? 1 : -1))/100),
                                finalLife*(1+(Math.random()*mutationRate*(Math.round(Math.random()) ? 1 : -1))/100));
                        }
                    }
                }
            }
            if (tiles[i].life < 0) {
                tiles[i] = false;
            }
        }
    }
}
function draw () {
    //ctx.fillStyle = "rgba(255,255,255,0.01)";
    //ctx.fillRect(0,0,can.width,can.height);
    for (let i = 0; i < size*size; i++) {
        if (tiles[i]) {
            const pos = {x: i - ((i/size)|0)*size, y: (i/size)|0};
            ctx.fillStyle = `rgb(${tiles[i].color.r}, ${tiles[i].color.g}, ${tiles[i].color.b})`;
            ctx.fillRect(pos.x*(can.width/size),pos.y*(can.height/size),can.width/size*1.02,can.height/size*1.02);
        }
    }
}
function getWallData(size) {
    const data = [];
    for (let i = 0; i < size*size; i++) {
        data[i] = [];
        const pos = {x: i - ((i/size)|0)*size, y: (i/size)|0}
        data[i][0] = !(pos.y - 1 < 0);
        data[i][2] = !(pos.y + 1 >= size);
        data[i][3] = !(pos.x - 1 < 0);
        data[i][1] = !(pos.x + 1 >= size);
    }
    return data;
}
function toIndex (x,y) {
    return y*size+x;
}
function randomChange(c) {
    return !((Math.random()*c)|0);
}