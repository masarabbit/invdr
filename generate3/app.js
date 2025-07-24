function init() {
  const wrapper = document.querySelector('.wrapper')
  const nearestN = (x, n) => (x === 0 ? 0 : x - 1 + Math.abs(((x - 1) % n) - n))
  const randomN = max => Math.ceil(Math.random() * max)
  // const clampMax = (n, max) => (n < max ? n : max)
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))
  const degToRad = deg => deg / (180 / Math.PI)
  const distanceBetween = ({ a: { x, y }, b: { x: x2, y: y2 } }) =>
    Math.round(Math.sqrt((x - x2) ** 2 + (y - y2) ** 2))

  const getAngle = ({ a: { x, y }, b: { x: x2, y: y2 } }) => {
    const angle = radToDeg(Math.atan2(y - y2, x - x2)) - 90
    const adjustedAngle = angle < 0 ? angle + 360 : angle
    return Math.round(adjustedAngle)
  }

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
        tiles: new Array(props.w * props.h).fill().map((_, i) => {
          return {
            x: i % props.w,
            y: Math.floor(i / props.w),
          }
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
    get r() {
      return {
        x: this.w / 2,
        y: this.h / 2,
      }
    }
    get center() {
      return {
        x: this.w / 2 - 0.5,
        y: this.h / 2 - 0.5,
      }
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
    w: 32,
    h: 28,
    x: 50,
    y: 30,
    d: 10,
    container: wrapper,
  })

  const ellipseRadiusAtAngle = ({ x: a, y: b }, deg) => {
    const theta = degToRad(deg)
    const numerator = a * b
    const denominator = Math.sqrt(
      (a * Math.cos(theta)) ** 2 + (b * Math.sin(theta)) ** 2,
    )
    return Math.round(numerator / denominator)
  }

  // c.tiles.forEach(t => {
  //   const dist = distanceBetween({ a: c.center, b: t })
  //   const angle = getAngle({ a: c.center, b: t })
  //   const r = ellipseRadiusAtAngle(c.center, angle)

  //   if (dist === r) {
  //     c.placeTile(t, 'outline')
  //     console.log(angle)
  //   }
  //   if (dist < r) c.placeTile(t, 'fill')
  // })

  function midPointCircleDraw(x_centre, y_centre, r) {
    var x = r,
      y = 0

    // Printing the initial point
    // on the axes after translation
    c.placeTile(
      {
        x: x + x_centre,
        y: y + y_centre,
      },
      'fill',
    )

    c.placeTile(
      {
        x: -x + x_centre,
        y: 0 + y_centre,
      },
      'fill',
    )

    c.placeTile(
      {
        x: x + x_centre,
        y: -y + y_centre,
      },
      'fill',
    )

    c.placeTile(
      {
        x: -x + x_centre,
        y: -y + y_centre,
      },
      'fill',
    )

    // When radius is zero only a single
    // point will be printed
    // if (r > 0) {

    //     document.write("(" + (x + x_centre) + ", " + (-y + y_centre) + ")");

    //     document.write("(" + (y + x_centre) + ", " + (x + y_centre) + ")");

    //     document.write("(" + (-y + x_centre) + ", " + (x + y_centre) + ")<br/>");
    // }

    // Initialising the value of P
    var P = 1 - r
    while (x > y) {
      y++

      // Mid-point is inside or on the perimeter
      if (P <= 0) P = P + 2 * y + 1
      // Mid-point is outside the perimeter
      else {
        x--
        P = P + 2 * y - 2 * x + 1
      }

      // All the perimeter points have already
      // been printed
      if (x < y) break

      // Printing the generated point and its
      // reflection in the other octants after
      // translation
      c.placeTile(
        {
          x: x + x_centre,
          y: y + y_centre,
        },
        'outline',
      )
      c.placeTile(
        {
          x: -x + x_centre,
          y: y + y_centre,
        },
        'outline',
      )
      c.placeTile(
        {
          x: x + x_centre,
          y: -y + y_centre,
        },
        'outline',
      )
      c.placeTile(
        {
          x: -x + x_centre,
          y: -y + y_centre,
        },
        'outline',
      )

      // If the generated point is on the
      // line x = y then the perimeter points
      // have already been printed
      if (x != y) {
        c.placeTile(
          {
            x: y + x_centre,
            y: x + y_centre,
          },
          'outline',
        )

        c.placeTile(
          {
            x: -y + x_centre,
            y: x + y_centre,
          },
          'outline',
        )

        c.placeTile(
          {
            x: y + x_centre,
            y: -x + y_centre,
          },
          'outline',
        )

        c.placeTile(
          {
            x: -y + x_centre,
            y: -x + y_centre,
          },
          'outline',
        )
      }
    }
  }

  midPointCircleDraw(c.center.x, c.center.y, 10)
}

window.addEventListener('DOMContentLoaded', init)
