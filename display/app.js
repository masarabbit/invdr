import { generateLinks } from '../generate/data.js'

function init() {
  const wrapper = document.querySelector('.wrapper')
  const nearestN = (x, n) => (x === 0 ? 0 : x - 1 + Math.abs(((x - 1) % n) - n))
  const randomN = max => Math.ceil(Math.random() * max)
  const degToRad = deg => deg / (180 / Math.PI)
  const distanceBetween = ({ a: { x, y }, b: { x: x2, y: y2 } }) =>
    Math.round(Math.sqrt((x - x2) ** 2 + (y - y2) ** 2))

  const rotateCoord = ({ deg, pos, offset }) => {
    const rad = degToRad(deg)
    const nX = pos.x - offset.x
    const nY = pos.y - offset.y
    const nSin = Math.sin(rad)
    const nCos = Math.cos(rad)
    return {
      x: Math.round(nCos * nX - nSin * nY + offset.x),
      y: Math.round(nSin * nX + nCos * nY + offset.y),
    }
  }

  const addEvents = (target, event, action, array) => {
    array.forEach(a => target[`${event}EventListener`](a, action))
  }

  const getPagePos = (e, param) =>
    e.targetTouches ? e.touches[0][`page${param}`] : e[`page${param}`]

  const mouse = {
    up: (t, e, a) => addEvents(t, e, a, ['mouseup', 'touchend']),
    move: (t, e, a) => addEvents(t, e, a, ['mousemove', 'touchmove']),
    down: (t, e, a) => addEvents(t, e, a, ['mousedown', 'touchstart']),
    enter: (t, e, a) => addEvents(t, e, a, ['mouseenter', 'touchstart']),
    leave: (t, e, a) => addEvents(t, e, a, ['mouseleave', 'touchend']),
  }

  class Canvas {
    constructor(props) {
      Object.assign(this, {
        el: document.createElement('canvas'),
        ...props,
      })
      if (props?.container) props.container.appendChild(this.el)
      if (this.w) this.resizeCanvas()
      this.ctx = this.el.getContext('2d')
      this.ctx.imageSmoothingEnabled = false
    }
    resizeCanvas() {
      this.el.setAttribute('width', this.w)
      this.el.setAttribute('height', this.h || this.w)
    }
    coord(i) {
      return {
        x: i % (this.w / this.d),
        y: Math.floor(i / (this.w / this.d)),
      }
    }
    clear() {
      this.ctx.clearRect(0, 0, this.w, this.h)
    }
    placeTile(i, color) {
      const { x, y } = this.coord(i)
      const { d } = this
      if (color === 'transparent') {
        this.ctx.clearRect(x, y, d, d)
      } else {
        this.ctx.fillStyle = color || '#fff'
        this.ctx.fillRect(x * d, y * d, d, d)
      }
    }
  }

  class Card {
    constructor(props) {
      Object.assign(this, {
        wrapper: Object.assign(document.createElement('div'), {
          className: 'card-wrapper',
          innerHTML: `
            <div class="card">
              <img src="${props.src}"/>
              <div class="overlay"></div>
            </div>
          `,
          style: `
            width: ${props.w}px;
            height: ${props.h}px;
          `,
        }),
        animation: {
          interval: null,
          phase: 0,
          pos: {
            x: props.w / 2,
            y: props.h / 2,
          },
        },
        ...props,
      })

      this.container.appendChild(this.wrapper)
      this.el = this.wrapper.querySelector('.card')
      this.createOverlay()

      mouse.move(this.el, 'add', e => this.handleInteraction(e))
      mouse.leave(this.el, 'add', () => this.clearProperties())

      this.animationTimer = setTimeout(() => {
        if (!this.animation.interval) this.animateCard()
      }, 2000)
    }
    createOverlay() {
      const { w, h, d } = this
      this.overlay = new Canvas({
        container: this.el,
        w,
        h,
        d,
        cells: new Array((w * h) / (d * d)).fill().map((_, i) => {
          return {
            x: i % (w / d),
            y: Math.floor(i / (w / d)),
            r: 195 - randomN(60),
            g: 155 - randomN(60),
            b: 255 - randomN(60),
          }
        }),
      })
    }
    get center() {
      return {
        x: this.w / 2,
        y: this.h / 2,
      }
    }
    animateCard() {
      this.animation.interval = setInterval(() => {
        if (
          this.animation.phase === 0 &&
          this.animation.pos.x !== 40 &&
          this.animation.pos.y !== 40
        ) {
          this.animation.pos.x += this.w / 2 > 40 ? -1 : 1
          this.animation.pos.y += this.h / 2 > 40 ? -1 : 1
        } else if (this.animation.phase === 0) {
          this.animation.phase = 1
        }

        if (
          this.animation.phase === 1 &&
          Math.abs(this.animation.pos.x - (this.w - 40)) > 10
        ) {
          this.animation.pos.x++
        } else if (this.animation.phase === 1) {
          this.animation.phase = 2
        }

        if (
          this.animation.phase === 2 &&
          Math.abs(this.animation.pos.y - (this.h - 40)) > 10
        ) {
          this.animation.pos.y++
        } else if (this.animation.phase === 2) {
          this.animation.phase = 3
        }

        if (this.animation.phase === 3 && this.animation.pos.x > 40) {
          this.animation.pos.x--
        } else if (this.animation.phase === 3) {
          this.animation.phase = 4
        }

        if (this.animation.phase === 4 && this.animation.pos.y > 40) {
          this.animation.pos.y--
        } else if (this.animation.phase === 4) {
          this.animation.phase = 1
          this.animation.pos.x++
        }
        this.tiltCard(this.animation.pos)
      }, 10)
    }
    tiltCard({ x, y }) {
      this.overlay.clear()
      wrapper.classList.add('interacted')
      const oppositePos = rotateCoord({
        deg: 180,
        pos: { x, y },
        offset: this.center,
      })

      this.overlay.cells.forEach((c, i) => {
        const dist = distanceBetween({
          a: {
            x: nearestN(oppositePos.x - 10, 10) / 10,
            y: nearestN(oppositePos.y - 10, 10) / 10,
          },
          b: c,
        })
        this.overlay.placeTile(
          i,
          `rgba(
            ${c.r - dist},
            ${c.g - dist},
            ${c.b - dist},
            ${2 / nearestN(dist, 2) - 0.09})`,
        )
      })
      const properties = {
        y: ((x - this.center.x) / this.center.x) * 30 + 'deg',
        x: ((y - this.center.y) / this.center.y) * -30 + 'deg',
      }
      Object.keys(properties).forEach(p => {
        this.el.style.setProperty(`--${p}`, properties[p])
      })
      const overlayProperties = {
        mx: x + 'px',
        my: y + 'px',
      }
      Object.keys(overlayProperties).forEach(p => {
        this.wrapper.style.setProperty(`--${p}`, overlayProperties[p])
      })
    }
    stopAnimation() {
      clearInterval(this.animationTimer)
      clearInterval(this.animation.interval)
      this.animation.interval = null
      this.animation.phase = 0
      this.animation.pos = { x: this.w / 2, y: this.h / 2 }
    }
    handleInteraction(e) {
      e.preventDefault()
      const { left, top } = this.el.getBoundingClientRect()
      this.stopAnimation()

      this.tiltCard({
        x: getPagePos(e, 'X') - left,
        y: getPagePos(e, 'Y') - top,
      })
    }
    clearProperties() {
      const properties = {
        x: '0deg',
        y: '0deg',
      }
      this.overlay.clear()
      Object.keys(properties).forEach(p => {
        this.el.style.setProperty(`--${p}`, properties[p])
      })
      clearInterval(this.animationTimer)
      this.animationTimer = setTimeout(() => {
        if (!this.animation.interval) this.animateCard()
      }, 4000)
      wrapper.classList.remove('interacted')
    }
  }

  const param = new URLSearchParams(window.location.search)

  if (param.get('invader')) {
    const imageTarget = new Image()
    const src = `data:image/png;base64,${param.get('invader')}`

    imageTarget.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = imageTarget
      new Card({
        src,
        w: w * 10,
        h: h * 10,
        d: 10,
        container: wrapper,
      })
    }
    imageTarget.src = src
  } else {
    new Card({
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAASCAYAAAC0EpUuAAAAAXNSR0IArs4c6QAAAKNJREFUOE/FlFEOgCAMQ8Vr6Lfe/zj+ew41JI6M0a1qjPpFwvZsWSENadq7l7/0G3TdluJl7GfqiyrVQKExsAsVWAZYpXoPyabQyKunGEI9ldp+pLaB5mJRIGtk39ZoRxUU/Z0NCvUUKLPsna0epKivoHbSNJBngfQ1UAtAtm3NrelLcwSOLsB3Oc1KrUp03rft67yigUX79EG5mgA3/E8AqOcAyeBwpU6Quf8AAAAASUVORK5CYII=',
      w: 210,
      h: 180,
      d: 10,
      container: wrapper,
    })
  }

  generateLinks()
}

window.addEventListener('DOMContentLoaded', init)
