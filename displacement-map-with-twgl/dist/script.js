class WebGL {
  constructor() {
    this.canvas = document.querySelector("#canvas");
    this.gl = canvas.getContext("webgl");
    this.textures = [
      "https://i.ibb.co/vZC7swG/wolf.jpg",
      "https://i.ibb.co/YPDnfw1/214676.jpg",
      "https://i.ibb.co/GPvQw0f/fox.jpg",
      "https://i.ibb.co/2nLqZkx/deer-minimalism-vector-background-nature-93845-1920x1080.jpg"
    ];

    this.isClicked = false;
    this.index = 0;
    
    this.ease = 1
    this.duration = Power2.easeIn
    
    this.update = this.update.bind(this);
    
    this.init();
  }

  init() {
    twgl.setDefaults({
      textureColor: [0, 0, 0, 0] // make initial color transparent black
    });

    this.textLoaded = [];

    for (let tex of this.textures) {
      this.textLoaded.push(
        twgl.createTexture(this.gl, {
          src: tex
        })
      );
    }

    this.originalImage = { width: 1, height: 1 }; // replaced after loading
    const text0 = twgl.createTexture(
      this.gl,
      {
        src: this.textures[0]
      },
      (err, texture, source) => {
        this.originalImage = source;
      }
    );

    this.uniforms = {
      u_text0: this.textLoaded[0],
      u_text1: this.textLoaded[1],
      u_matrix: "",
      u_res: [this.gl.canvas.clientWidth, this.gl.canvas.clientHeight],
      u_anim: 0
    };

    // compile shaders, link program, lookup location
    this.programInfo = twgl.createProgramInfo(this.gl, ["vs", "fs"]);

    // calls gl.createBuffer, gl.bindBuffer, gl.bufferData for a quad
    this.bufferInfo = twgl.primitives.createXYQuadBufferInfo(this.gl);

    this.update();
  }

  currentTexture(index) {

    this.isClicked = true;
    
    this.uniforms.u_text1 = this.textLoaded[index];
    
    TweenMax.fromTo(
      this.uniforms,
      this.duration,
      { u_anim: 0 },
      {
        u_anim: 1,
        ease: this.ease,
        onUpdate: () => {
        },
        onComplete: () => {
          this.uniforms.u_text0 = this.textLoaded[index];
          this.isClicked = false;
        }
      }
    );
  }

  update() {
    twgl.resizeCanvasToDisplaySize(this.gl.canvas);

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.useProgram(this.programInfo.program);

    // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
    twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);

    const canvasAspect =
      this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    const imageAspect = this.originalImage.width / this.originalImage.height;
    let mat = m3.scaling(imageAspect / canvasAspect, -1);
    // this assumes we want to fill vertically
    let horizontalDrawAspect = imageAspect / canvasAspect;
    let verticalDrawAspect = -1;
    // does it fill horizontally?

    if (horizontalDrawAspect < 1) {
      // no it does not so scale so we fill horizontally and
      // adjust vertical to match
      verticalDrawAspect /= horizontalDrawAspect;
      horizontalDrawAspect = 1;
    }
    mat = m3.scaling(horizontalDrawAspect, verticalDrawAspect);

    this.uniforms.u_matrix = mat;

    // calls gl.activeTexture, gl.bindTexture, gl.uniformXXX
    twgl.setUniforms(this.programInfo, this.uniforms);

    // calls gl.drawArrays or gl.drawElements
    twgl.drawBufferInfo(this.gl, this.bufferInfo);

    requestAnimationFrame(this.update);
  }

  draw() {}
}

class Slider {
  constructor(opts) {
    this.slider = document.querySelector(opts.el);
    this.containerControls = this.slider.querySelector(
      ".slider-controls__circles"
    );
    this.controls = this.containerControls.querySelectorAll(
      ".slider-controls__item"
    );
    this.texts = this.slider.querySelectorAll(".slider-content__text__item");
    this.numbers = this.slider.querySelectorAll(".slider-controls__number");

    this.duration = opts.duration;
    this.ease = opts.ease;
    
    this.lastIndex = 0
    this.index = 0;

    this.init();
  }

  init() {
    this.webgl = new WebGL();
    this.webgl.ease = this.ease
    this.webgl.duration = this.duration
    
    this.initEvents();
  }

  initEvents() {
    this.containerControls.addEventListener("click", e =>
      this.activeControlItem(e)
    );
  }

  activeControlItem(e) {
    if (!e.target.hasAttribute("data-control")) return;
    this.index = [...this.controls].indexOf(e.target);
    
    if(this.lastIndex === this.index || this.webgl.isClicked)  return
       
    this.webgl.currentTexture(this.index);

    this.controls.forEach((control, i) => {
      if (i === this.index) {
        control.classList.add("active");
      } else {
        control.classList.remove("active");
      }
    });

    this.currentNumberControl(this.index);
    this.currentTextAnimal(this.index);
    
    this.lastIndex = this.index
  }

  currentNumberControl(index) {
    this.numbers.forEach((number, i) => {
      if (i < index) {
        number.classList.add("top");
        number.classList.remove("current");
        number.classList.remove("bottom");
      } else if (i > index) {
        number.classList.add("bottom");
        number.classList.remove("current");
        number.classList.remove("top");
      } else {
        number.classList.add("current");
        number.classList.remove("top");
        number.classList.remove("bottom");
      }
    });
  }

  currentTextAnimal(index) {
    this.texts.forEach((text, i) => {
      if (index === i) {
        text.classList.add("current");
        text.classList.remove("bottom");
      } else {
        text.classList.add("bottom");
        text.classList.remove("current");
      }
    });
  }
}

new Slider({
  el: ".slider",
  duration: 1,
  ease: Expo.easeInOut
});