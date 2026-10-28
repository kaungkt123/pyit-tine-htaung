const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const floorY = 420;

const doll = {
    x: canvas.width / 2,
    y: 150,
    radiusX: 75,
    radiusY: 90,
    color: "#ef0808",
    velocityX: 0,
    velocityY: 0,
    angle: 0,
    angularVelocity: 0
};

const gravity = 1200;
const bounce = 0.45;
const horizontalDrag = 1.5;
const uprightStrength = 18;
const rotationDamping = 5;
const maxThrowSpeed = 1500;
let previousTime = null;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let lastPointerX = 0;
let lastPointerY = 0;
let lastPointerTime = 0;

function getDollGeometry() {
    const sin = Math.sin(doll.angle);
    const cos = Math.cos(doll.angle);

    const halfWidth = Math.sqrt(
        (doll.radiusX * cos) ** 2 +
        (doll.radiusY * sin) ** 2
    );

    const halfHeight = Math.sqrt(
        (doll.radiusX * sin) ** 2 +
        (doll.radiusY * cos) ** 2
    );

    return {
        sin,
        cos,
        halfWidth,
        halfHeight,
        drawingY: doll.y + doll.radiusY - halfHeight
    };
}

function update(deltaTime) {
    if (isDragging) {
        return;
    }

    doll.velocityY += gravity * deltaTime;
    doll.x += doll.velocityX * deltaTime;
    doll.y += doll.velocityY * deltaTime;

    doll.velocityX *= Math.exp(-horizontalDrag * deltaTime);

    const restoringForce = -uprightStrength * doll.angle;
    const damping = -rotationDamping * doll.angularVelocity;

    doll.angularVelocity += (restoringForce + damping) * deltaTime;
    doll.angle += doll.angularVelocity * deltaTime;

    const { halfWidth: tiltedWidth } = getDollGeometry();

    if (doll.y + doll.radiusY >= floorY) {
        doll.y = floorY - doll.radiusY;
        doll.velocityY = -doll.velocityY * bounce;

        if (Math.abs(doll.velocityY) < 20) {
            doll.velocityY = 0;
        }
    }

    if (doll.x - tiltedWidth < 0) {
        doll.x = tiltedWidth;
        doll.velocityX = Math.abs(doll.velocityX) * bounce;
    }

    if (doll.x + tiltedWidth > canvas.width) {
        doll.x = canvas.width - tiltedWidth;
        doll.velocityX = -Math.abs(doll.velocityX) * bounce;
    }

    if (doll.y - doll.radiusY < 0) {
        doll.y = doll.radiusY;
        doll.velocityY = Math.abs(doll.velocityY) * bounce;
    }
}

function drawFloor() {
    ctx.fillStyle = "#dce2cc";
    ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);
}

function drawDoll() {
    const geometry = getDollGeometry();

    ctx.save();
    ctx.translate(doll.x, geometry.drawingY);
    ctx.rotate(doll.angle);
    ctx.translate(-doll.x, -doll.y);

    drawDollShape();

    ctx.restore();
}

function drawBody() {
    ctx.save();
    ctx.translate(doll.x, doll.y);
    ctx.scale(doll.radiusX, doll.radiusY);

    ctx.beginPath();
    ctx.moveTo(0, -1);
    ctx.bezierCurveTo(-0.6, -1, -1, -0.15, -1, 0.35);
    ctx.bezierCurveTo(-1, 0.8, -0.6, 1, 0, 1);
    ctx.bezierCurveTo(0.6, 1, 1, 0.8, 1, 0.35);
    ctx.bezierCurveTo(1, -0.15, 0.45, -1, 0, -1);
    ctx.closePath();

    ctx.fillStyle = doll.color;
    ctx.fill();
    ctx.restore();
}

function drawFace() {
    ctx.save();
    ctx.translate(doll.x, doll.y);
    ctx.scale(doll.radiusX, doll.radiusY);

    ctx.beginPath();
    ctx.moveTo(0, -0.87);
    ctx.bezierCurveTo(-0.34, -0.87, -0.7, -0.3, -0.7, -0.05);
    ctx.bezierCurveTo(-0.7, 0.17, -0.35, 0.28, 0, 0.28);
    ctx.bezierCurveTo(0.34, 0.28, 0.7, 0.17, 0.7, -0.05);
    ctx.bezierCurveTo(0.7, -0.3, 0.34, -0.87, 0, -0.87);
    ctx.closePath();

    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();
}

function drawHair() {
    ctx.save();
    ctx.translate(doll.x, doll.y);
    ctx.scale(doll.radiusX, doll.radiusY);

    ctx.beginPath();
    ctx.moveTo(-0.3, -0.76);
    ctx.bezierCurveTo(-0.17, -0.91, 0.17, -0.91, 0.3, -0.76);
    ctx.quadraticCurveTo(0.12, -0.73, 0.19, -0.55);
    ctx.quadraticCurveTo(0.04, -0.6, 0.04, -0.7);
    ctx.quadraticCurveTo(-0.04, -0.6, 0.01, -0.51);
    ctx.quadraticCurveTo(-0.23, -0.54, -0.3, -0.76);
    ctx.closePath();

    ctx.fillStyle = "#111111";
    ctx.fill();
    ctx.restore();
}

