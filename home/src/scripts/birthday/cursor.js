import { throttle } from 'lodash';

class Stars {
  top = 0;

  left = 0;

  color = '';

  char = '';

  lifeStart = 0;

  dom = null;

  container = null;

  options = null;

  fallSpeed = 2;

  constructor(top, left, char, color, lifeStart, options, container) {
    this.top = top;
    this.left = left;
    this.char = char;
    this.color = color;
    this.options = options;
    this.lifeStart = lifeStart;
    this.container = container;
    this.fallSpeed = Math.random() * 3 + 0.1;
    this.moveSpeed = 1 - Math.random() * 3;
  }

  // 渲染
  draw = (d) => {
    const duration = (d - this.lifeStart);
    let opacity = 1.0;
    if (this.dom) {
      opacity = (this.options.lifeTime - duration) / this.options.lifeTime;
      this.top += this.fallSpeed;
      this.left += this.moveSpeed;
    } else {
      this.dom = document.createElement('span');
      this.dom.innerText = this.char;
      this.dom.className = 'cursor-star-item';
      this.container.appendChild(this.dom);
    }
    this.dom.style.left = this.left + 'px';
    this.dom.style.top = this.top + 'px';
    this.dom.style.opacity = opacity;
  };

  // 从容器中移除
  remove = () => {
    this.container.removeChild(this.dom);
  };
}

export class CursorStars {
  static defaultOptions = {
    throttleDuration: 50,      // 响应的间隔，单位ms
    lifeTime: 1000,            // 生存时间，单位ms
    container: 'cursor-stars-container',
  };

  static chars = ['💜️'];

  constructor(options) {
    this.options = { ...CursorStars.defaultOptions, ...options };
    this.starsPoll = [];
    this.container = document.getElementById(this.options.container);
    this.animationTime = 500;
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'cursor-stars-container';
      document.body.appendChild(this.container);
    }
  }

  mouseListenerThrottled = null;

  RAFWorker = null;

  bind() {
    this.mouseListenerThrottled = throttle(this.mouseListener, this.options.throttleDuration);
    document.addEventListener('mousemove', this.mouseListenerThrottled);
    this.RAFWorker = requestAnimationFrame(this.animationLinster);
  }

  unbind() {
    if (this.mouseListenerThrottled) {
      document.removeEventListener('mousemove', this.mouseListenerThrottled);
      this.mouseListenerThrottled = null;
    }
    if (this.RAFWorker) {
      cancelAnimationFrame(this.RAFWorker);
      this.RAFWorker = null;
    }
  }

  animationLinster = (d) => {
    this.animationTime = d;
    for (let i = 0; i < this.starsPoll.length; i++) {
      if ((d - this.starsPoll[i].lifeStart) > this.options.lifeTime) {
        this.starsPoll[i].remove();
        this.starsPoll.splice(i, 1);
      } else {
        this.starsPoll[i].draw(d);
      }
    }
    this.RAFWorker = requestAnimationFrame(this.animationLinster);
  };

  mouseListener = (e) => {
    const { pageX = 0, pageY = 0 } = e;
    const star = new Stars(
      pageY, pageX, CursorStars.chars[Math.floor(Math.random() * CursorStars.chars.length)],
      '', this.animationTime,
      this.options, this.container
    );
    this.starsPoll.push(star);
  }
}
