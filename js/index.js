let pieces, radius, fft, toggleBtn, audio, uploadBtn, uploadedAudio, uploadAnim;
let uploadLoading = false;
let song;
let img;
let particles = []

function preload() {
	audio = loadSound("audio/TheBlaze.mp3");
	img = loadImage('./images/background.jpeg')
}

function uploaded(file) {
	uploadLoading = true;
	uploadedAudio = loadSound(file.data, uploadedAudioPlay);
}

function uploadedAudioPlay(audioFile) {

	uploadLoading = false;

	if (audio.isPlaying()) {
		audio.pause();
	}

	audio = audioFile;
	audio.loop();
}

function setup() {

	uploadAnim = select('#uploading-animation');

  createCanvas(windowWidth, windowHeight);

	toggleBtn = createButton("Play / Pause");
	uploadBtn = createFileInput(uploaded);
	uploadBtn.addClass("upload-btn");
	toggleBtn.addClass("toggle-btn");
	toggleBtn.mousePressed(toggleAudio);

  angleMode(DEGREES)
  imageMode(CENTER)
  fft = new p5.FFT(0);

  img.filter(BLUR, 12)

	audio.loop();
}


function draw() {

		// Add a loading animation for the uploaded track
		if (uploadLoading) {
			uploadAnim.addClass('is-visible');
		} else {
			uploadAnim.removeClass('is-visible');
		}

  // background(0)
  stroke(255)
  strokeWeight(6)
  noFill();

  translate(width/2, height /2)

  fft.analyze()
  amp = fft.getEnergy(20, 200)

  push()
  if (amp > 230) {
    rotate(random(-0.5, 0.5))
  }

  image(img, 0, 0, width, height)
  pop()


  let wave = fft.waveform()



  for (var t = -1; t <= 1; t += 2) {
     beginShape()
  for (let i = 0; i <= 180; i += 0.5) {
    let index = floor(map(i, 0, 180, 0, wave.length - 1))

    let r = map(wave[index], -1, 1, 150, 200)

    let x = r * sin(i) * t
    let y = r * cos(i)
    vertex(x,y)
  }
  endShape()
  }

  var p = new Particle()
  particles.push(p)

  for (let i = particles.length -1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 230)
      particles[i].show();
    } else {
      particles.splice(i, 1)
    }
  }
}



function toggleAudio() {
	if (audio.isPlaying()) {
		audio.pause();
	} else {
		audio.play();
	}
}

class Particle {
  constructor(){
    this.pos = p5.Vector.random2D().mult(200)
    this.vel = createVector(0, 0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))

    this.w = random(3,5)

    this.color = [255, 255, 255]
 }
  update(cond) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if (cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
  edges() {
    if (this.pos.x <-width / 2 || this.pos.x > width / 2 ||
       this.pos.y < -height /2 || this.pos.y > height / 2) {
      return true
    } else {
      return false
    }
  }

  show() {
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}