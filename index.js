const WIDTH = 1300;
const HEIGHT = 550;
const WORM_LENGTH = 200;
const RAD = 20;
const RAD_HEAD = 10;
const RAD_TAIL = 5

class laval {
    constructor(foliage) {
        this.foliage = foliage;
        this.ctx = foliage.ctx;
        this.headX = Math.random()*WIDTH + 1;
        this.headY = 1;
        this.shorts = [];
        this.color = Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255);

        for (let i = 0; i < WORM_LENGTH; i++) {
            this.shorts.push({
                x: this.headX,
                y: this.headY - i
            });
        }
    }

    isOut() {
        for (let i = 0; i < WORM_LENGTH; i++) {
            let tg = this.shorts[i];
            if (tg.x > 0 && tg.x < WIDTH && tg.y > 0 && tg.y < HEIGHT) {
                return false;
            }
        }
        return true;
    }

    remove() {
        this.foliage.lavals.splice(this.foliage.lavals.indexOf(this), 1);
    }

    update() {
        if (this.isOut()) {
            this.remove();
        }

        // di chuyển của đầu
        let direction = Math.floor(Math.random()*500+1);
        let u, v;
        if (direction > 20) {
            // đi thẳng theo hướng trước
            u = this.shorts[0].x*2 - this.shorts[1].x;
            v = this.shorts[0].y*2 - this.shorts[1].y;
        } else {
            direction = direction*Math.PI/180*360/12;
            u = Math.cos(direction) + this.shorts[0].x;
            v = Math.sin(direction) + this.shorts[0].y;
        }
        // di chuyển của thân
        // chính là truyền trạng thái của đốt trước cho đốt sau
        // bằng với việc thêm 1 đốt vào đầu và xóa 1 phần tử cuối
        this.shorts.unshift({
            x: u,
            y: v
        });
        this.shorts.length = WORM_LENGTH;
    }

    draw() {
        // vẽ thân
        for (let i = 1; i < WORM_LENGTH-2; i++) {
            if (i % 20 == 0) {
                this.ctx.fillStyle = "rgb(" + this.color + ")";
                this.ctx.beginPath();
                this.ctx.arc(this.shorts[i].x,this.shorts[i].y,RAD,0,Math.PI*2);
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
        // vẽ đầu
        this.ctx.fillStyle = "brown";
        this.ctx.beginPath();
        this.ctx.arc(this.shorts[0].x,this.shorts[0].y,RAD_HEAD,0,Math.PI*2);
        this.ctx.fill();
        this.ctx.closePath();
        // vẽ đuôi
        this.ctx.fillStyle = "brown";
        this.ctx.beginPath();
        this.ctx.arc(this.shorts[WORM_LENGTH-2].x,this.shorts[WORM_LENGTH-2].y,RAD_TAIL,0,Math.PI*2);
        this.ctx.fill();
        this.ctx.closePath();
        //
        this.ctx.fillStyle = "brown";
        this.ctx.beginPath();
        this.ctx.arc(this.shorts[WORM_LENGTH-1].x,this.shorts[WORM_LENGTH-1].y,RAD_TAIL,0,Math.PI*2);
        this.ctx.fill();
        this.ctx.closePath();
    }
}

class foliage {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        this.ctx.fillStyle = '#98fb98';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
        document.body.appendChild(this.canvas);

        this.lavals = [];

        setInterval(() => {
            let newLaval = new laval(this);
            this.lavals.push(newLaval);
        }, 800);

        this.loop();
    }

    loop() {
        this.lavals.forEach(worm => worm.update());
        this.draw();
        setTimeout(() => this.loop(), 20);
    }

    draw() {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        this.ctx.fillStyle = '#98fb98';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
        this.lavals.forEach(worm => worm.draw());
    }
}

var worm = new foliage();