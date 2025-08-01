window.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.wrapper')
  const directions = [10, -10, 0]
  const downloadBtn = document.querySelector('.download')
  const animateBtn = document.querySelector('.animate')
  const configInput = document.querySelector('input[data-id="config"]')
  const dataUrlInput = document.querySelector('input[data-id="data-url"]')
  const randomN = max => Math.floor(Math.random() * (max + 1))
  const getDataUrl = el => el.toDataURL().split(',')[1]
  const decodeKey = ['00', '01', '02', '10', '11', '12', '20', '21', '22']
  const configKey = decodeKey.reduce((o, n, i) => ((o[n] = i + 1), o), {})
  const GROW_SPEED = 10

  const testWrapper = document.querySelector('.test-wrapper')

  const data = {
    canvas: null,
    invader: null,
    config: { layer1: [], layer2: [] },
    saveDataName: 'ma5a_nvdr_generated_data',
    savedData: [],
    animation: { frame1: null, frame2: null, frame3: null },
    readData() {
      const saveData = localStorage.getItem(this.saveDataName)
      if (saveData) this.savedData = JSON.parse(saveData)
    },
    saveData(config, dataUrl) {
      this.savedData.push({
        config,
        dataUrl,
        // imgConfig: this.imgConfig,
        name: new Array(3 + randomN(7))
          .fill('')
          .reduce(
            a => (a += 'abcdefghijklmnopqrstuvwxyzaiueoyz'[randomN(32)]),
            '',
          ),
      })
      localStorage.setItem(this.saveDataName, JSON.stringify(this.savedData))
    },
  }

  class Canvas {
    constructor(props) {
      Object.assign(this, {
        el: document.createElement('canvas'),
        ...props,
      })
      this.resizeCanvas()
      this.ctx = this.el.getContext('2d')
      this.ctx.imageSmoothingEnabled = false
    }
    resizeCanvas(w, h) {
      this.el.setAttribute('width', w || this.w)
      this.el.setAttribute('height', h || this.h)
    }
    placeTile(cell, d = 1, offset = { x: 0, y: 0 }) {
      const { x, y } = cell
      this.ctx.fillStyle = '#fff'
      this.ctx.fillRect((x + offset.x) * d, (y + offset.y) * d, d, d)
    }
    // draw({ x, y, size, img }) {
    //   this.ctx.drawImage(img, x, y, size.w, size.h)
    // }
    createImg(w, h) {
      this.img = new Image()
      Object.assign(this.img, {
        className: 'image',
        src: this.el.toDataURL(),
        style: `width: ${w || this.w}px; height: ${h || this.h}px;`,
      })
      if (this?.container) this.container.appendChild(this.img)
      ;[downloadBtn, animateBtn].forEach(b => (b.disabled = false))
    }
  }

  class InvaderCanvas extends Canvas {
    constructor(props) {
      super({
        fill: '#1b0126',
        ...props,
      })
    }
    createDownloadImg(margin = 1, d = 10) {
      const w = (this.w + margin * 2) * d
      const h = (this.h + margin * 2) * d
      this.resizeCanvas(w, h)
      if (this.fill) {
        this.ctx.fillStyle = this.fill
        this.ctx.fillRect(0, 0, w, h)
      }
      this.cells.forEach(c => {
        this.placeTile(
          {
            x: c.x + margin,
            y: c.y + margin,
          },
          d,
        )
      })
      this.downloadImg = this.el.toDataURL()
    }
  }

  class Cell {
    constructor(props) {
      Object.assign(this, {
        el: Object.assign(document.createElement('div'), {
          className: 'cell',
        }),
        ...props,
      })
      this.container.appendChild(this.el)
      ;['x', 'y'].forEach(p =>
        this.el.style.setProperty(`--${p}`, `${this.properties[p]}px`),
      )
    }
  }

  class MirrorCell extends Cell {
    constructor(props) {
      super(props)
      this.body.rightCells.push(this)
    }
    get properties() {
      const { x, y } = this.original.properties
      return { x: x * -1, y }
    }
  }
  class MainCell extends Cell {
    constructor(props) {
      const indexArray = data?.config?.[props.body.type]
      const config = indexArray.length
        ? indexArray[props.index]
        : { x: randomN(2), y: randomN(2) }
      super({
        properties: { x: directions[config.x], y: directions[config.y] },
        config,
        ...props,
      })
      this.body.leftCells.push(this)
      if (
        this.body.leftCells.length <
        (indexArray.length || this.body.invader.growthEnd)
      ) {
        this.split()
      } else if (
        this.body.type === 'layer2' &&
        this.body.invader === data.invader
      ) {
        setTimeout(() => this.body.invader.drawOnCanvas(), 2400)
      }
    }
    split() {
      setTimeout(() => {
        this.child = new MainCell({
          container: this.el,
          body: this.body,
          index: this.index + 1,
        })
        this.child.mirror = new MirrorCell({
          container: this.mirror.el,
          original: this.child,
          body: this.body,
          index: this.index + 1,
        })
      }, GROW_SPEED)
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
      const cell = new MainCell({
        container: this.el.querySelector('.left'),
        body: this,
        index: 0,
      })
      cell.mirror = new MirrorCell({
        container: this.el.querySelector('.right'),
        original: cell,
        body: this,
        index: 0,
      })
    }
  }
  class Invader {
    constructor(props) {
      Object.assign(this, {
        save: true,
        ...props,
      })
      if (configInput.value) this.readConfig()
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
    get allCells() {
      return [
        ...this.layer1?.leftCells,
        ...this.layer2?.leftCells,
        ...this.layer1?.rightCells,
        ...this.layer2?.rightCells,
      ]
    }
    readConfig() {
      const config = configInput.value.split('0')
      data.config = {
        layer1: config[0].split('').map(c => {
          const indexes = decodeKey[+c - 1]
          return { x: indexes[0], y: indexes[1] }
        }),
        layer2: config[1].split('').map(c => {
          const indexes = decodeKey[+c - 1]
          return { x: indexes[0], y: indexes[1] }
        }),
      }
    }
    generateConfig() {
      this.generatedConfig = `${this.layer1.leftCells
        .map(c => configKey[`${c.config.x}${c.config.y}`])
        .join('')}0${this.layer2.leftCells
        .map(c => configKey[`${c.config.x}${c.config.y}`])
        .join('')}`
    }
    getPositions(cells) {
      const positions = cells.map(c => {
        const { left, top } = c.el.getBoundingClientRect()
        return { x: Math.round(left), y: Math.round(top) }
      })
      positions.sort((a, b) => a.x - b.x)
      const x = positions[0].x
      const w = positions[positions.length - 1].x - x + 10

      positions.sort((a, b) => a.y - b.y)
      const y = positions[0].y
      const h = positions[positions.length - 1].y - y + 10

      return { w, h, x, y, positions }
    }
    drawLayer(cells) {
      const { w, h, x, y, positions } = this.getPositions(cells)
      const canvas = new InvaderCanvas({
        w: w / 10,
        h: h / 10,
        fill: null,
        cells: positions.map(c => {
          return {
            x: (c.x - x) / 10,
            y: (c.y - y) / 10,
          }
        }),
        pos: { x: x / 10, y: y / 10 },
      })
      canvas.cells.forEach(c => canvas.placeTile(c))
      canvas.createImg()
      return canvas
    }
    createAnimation() {
      // this.animation = Object.assign(document.createElement('div'), {
      //   className: 'invader-display',
      //   style: `width: ${w}px; height: ${h}px;`,
      // })
      // wrapper.appendChild(this.animation)
      // const { left, top } = this.animation.getBoundingClientRect()
      // const rect = {
      //   x: Math.round(left),
      //   y: Math.round(top),
      // }

      // const offset =
      //   rect.y - [rect.y, this.layer1Img.pos.y, this.layer2Img.pos.y].sort()[0]

      // if (offset) {
      //   this.layer1Img.pos.y += offset
      //   this.layer2Img.pos.y += offset
      //   this.animation.style.transform = `translateY(-${offset}px)`
      // }

      // data.imgConfig = {
      //   size: {
      //     w,
      //     h,
      //   },
      // }
      // ;['layer1', 'layer2'].forEach(l => {
      //   data.imgConfig[l] = {
      //     dataUrl: getDataUrl(this[`${l}Img`].el),
      //     size: {
      //       w: this[`${l}Img`].w,
      //       h: this[`${l}Img`].h,
      //     },
      //     left: {
      //       x: this[`${l}Img`].pos.x - rect.x + 1,
      //       y: this[`${l}Img`].pos.y - rect.y + 2,
      //     },
      //     right: {
      //       x: this[`${l}Img`].pos.x - rect.x,
      //       y: this[`${l}Img`].pos.y - rect.y + 2,
      //     },
      //   }
      // })

      // const animationBody = layer => {
      //   const { left, right } = data.imgConfig[layer]
      //   return `
      //      <div class="${layer}">
      //       <div class="left" style="left: ${left.x * 10}px; top: ${
      //     left.y * 10
      //   }px;"></div>
      //       <div class="right" style="right: ${right.x * 10}px; top: ${
      //     right.y * 10
      //   }px; transform: scale(-1, 1);"></div>
      //     </div>
      //   `
      // }

      // this.animation.innerHTML =
      //   animationBody('layer1') + animationBody('layer2')

      // this.animation
      //   .querySelectorAll('.left')
      //   .forEach((el, i) => el.appendChild(this[`layer${i + 1}Img`].img))
      // this.animation
      //   .querySelectorAll('.right')
      //   .forEach((el, i) =>
      //     el.appendChild(this[`layer${i + 1}Img`].img.cloneNode()),
      //   )

      const { w, h, y, x } = this.getPositions(this.allCells)

      this.layer1Img = this.drawLayer(this.layer1.leftCells)
      const { y: y1, x: x1 } = this.getPositions(this.layer1.leftCells)
      const offset1 = {
        x: Math.abs(x1 - x) / 10,
        y: Math.abs(y1 - y) / 10,
      }

      this.layer2Img = this.drawLayer(this.layer2.leftCells)
      const { y: y2, x: x2 } = this.getPositions(this.layer2.leftCells)
      const offset2 = {
        x: Math.abs(x2 - x) / 10,
        y: Math.abs(y2 - y) / 10,
      }

      Object.keys(data.animation).forEach(frame => {
        data.animation[frame] = new Canvas({
          // w: w + 20,
          // h: h + 20,
          w: w / 10 + 2,
          h: h / 10 + 2,
        })
        testWrapper.appendChild(data.animation[frame].el)
      })

      data.canvas.cells.forEach(c => {
        data.animation.frame1.placeTile({
          x: c.x,
          y: c.y,
        })
      })
      ;[
        {
          a: { x: -1, y: -1 },
          b: { x: 1, y: -1 },
          c: { x: -1, y: 1 },
          d: { x: 1, y: 1 },
          canvas: data.animation.frame2,
        },
        {
          a: { x: 1, y: 1 },
          b: { x: -1, y: 1 },
          c: { x: 1, y: -1 },
          d: { x: -1, y: -1 },
          canvas: data.animation.frame3,
        },
      ].forEach(aConfig => {
        this.layer1Img.cells.forEach(c => {
          aConfig.canvas.placeTile(
            {
              x: offset1.x + c.x + aConfig.a.x,
              y: c.y + offset1.y + aConfig.a.y,
            },
            1,
            { x: 1, y: 1 },
          )
        })
        this.layer1Img.cells.forEach(c => {
          aConfig.canvas.placeTile(
            {
              x: w / 10 - 1 - offset1.x - c.x + aConfig.b.x,
              y: c.y + offset1.y + aConfig.b.y,
            },
            1,
            { x: 1, y: 1 },
          )
        })
        this.layer2Img.cells.forEach(c => {
          aConfig.canvas.placeTile(
            {
              x: offset2.x + c.x + aConfig.c.x,
              y: c.y + offset2.y + aConfig.c.y,
            },
            1,
            { x: 1, y: 1 },
          )
        })
        this.layer2Img.cells.forEach(c => {
          aConfig.canvas.placeTile(
            {
              x: w / 10 - 1 - offset2.x - c.x + aConfig.d.x,
              y: c.y + offset2.y + aConfig.d.y,
            },
            1,
            { x: 1, y: 1 },
          )
        })
      })

      Object.keys(data.animation).forEach(frame => {
        data.animation[frame].createImg(w + 20, h + 20)
        testWrapper.appendChild(data.animation[frame].img)
      })

      // next, instead of rendering on test wrapper,
      // add to animation component so it can be added as animation display
      // then we can remove the old invader display, update the config, and display it in the gallery
    }
    drawOnCanvas() {
      const { w, h, x, y, positions } = this.getPositions(this.allCells)
      this.generateConfig()

      Object.assign(this.el.style, {
        width: `${w}px`,
        height: `${h}px`,
      })
      // create download img
      data.canvas = new InvaderCanvas({
        w: w / 10 + 2,
        h: h / 10 + 2,
        cells: positions.map(c => {
          return {
            x: (c.x - x) / 10 + 1,
            y: (c.y - y) / 10 + 1,
          }
        }),
      })

      configInput.value = this.generatedConfig
      dataUrlInput.value = getDataUrl(data.canvas.el)
      this.createAnimation()
      if (this.save) data.saveData(configInput.value, dataUrlInput.value)
    }
  }

  const generate = ({ save }) => {
    if (data.canvas) {
      data.canvas.el.remove()
      data.canvas = null
    }
    if (data.invader) {
      if (data.invader.el) data.invader.el.remove()
      if (data.invader.animation) data.invader.animation.remove()
      data.invader = null
    }
    data.invader = new Invader({ save })
  }

  configInput.value =
    '94836666277724229829593252521586644345169423299321092742881883524864697135664935946677662799359671257'

  configInput.value =
    '6881218343667515871596313778351428346630268124353325879649274876526523172322935'

  // configInput.value =
  //   '51213323649739187417365668232625627393395378978188531222516241136399478784838198447722126986473765097641789315211198138845589619899213477975523321449616497737969515133722692129715119823347618684224'
  downloadBtn.addEventListener('click', () => {
    if (!data.canvas.downloadImg) data.canvas.createDownloadImg()
    const link = document.createElement('a')
    link.download = `invader_${new Date().getTime()}.png`
    link.href = data.canvas.downloadImg
    link.click()
  })

  animateBtn.addEventListener('click', () => {
    if (data.invader.animation) {
      data.invader.animation.classList.toggle('animate')
      data.invader.el.classList.toggle('hide')
    }
  })

  document.querySelectorAll('.copy').forEach(b => {
    b.addEventListener('click', () => {
      const input = document.querySelector(`input[data-id="${b.dataset.id}"]`)
      input.select()
      input.setSelectionRange(0, 999999) // For mobile devices
      document.execCommand('copy')
    })
  })

  document
    .querySelector('.generate-from-code')
    .addEventListener('click', () => generate({ save: false }))

  document.querySelector('.generate-new').addEventListener('click', () => {
    configInput.value = ''
    dataUrlInput.value = ''
    ;[downloadBtn, animateBtn].forEach(b => (b.disabled = true))
    data.config = { layer1: [], layer2: [] }
    generate({ save: true })
  })

  data.readData()
  data.invader = new Invader()
})
