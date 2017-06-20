var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
var cachedTexture = canvas;
var animating = true;
var width, height, radius, centerX, centerY;
var raf = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame;
var theta = 0;
var direction = 1;
var time = performance.now() / 1000;

resize();
tick();

window.addEventListener("resize", resize, false);
document.addEventListener("mousedown", mouseDown, false);

function renderToCache(renderFunction) {
    var buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    renderFunction(buffer.getContext('2d'));
    return buffer;
};

function drawScene() {
	var translate0 = radius/9;
	var translate1 = radius;
	var rotate0 = Math.PI + 60 * theta * Math.PI / 500 + Math.cos(theta * 1.34) * 0.125;
	var rotate1 = Math.PI + 60 * theta * Math.PI / 1234 + Math.sin(theta * 1.23) * -0.125;
	var scale0 = 0.95 + Math.cos(theta / 1.23) * 0.45;
	var scale1 = 0.95 + Math.sin(theta / 1.23) * 0.45;

	cachedTexture = renderToCache( function(ctx) {

		drawContent(ctx); // here!

		ctx.save();
		ctx.globalCompositeOperation = "difference";

		ctx.translate(centerX, centerY);
		ctx.rotate(rotate0);
		ctx.translate(-centerX, -centerY);
		ctx.translate(translate0,translate0);
		ctx.scale(scale0, scale0);

		ctx.drawImage(cachedTexture,0,0);
		ctx.restore();

		ctx.save();
		ctx.globalCompositeOperation = "difference";

		ctx.scale(1,-1);
		ctx.translate(0,-height);

		ctx.translate(centerX, centerY);
		ctx.rotate(rotate1);
		ctx.translate(-centerX, -centerY);
		ctx.translate(translate1,translate1);
		ctx.scale(scale1,scale1);

		ctx.drawImage(cachedTexture,0,0);
    ctx.restore();
	});

	context.globalCompositeOperation = "source-over";
	context.fillStyle = "black";//rgba(255,255,255,1)";
	context.fillRect(0, 0, width, height);
	context.globalCompositeOperation = "difference";
	context.drawImage(cachedTexture,0,0);
}

function drawContent(ctx) {
  var hue0 = 200 * theta * 0.3;
	var gradient = ctx.createRadialGradient(centerX,centerY,radius,centerX,centerY,0);
	gradient.addColorStop(1, "hsla(" + hue0 + ", 50%, 50%, 9)");
	gradient.addColorStop(0, "hsla(" + hue0 + ", 50%, 100%, 9)");
	ctx.fillStyle = gradient;
	ctx.fillRect(0,0,width,height);
}

function tick() {
  var now = performance.now() / 1600;
	if (animating) {
    raf(tick);
    theta += (now - time) * direction;
    time = now;
  } // else raf(tick);
  drawScene();
}

function resize(e) {
	width = window.innerWidth;
	height = window.innerHeight;
	centerX = width / 2;
	centerY = height / 2;
	radius = Math.min(width,height) / 3; // !
	canvas.width = width;
	canvas.height = height;

	if (!animating) drawScene();
}

function mouseDown(e) {
	e.stopPropagation();
	e.preventDefault();

	animating = !animating;
	if (animating) {
    direction *= -1;
    time = performance.now() / 1000;
		tick();
	}
}
