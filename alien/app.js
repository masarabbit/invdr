window.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.wrapper')

  //TODO may not need setProperties
  class Body {
    constructor(props) {
      Object.assign(this, {
        el: Object.assign(document.createElement('div'), {
          className: `body ${props.type}`,
          innerHTML: `
            <div class="anchor top"></div>
            <div class="anchor left"></div>
            <div class="anchor right"></div>
            <div class="anchor bottom"></div>
          `,
          // style: `
          //    width: 80px;
          //    height: 80px;
          // `,
        }),
        properties: {
          w: 80,
          h: 80,
        },
        ...props,
      })
      if (props?.container) props.container.appendChild(this.el)
      this.setProperties()
      ;['top', 'left', 'right', 'bottom'].forEach(dir => {
        this[dir] = this.el.querySelector(`.${dir}`)
      })
    }
    setProperties() {
      Object.keys(this.properties).forEach(p => {
        this.el.style.setProperty(`--${p}`, `${this.properties[p]}px`)
      })
    }
  }

  class Alien {
    constructor(props) {
      Object.assign(this, {
        el: Object.assign(document.createElement('div'), {
          className: 'alien',
          style: `
             width: 100px;
             height: 100px;
          `,
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
    new Body({ container: alien.body[dir] })
  })
})
