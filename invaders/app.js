function init() {
  const wrapper = document.querySelector('.wrapper')
  const directions = [10, -10, 0]
  const indicator = document.querySelector('.indicator')
  const textarea = document.querySelector('textarea')
  const randomN = max => Math.ceil(Math.random() * max)

  const data = {
    canvas: null,
    invader: null,
    invaderCode: {
      layer1: [],
      layer2: [],
    },
  }

  const randomPos = () => {
    return Math.floor(Math.random() * 3)
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
      this.ctx.fillStyle = '#1b0126'
      this.ctx.fillRect(0, 0, this.w, this.h)
      this.cells.forEach(c => {
        this.placeTile(c, null)
      })
    }
    resizeCanvas(w, h) {
      this.el.setAttribute('width', w || this.w)
      this.el.setAttribute('height', h || w || this.h || this.w)
    }
    placeTile(cell, color) {
      const { x, y } = cell
      const { d } = this
      if (color === 'transparent') {
        this.ctx.clearRect(x, y, d, d)
      } else {
        this.ctx.fillStyle = color || '#fff'
        this.ctx.fillRect(x, y, d, d)
      }
    }
    draw({ x, y, img }) {
      this.ctx.drawImage(img.data, x - img.w / 2, y - img.h / 2, img.w, img.h)
    }
  }

  class Cell {
    constructor(props) {
      Object.assign(this, {
        el: Object.assign(document.createElement('div'), {
          className: `cell ${props.color || ''}`,
        }),
        ...props,
      })
      this.container.appendChild(this.el)
      this.setProperties()
    }
    setProperties() {
      Object.keys(this.properties).forEach(p => {
        this.el.style.setProperty(`--${p}`, `${this.properties[p]}px`)
      })
    }
  }

  class mirrorCell extends Cell {
    constructor(props) {
      super(props)
      this.body.rightCells.push(this)
    }
    get properties() {
      const { x1, x2, y1, y2 } = this.original.properties
      return {
        x1,
        x2: x2 * -1,
        y1,
        y2,
      }
    }
  }
  class mainCell extends Cell {
    constructor(props) {
      const indexArray = data?.invaderCode?.[props.body.type]
      const invaderCode = indexArray.length
        ? indexArray[props.index]
        : {
            x: randomPos(),
            y: randomPos(),
          }
      super({
        properties: {
          x1: props.x1 || 0,
          y1: props.y1 || 0,
          x2: directions[invaderCode.x],
          y2: directions[invaderCode.y],
        },
        indexArray,
        invaderCode,
        ...props,
      })
      this.body.leftCells.push(this)
      if (
        this.body.leftCells.length <
        (indexArray.length ? indexArray.length : this.body.invader.growthEnd)
      ) {
        this.split()
      } else if (this.body.type === 'layer2') {
        setTimeout(() => {
          this.body.invader.drawCopy()
        }, 2400)
      }
    }
    split() {
      setTimeout(() => {
        this.child = new mainCell({
          x1: this.x2,
          y1: this.y2,
          container: this.el,
          body: this.body,
          index: this.index + 1,
        })
        this.child.mirror = new mirrorCell({
          container: this.mirror.el,
          original: this.child,
          body: this.body,
          index: this.index + 1,
        })
      }, 60)
    }
  }

  class InvaderBody {
    constructor(props) {
      Object.assign(this, {
        el: Object.assign(document.createElement('div'), {
          className: `body ${props.type}`,
          innerHTML: `
            <div class="left"></div>
            <div class="right"></div>
          `,
        }),
        leftCells: [],
        rightCells: [],
        ...props,
      })
      this.invader.el.appendChild(this.el)
      const cell = new mainCell({
        container: this.el.querySelector('.left'),
        body: this,
        index: 0,
      })
      cell.mirror = new mirrorCell({
        container: this.el.querySelector('.right'),
        original: cell,
        body: this,
        index: 0,
      })
    }
  }

  class Invader {
    constructor() {
      if (textarea.value) {
        const invaderData = textarea.value.split('|')
        data.invaderCode = {
          layer1: invaderData[0].split(',').map(c => {
            const indexes = c.split('.')
            return { x: indexes[0], y: indexes[1] }
          }),
          layer2: invaderData[1].split(',').map(c => {
            const indexes = c.split('.')
            return { x: indexes[0], y: indexes[1] }
          }),
        }
      }
      this.growthEnd = 30 + randomN(70)
      this.el = Object.assign(document.createElement('div'), {
        className: 'invader',
      })
      wrapper.appendChild(this.el)
      this.layer1 = new InvaderBody({ invader: this, type: 'layer1' })
      setTimeout(() => {
        this.layer2 = new InvaderBody({ invader: this, type: 'layer2' })
      }, 1000)
    }
    get leftCells() {
      return [...this.layer1?.leftCells, ...this.layer2?.leftCells]
    }
    get rightCells() {
      return [...this.layer1?.rightCells, ...this.layer2?.rightCells]
    }
    get allBoxes() {
      return [...this.leftCells, ...this.rightCells]
    }
    drawCopy() {
      const allPos = this.allBoxes.map(c => {
        const { left, top } = c.el.getBoundingClientRect()
        return { x: Math.round(left), y: Math.round(top) }
      })
      allPos.sort((a, b) => a.x - b.x)
      const x = allPos[0].x
      const w = allPos[allPos.length - 1].x - x + 10

      allPos.sort((a, b) => a.y - b.y)
      const y = allPos[0].y
      const h = allPos[allPos.length - 1].y - y + 10

      this.data = `${this.layer1.leftCells
        .map(c => `${c.invaderCode.x}.${c.invaderCode.y}`)
        .join(',')}|${this.layer2.leftCells
        .map(c => `${c.invaderCode.x}.${c.invaderCode.y}`)
        .join(',')}`

      textarea.value = this.data
      Object.assign(this.el.style, {
        width: `${w}px`,
        height: `${h}px`,
      })

      data.canvas = new Canvas({
        w: w + 40,
        h: h + 40,
        d: 10,
        container: this.el,
        cells: allPos.map(c => {
          return {
            x: c.x - x + 20,
            y: c.y - y + 20,
          }
        }),
      })

      const offset = y - data.canvas.el.getBoundingClientRect().top
      data.canvas.el.style.top = `${offset - 40}px`
    }
  }

  // two segments can be animated separately

  // textarea.value = `1.0,0.2,2.0,1.2,0.0,0.1,2.1,0.0,1.2,1.1,1.2,0.2,2.1,2.0,1.2,0.1,0.1,1.0,2.1,2.1,1.0,2.2,0.1,2.0,1.0,0.1,0.2,0.1,2.1,0.2,2.2,2.1,2.2,0.0,2.1,1.0,0.0,2.1,0.0,2.2,0.0,0.0,1.2,0.2,0.0,2.0,1.1,0.0,1.1,1.0,1.2,2.1,1.0,1.1,0.0,1.1,1.1,1.0,0.2,1.0,1.0,0.0,1.2,0.0,2.1,2.1,1.0,2.1,1.0,0.0,1.1,1.0,2.0,2.1,1.1,2.2,0.2,2.0,1.0,1.0,2.2,2.2,0.1,2.1,0.2,0.0,2.2,1.1,2.0,2.1,1.0,2.1,1.2,2.0,0.2,2.2,0.1,0.0,2.2,1.1|0.0,2.2,2.2,0.1,2.2,1.0,2.0,2.0,1.2,1.2,1.2,2.1,0.1,1.0,0.0,1.1,0.0,2.0,0.1,0.1,2.2,1.1,1.0,0.0,0.0,1.2,2.1,1.2,2.2,0.1,1.1,2.0,1.2,1.1,1.0,2.1,0.2,0.1,1.0,1.2,0.0,2.2,2.0,1.2,0.1,0.2,0.1,1.0,0.2,2.1,0.1,0.2,1.2,2.2,1.1,0.2,1.0,0.2,0.1,1.1,0.1,2.1,1.1,1.1,1.0,0.1,0.0,0.1,2.0,1.2,2.1,2.2,1.0,2.2,0.0,1.2,2.2,1.1,0.0,2.2,0.2,2.0,0.2,1.0,1.2,0.2,0.1,1.2,2.0,1.0,1.0,1.1,0.0,2.0,2.2,1.0,0.2,0.0,0.0,0.2`
  data.invader = new Invader()

  document.querySelector('.download').addEventListener('click', () => {
    if (data.canvas) {
      const link = document.createElement('a')
      link.download = `invader_${new Date().getTime()}.png`
      link.href = data.canvas.el.toDataURL()
      link.click()
    }
  })

  document.querySelector('.copy').addEventListener('click', () => {
    textarea.select()
    textarea.setSelectionRange(0, 999999) // For mobile devices
    document.execCommand('copy')
  })

  const generate = () => {
    if (data.canvas) {
      data.canvas.el.remove()
      data.canvas = null
    }
    if (data.invader) {
      data.invader.el.remove()
      data.invader = null
    }
    data.invader = new Invader()
  }

  document
    .querySelector('.generate-from-code')
    .addEventListener('click', generate)

  document.querySelector('.generate-new').addEventListener('click', () => {
    textarea.value = ''
    data.invaderCode = { layer1: [], layer2: [] }
    generate()
  })
}

window.addEventListener('DOMContentLoaded', init)
