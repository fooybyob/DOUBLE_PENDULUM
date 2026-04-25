const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set size FIRST
canvas.width = 1000;
canvas.height = 1000;
let trail = [];
let trail_2 = [];

// Then translate
ctx.translate(canvas.width / 2, canvas.height / 2 - 200);

let r1 = 150;
let r2 = 150;

let m1 = 20;
let m2 = 20;

let a1 = Math.PI / 2;
let a2 = Math.PI / 2;

let a1_v = 0;
let a2_v = 0;

let g = 1;
let damping = 0.99999;

function draw() {
  ctx.clearRect(
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
  ctx.fillStyle = "white";
  ctx.fillRect(
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  let num1 = -g * (2 * m1 + m2) * Math.sin(a1);
  let num2 = -m2 * g * Math.sin(a1 - 2 * a2);
  let num3 = -2 * Math.sin(a1 - a2) * m2;
  let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * Math.cos(a1 - a2);
  let den = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
  let a1_a = (num1 + num2 + num3 * num4) / den;

  num1 = 2 * Math.sin(a1 - a2);
  num2 = a1_v * a1_v * r1 * (m1 + m2);
  num3 = g * (m1 + m2) * Math.cos(a1);
  num4 = a2_v * a2_v * r2 * m2 * Math.cos(a1 - a2);
  den = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
  let a2_a = (num1 * (num2 + num3 + num4)) / den;

  let x1 = r1 * Math.sin(a1);
  let y1 = r1 * Math.cos(a1);

  let x2 = x1 + r2 * Math.sin(a2);
  let y2 = y1 + r2 * Math.cos(a2);
  // save position to trail
  trail.push({ x: x2, y: y2 });
  if (trail.length > 1000) trail.shift(); // limit trail length

  // draw trail
  ctx.beginPath();
  ctx.moveTo(trail[0].x, trail[0].y);
  for (let i = 1; i < trail.length; i++) {
    ctx.lineTo(trail[i].x, trail[i].y);
  }
  ctx.strokeStyle = "red";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  trail_2.push({ x: x1, y: y1 });
  if (trail_2.length > 1000) trail_2.shift();

  ctx.beginPath();
  ctx.moveTo(trail_2[0].x, trail_2[0].y);
  for (let i = 0; i < trail_2.length; i++) {
    ctx.lineTo(trail_2[i].x, trail_2[i].y);
  }
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // line pend1
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  // circle at end of line pend1
  ctx.beginPath();
  ctx.ellipse(x1, y1, m1, m1, 0, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();

  // line pend2
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  //circle at the end of line pend2
  ctx.beginPath();
  ctx.ellipse(x2, y2, m2, m2, 0, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();

  // update angles
  a1_v += a1_a;
  a2_v += a2_a;
  a1_v *= damping;
  a2_v *= damping;
  a1 += a1_v;
  a2 += a2_v;
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
