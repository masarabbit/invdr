import data from 'data.js'

window.addEventListener('DOMContentLoaded', () => {
  const saveData = localStorage.getItem('ma5a_nvdr_generated_data')
  const invaderData = saveData ? [...JSON.parse(saveData), ...data] : data
  const factor = 6

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
          alt="${i.name || 'unknown'}"
          style="width: ${i.imgConfig.size.w * factor}px; height: ${
        i.imgConfig.size.h * factor
      }px"
        >
        <p>${i.name || 'unknown'}</p>
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
          width: ${w * factor}px;
          height: ${h * factor}px;
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
        width: ${w * factor}px;
        height: ${h * factor}px;
      `,
      innerHTML: `
        <div class="body layer1"> 
          <div class="left" style="left: ${layer1.left.x * factor}px; top: ${
        layer1.left.y * factor
      }px;">
            ${createImg(layer1)}
          </div>
          <div class="right" style="right: ${layer1.right.x * factor}px; top: ${
        layer1.right.y * factor
      }px; transform: scale(-1, 1);">
            ${createImg(layer1)}
          </div>
        </div>
        <div class="body layer2">
          <div class="left" style="left: ${layer2.left.x * factor}px; top: ${
        layer2.left.y * factor
      }px;">
            ${createImg(layer2)}
          </div>
          <div class="right" style="right: ${layer2.right.x * factor}px; top: ${
        layer2.right.y * factor
      }px; transform: scale(-1, 1);">
            ${createImg(layer2)}
          </div>
        </div>
      `,
    })

    animation.style.setProperty('--d', `${factor}px`)

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
  }, 4 * 1000)
  // shouldn't be translated 10x anymore, because cell size isn't 10px
})