function drawEyes() {
    ctx.save();
    ctx.fillStyle = "#111111";

    ctx.beginPath();
    ctx.arc(doll.x - 20, doll.y - 30, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(doll.x + 20, doll.y - 30, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.arc(doll.x - 22, doll.y - 33, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(doll.x + 18, doll.y - 33, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawSmile() {
    ctx.save();
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(doll.x - 30, doll.y - 9);
    ctx.bezierCurveTo(
        doll.x - 17, doll.y + 10,
        doll.x + 17, doll.y + 10,
        doll.x + 30, doll.y - 9
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(doll.x - 34, doll.y - 5);
    ctx.lineTo(doll.x - 26, doll.y - 15);
    ctx.moveTo(doll.x + 26, doll.y - 15);
    ctx.lineTo(doll.x + 34, doll.y - 5);
    ctx.stroke();

    ctx.restore();
}


function drawDollShape() {
    drawBody();
    drawFace();
    drawHair();
    drawEyes();
    drawSmile();
}

function drawShadow() {
    const height = Math.max(0, floorY - (doll.y + doll.radiusY));
    const shadowWidth = Math.max(20, 55 - height * 0.08);

    ctx.save();
    ctx.globalAlpha = Math.max(0.08, 0.22 - height * 0.0005);
    ctx.fillStyle = "#313d33";

    ctx.beginPath();
    ctx.ellipse(doll.x, floorY + 6, shadowWidth, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFloor();
    drawShadow();
    drawDoll();
}

function getPointerPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * canvas.width / rect.width,
        y: (event.clientY - rect.top) * canvas.height / rect.height
    };
}

canvas.addEventListener("pointerdown", function (event) {
     if (isDragging) {
        return;
    }

    const pointer = getPointerPosition(event);

    const { sin, cos, drawingY } = getDollGeometry();

    const offsetX = pointer.x - doll.x;
    const offsetY = pointer.y - drawingY;

    const localX = offsetX * cos + offsetY * sin;
    const localY = -offsetX * sin + offsetY * cos;

    const dx = localX / doll.radiusX;
    const dy = localY / doll.radiusY;

    if (dx * dx + dy * dy <= 1) {
        isDragging = true;
        dragOffsetX = pointer.x - doll.x;
        dragOffsetY = pointer.y - doll.y;

        doll.velocityX = 0;
        doll.velocityY = 0;
        doll.angularVelocity = 0;

        lastPointerX = pointer.x;
        lastPointerY = pointer.y;
        lastPointerTime = performance.now();

        canvas.setPointerCapture(event.pointerId);
    }
});

canvas.addEventListener("pointermove", function (event) {
   if (!isDragging) {
        return;
    }

    const pointer = getPointerPosition(event);
    const now = performance.now();
    const elapsed = Math.max((now - lastPointerTime) / 1000, 0.001);

    doll.velocityX = Math.max(
        -maxThrowSpeed,
        Math.min(maxThrowSpeed, (pointer.x - lastPointerX) / elapsed)
    );

    doll.velocityY = Math.max(
        -maxThrowSpeed,
        Math.min(maxThrowSpeed, (pointer.y - lastPointerY) / elapsed)
    );

    lastPointerX = pointer.x;
    lastPointerY = pointer.y;
    lastPointerTime = now;

    doll.x = pointer.x - dragOffsetX;
    doll.y = pointer.y - dragOffsetY;

    doll.angle = Math.max(-0.8, Math.min(0.8, doll.velocityX * 0.001));

    const { halfWidth: tiltedWidth } = getDollGeometry();

    doll.x = Math.max(tiltedWidth, Math.min(canvas.width - tiltedWidth, doll.x));
    doll.y = Math.max(doll.radiusY, Math.min(floorY - doll.radiusY, doll.y));
});

function stopDragging(event) {
    if (!isDragging) {
        return;
    }

    if (event.type !== "pointerup" || performance.now() - lastPointerTime > 100) {
        doll.velocityX = 0;
        doll.velocityY = 0;
    }

    doll.angularVelocity = doll.velocityX * 0.01;
    isDragging = false;
}

canvas.addEventListener("pointerup", stopDragging);
canvas.addEventListener("pointercancel", stopDragging);
canvas.addEventListener("lostpointercapture", stopDragging);

function animate(currentTime) {
    if (previousTime === null) {
        previousTime = currentTime;
    }

    const deltaTime = Math.min((currentTime - previousTime) / 1000, 0.03);
    previousTime = currentTime;

    update(deltaTime);
    drawScene();

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", function () {
    isDragging = false;

    doll.x = canvas.width / 2;
    doll.y = 150;
    doll.velocityX = 0;
    doll.velocityY = 0;
    doll.angle = 0;
    doll.angularVelocity = 0;

    previousTime = null;
});