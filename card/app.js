function init() {
  const wrapper = document.querySelector('.wrapper')
  const nearestN = (x, n) => (x === 0 ? 0 : x - 1 + Math.abs(((x - 1) % n) - n))
  const randomN = max => Math.ceil(Math.random() * max)
  // const clampMax = (n, max) => (n < max ? n : max)
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))
  const degToRad = deg => deg / (180 / Math.PI)
  const distanceBetween = ({ a: { x, y }, b: { x: x2, y: y2 } }) =>
    Math.round(Math.sqrt((x - x2) ** 2 + (y - y2) ** 2))

  // const getAngle = ({ a: { x, y }, b: { x: x2, y: y2 } }) => {
  //   const angle = radToDeg(Math.atan2(y - y2, x - x2)) - 90
  //   const adjustedAngle = angle < 0 ? angle + 360 : angle
  //   return Math.round(adjustedAngle)
  // }

  const indicator = document.querySelector('.indicator')

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

  const addMarker = pos => {
    card.el.appendChild(
      Object.assign(document.createElement('div'), {
        style: `
        position: absolute;
        left: ${pos.x}px;
        top: ${pos.y}px;
        margin: -5px 0 0 -5px;
        width: 10px;
        height: 10px;
        background-color: hotpink;
        z-index: 999;
      `,
      }),
    )
  }
  class Card {
    constructor(props) {
      Object.assign(this, {
        wrapper: Object.assign(document.createElement('div'), {
          className: 'card-wrapper',
          innerHTML: `
            <div class="card">
              <img src="${props.src}"/>
              <div class="overlay one"></div>
              <div class="overlay two"></div>
              <div class="overlay three"></div>
            </div>
          `,
          style: `
            width: ${props.w}px;
            height: ${props.h}px;
          `,
        }),
        ...props,
      })

      this.container.appendChild(this.wrapper)
      this.el = this.wrapper.querySelector('.card')
      this.createOverlay()

      mouse.move(this.el, 'add', e => this.handleInteraction(e))
      mouse.leave(this.el, 'add', () => this.clearProperties())
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
    handleInteraction(e) {
      e.preventDefault()
      const { left, top } = this.el.getBoundingClientRect()
      const x = getPagePos(e, 'X') - left
      const y = getPagePos(e, 'Y') - top

      // indicator.innerHTML = `${x} | ${y}`
      // const mousePos = {
      //   x: nearestN(x - 10, 10) / 10,
      //   y: nearestN(y - 10, 10) / 10,
      // }
      this.overlay.clear()

      const oppositePos = rotateCoord({
        deg: 180,
        // pos: mousePos,
        pos: { x, y },
        offset: this.center,
      })
      // addMarker(oppositePos)
      this.overlay.cells.forEach((c, i) => {
        const dist = distanceBetween({
          a: {
            x: nearestN(oppositePos.x - 10, 10) / 10,
            y: nearestN(oppositePos.y - 10, 10) / 10,
          },
          b: c,
        })
        indicator.innerHTML = dist
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
    clearProperties() {
      const properties = {
        x: '0deg',
        y: '0deg',
      }
      this.overlay.clear()
      // this.overlay.cells.forEach((_, i) => {
      //   const dist = 30
      //   this.overlay.placeTile(
      //     i,
      //     `rgba(
      //       ${195 - randomN(60) - dist},
      //       ${155 - randomN(60) - dist},
      //       ${255 - randomN(60) - dist},
      //       ${2 / nearestN(dist, 2)})`,
      //   )
      // })
      Object.keys(properties).forEach(p => {
        this.el.style.setProperty(`--${p}`, properties[p])
      })
    }
  }

  const card = new Card({
    src: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAASCAYAAAC0EpUuAAAAAXNSR0IArs4c6QAAAKNJREFUOE/FlFEOgCAMQ8Vr6Lfe/zj+ew41JI6M0a1qjPpFwvZsWSENadq7l7/0G3TdluJl7GfqiyrVQKExsAsVWAZYpXoPyabQyKunGEI9ldp+pLaB5mJRIGtk39ZoRxUU/Z0NCvUUKLPsna0epKivoHbSNJBngfQ1UAtAtm3NrelLcwSOLsB3Oc1KrUp03rft67yigUX79EG5mgA3/E8AqOcAyeBwpU6Quf8AAAAASUVORK5CYII=`,
    w: 210,
    h: 180,
    d: 10,
    container: wrapper,
  })

  const filterSelect = Object.assign(document.createElement('select'), {
    innerHTML: [
      'multiply',
      'screen',
      'overlay',
      'darken',
      'lighten',
      'color-dodge',
      'color-burn',
      'hard-light',
      'difference',
      'exclusion',
      'hue',
      'saturation',
      'color',
      'luminosity',
      'plus-darker',
      'plus-lighter',
    ].map(option => `<option value="${option}">${option}</option>`),
  })
  document.querySelector('.input-wrapper').appendChild(filterSelect)
  filterSelect.addEventListener('change', e => {
    console.log(e.target.value)
    card.overlay.el.style.mixBlendMode = e.target.value
  })
}

window.addEventListener('DOMContentLoaded', init)
