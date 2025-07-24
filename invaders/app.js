function init() {
  const wrapper = document.querySelector('.wrapper')
  const directions = [10, -10, 0]
  const indicator = document.querySelector('.indicator')
  const configInput = document.querySelector('textarea[data-id="config"]')
  const dataUrlInput = document.querySelector('textarea[data-id="data-url"]')
  const randomN = max => Math.ceil(Math.random() * max)

  const data = {
    canvas: null,
    invader: null,
    config: {
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

      if (this.w) this.resizeCanvas()
      this.ctx = this.el.getContext('2d')
      this.ctx.imageSmoothingEnabled = false
      this.ctx.fillStyle = '#1b0126'
      this.ctx.fillRect(0, 0, this.width, this.height)
      this.cells.forEach(c => {
        this.placeTile(c, null)
      })
      this.img = Object.assign(document.createElement('div'), {
        className: 'generated-image',
        style: `
          background-image: url(${this.el.toDataURL()});
          width: ${this.w}px;
          height: ${this.h}px;
        `,
      })
      if (props?.container) props.container.appendChild(this.img)
    }
    get width() {
      return this.w / 10
    }
    get height() {
      return this.h / 10
    }
    resizeCanvas(w, h) {
      this.el.setAttribute('width', w || this.width)
      this.el.setAttribute('height', h || w || this.height || this.width)
    }
    placeTile(cell, color) {
      const { x, y } = cell
      if (color === 'transparent') {
        this.ctx.clearRect(x, y, 1, 1)
      } else {
        this.ctx.fillStyle = color || '#fff'
        this.ctx.fillRect(x, y, 1, 1)
      }
    }
    // draw({ x, y, img }) {
    //   this.ctx.drawImage(img.data, x - img.width / 2, y - img.height / 2, img.w, img.h)
    // }
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
      const indexArray = data?.config?.[props.body.type]
      const config = indexArray.length
        ? indexArray[props.index]
        : {
            x: randomPos(),
            y: randomPos(),
          }
      super({
        properties: {
          x1: props.x1 || 0,
          y1: props.y1 || 0,
          x2: directions[config.x],
          y2: directions[config.y],
        },
        indexArray,
        config,
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
      if (configInput.value) {
        const invaderData = configInput.value.split('|')
        data.config = {
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
        .map(c => `${c.config.x}.${c.config.y}`)
        .join(',')}|${this.layer2.leftCells
        .map(c => `${c.config.x}.${c.config.y}`)
        .join(',')}`

      Object.assign(this.el.style, {
        width: `${w}px`,
        height: `${h}px`,
      })

      data.canvas = new Canvas({
        w: w + 40,
        h: h + 40,
        // d: 10,
        container: this.el,
        cells: allPos.map(c => {
          return {
            x: (c.x - x) / 10 + 2,
            y: (c.y - y) / 10 + 2,
          }
        }),
      })

      configInput.value = this.data
      dataUrlInput.value = data.canvas.el.toDataURL()

      const offset = y - data.canvas.img.getBoundingClientRect().top
      data.canvas.img.style.top = `${offset - 40}px`
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

  document.querySelectorAll('.copy').forEach(b => {
    b.addEventListener('click', () => {
      const textarea = document.querySelector(
        `textarea[data-id="${b.dataset.id}"]`,
      )
      textarea.select()
      textarea.setSelectionRange(0, 999999) // For mobile devices
      document.execCommand('copy')
    })
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
    configInput.value = ''
    data.config = { layer1: [], layer2: [] }
    generate()
  })
}

window.addEventListener('DOMContentLoaded', init)
