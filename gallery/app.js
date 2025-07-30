import data from './data.js'

window.addEventListener('DOMContentLoaded', () => {
  const saveData = localStorage.getItem('ma5a_nvdr_generated_data')
  const invaderData = saveData ? [...JSON.parse(saveData), ...data] : data
  const F = 5

  document.querySelector('.wrapper').innerHTML = invaderData.reduce((a, i) => {
    if (!i.dataUrl) return a
    return (
      a +
      `
      <a class="thumbnail-link" href="https://masarabbit.github.io/nvdr/card/?invader=${encodeURIComponent(
        i.dataUrl,
      )}">
        <img 
          class="thumbnail" src="data:image/png;base64,${i.dataUrl}" 
          alt="${i.name}"
          style="width: ${i.imgConfig.size.w * F}px;"
        >
        <p>${i.name}</p>
      </a>`
    )
  }, '')

  const invaders = Array.from(document.querySelectorAll('.thumbnail-link')).map(
    (a, i) => {
      return {
        el: a,
        config: invaderData[i],
      }
    },
  )

  console.log(invaders)

  const createImg = ({ dataUrl, size: { w, h } }) => {
    return `
      <img 
        src="data:image/png;base64,${dataUrl}"
        style="
          width: ${w * F}px;
          height: ${h * F}px;
        "
      />
    `
  }

  const createAnimationDisplay = config => {
    const {
      layer1,
      layer2,
      size: { w, h },
    } = config

    const animation = Object.assign(document.createElement('div'), {
      className: `invader-display animate ${w}`,
      style: `
        width: ${w * F}px;
        height: ${h * F}px;
      `,
      innerHTML: `
        <div class="body layer1"> 
          <div class="left" style="left: ${layer1.left.x * F}px; top: ${
        layer1.left.y * F
      }px;">
            ${createImg(layer1)}
          </div>
          <div class="right" style="right: ${layer1.right.x * F}px; top: ${
        layer1.right.y * F
      }px; transform: scale(-1, 1);">
            ${createImg(layer1)}
          </div>
        </div>
        <div class="body layer2">
          <div class="left" style="left: ${layer2.left.x * F}px; top: ${
        layer2.left.y * F
      }px;">
            ${createImg(layer2)}
          </div>
          <div class="right" style="right: ${layer2.right.x * F}px; top: ${
        layer2.right.y * F
      }px; transform: scale(-1, 1);">
            ${createImg(layer2)}
          </div>
        </div>
      `,
    })

    animation.style.setProperty('--d', `${F}px`)

    return animation
  }

  setInterval(() => {
    const invader = invaders[Math.floor(Math.random() * invaders.length)]
    if (!invader || invader.el.classList.contains('img-hidden')) return

    const currentInvader = invader.el
    currentInvader.classList.add('img-hidden')
    const animation = createAnimationDisplay(invader.config.imgConfig)
    invader.el.appendChild(animation)
    setTimeout(() => {
      currentInvader.classList.remove('img-hidden')
      animation.remove()
    }, 8 * 1000)
  }, 2 * 1000)
  // shouldn't be translated 10x anymore, because cell size isn't 10px
})
