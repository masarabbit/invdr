function init() {
  const wrapper = document.querySelector('.wrapper')
  const nearestN = (x, n) => (x === 0 ? 0 : x - 1 + Math.abs(((x - 1) % n) - n))
  const randomN = max => Math.ceil(Math.random() * max)

  class Canvas {
    constructor(props) {
      Object.assign(this, {
        el: Object.assign(document.createElement('canvas'), {
          style: `
          left: ${props.x}px;
          top: ${props.y}px;
        `,
        }),
        ...props,
        color: {
          outline: '#57280f',
          fill: '#fff1b3',
        },
        tiles: new Array(props.h).fill().map((_, i) => {
          return new Array(props.w).fill().map((_, i2) => {
            return {
              x: i2,
              y: i,
            }
          })
        }),
      })
      // console.log(this.tiles)
      if (props?.container) props.container.appendChild(this.el)
      if (this.w) this.resizeCanvas()
      this.ctx = this.el.getContext('2d')
      this.ctx.imageSmoothingEnabled = false
    }
    get width() {
      return this.w * this.d
    }
    get height() {
      return this.h * this.d
    }
    resizeCanvas() {
      this.el.setAttribute('width', this.width)
      this.el.setAttribute('height', this.height || this.width)
    }
    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height)
    }
    placeTile(cell, type) {
      const { x, y } = cell
      const { d } = this

      this.ctx.fillStyle = this.color?.[type] || '#fff'
      this.ctx.fillRect(x * d, y * d, d, d)
      // if (color === 'transparent') {
      //   this.ctx.clearRect(x, y, d, d)
      // } else {
      //   this.ctx.fillStyle = color || '#fff'
      //   this.ctx.fillRect(x * d, y * d, d, d)
      // }
    }
  }

  const c = new Canvas({
    w: 30,
    h: 40,
    x: 50,
    y: 30,
    d: 10,
    container: wrapper,
  })

  c.tiles.forEach((row, i) => {
    const m = nearestN(i, 1)
    const n = m < 20 ? Math.abs(m - 20) : 20 - Math.abs(40 - m)

    row.forEach((t, i) => {
      if (Math.abs(i - 29) < n || i < n) return
      const type = Math.abs(i - 29) === n || i === n ? 'outline' : 'fill'
      c.placeTile(t, type)
    })
  })
}

window.addEventListener('DOMContentLoaded', init)
