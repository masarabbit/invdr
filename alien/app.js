window.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.wrapper')
  const randomN = max => Math.ceil(Math.random() * max)

  //TODO may not need setProperties
  class Body {
    constructor(props) {
      Object.assign(this, {
        el: Object.assign(document.createElement('div'), {
          className: `body ${props.type}`,
          innerHTML:
            props.anchors ||
            `
            <div class="anchor top" data-dir="top"></div>
            <div class="anchor left" data-dir="left"></div>
            <div class="anchor right" data-dir="right"></div>
            <div class="anchor bottom" data-dir="bottom"></div>
          `,
          style: `
             width: ${props.w || 80}px;
             height: ${props.h || 80}px;
          `,
        }),
        // properties: {
        //   w: 80,
        //   h: 80,
        // },
        ...props,
      })
      if (props?.container) props.container.appendChild(this.el)
      // this.setProperties()
      this.el.setAttribute('test', this.connectionDir)
      this.setAnchors()
      // console.log(this.container.dataset.dir)
    }
    setAnchors() {
      ;['top', 'left', 'right', 'bottom'].forEach(dir => {
        this[dir] = this.el.querySelector(`[data-dir='${dir}']`)
      })
    }
    get connectionDir() {
      if (!this?.container?.dataset?.dir) return 'test'
      return this.container.dataset.dir
    }
    // setProperties() {
    //   Object.keys(this.properties).forEach(p => {
    //     this.el.style.setProperty(`--${p}`, `${this.properties[p]}px`)
    //   })
    // }
  }

  class Circle extends Body {
    constructor(props) {
      super({
        type: 'circle',
        w: 60,
        h: 60,
        // properties: {
        //   w: 60,
        //   h: 60,
        // },
        ...props,
      })
    }
  }

  class Square extends Body {
    constructor(props) {
      super({
        type: 'square',
        // properties: {
        //   w: 70,
        //   h: 70,
        // },
        w: 70,
        h: 70,
        ...props,
      })
      // TODO
      ;['top', 'left', 'right', 'bottom'].forEach(dir => {
        if (randomN(6) === 6) {
          const bodyPart = randomN(2) === 2 ? Circle : Square
          new bodyPart({ container: this[dir] })
        }
      })
    }
  }

  class Alien {
    constructor(props) {
      Object.assign(this, {
        el: Object.assign(document.createElement('div'), {
          className: 'alien',
          // style: `
          //    width: 100px;
          //    height: 100px;
          // `,
        }),
        ...props,
      })
      wrapper.appendChild(this.el)
      this.body = new Body({
        container: this.el,
      })
    }
  }

  const alien = new Alien()

  ;['top', 'left', 'right', 'bottom'].forEach(dir => {
    // new Body({ container: alien.body[dir] })
    const bodyPart = randomN(2) === 2 ? Circle : Square
    new bodyPart({ container: alien.body[dir] })
  })
})
