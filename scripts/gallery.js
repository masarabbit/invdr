import data from './data.js'

window.addEventListener('DOMContentLoaded', () => {
  const saveData = localStorage.getItem('ma5a_nvdr_generated_data')
  const invaderData = saveData ? [...JSON.parse(saveData), ...data] : data

  document.querySelector('.wrapper').innerHTML = invaderData.reduce((a, i) => {
    if (!i.dataUrl) return a
    return (
      a +
      `
      <a class="thumbnail-link" href="https://masarabbit.github.io/nvdr/card/?invader=${encodeURIComponent(
        i.dataUrl,
      )}">
        <img class="thumbnail" src="data:image/png;base64,${i.dataUrl}" alt="${
        i.name || 'unknown'
      }">
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
          width: ${w}px;
          height: ${h}px;
        "
      />
    `
  }

  const createAnimationDisplay = config => {
    const { layer1, layer2, w, h } = config
    console.log('check', w * (80 / w), w)
    const factor = 40 / w // TODO this is not quite right
    return Object.assign(document.createElement('div'), {
      className: 'invader-display animate',
      style: `
        width: ${w}px;
        height: ${h}px;
        transform: scale(${1 * factor});
      `,
      innerHTML: `
        <div class="body layer1">
          <div class="left" style="left: ${layer1.left.x}px; top: ${
        layer1.left.y
      }px;">
            ${createImg(layer1)}
          </div>
          <div class="right" style="right: ${layer1.right.x}px; top: ${
        layer1.right.y
      }px; transform: scale(-1, 1);">
            ${createImg(layer1)}
          </div>
        </div>
        <div class="body layer2">
          <div class="left" style="left: ${layer2.left.x}px; top: ${
        layer2.left.y
      }px;">
            ${createImg(layer2)}
          </div>
          <div class="right" style="right: ${layer2.right.x}px; top: ${
        layer2.right.y
      }px; transform: scale(-1, 1);">
            ${createImg(layer2)}
          </div>
        </div>
      `,
    })
  }

  setInterval(() => {
    const invader = invaders[Math.floor(Math.random() * invaders.length)]
    if (!invader || invader.el.classList.contains('img-hidden')) return

    const currentInvader = invader.el
    currentInvader.classList.add('img-hidden')
    const animation = createAnimationDisplay(invader.config.animationConfig)
    document.querySelector('.test-display').appendChild(animation)
    setTimeout(() => {
      // currentInvader.el.classList.remove('img-hidden')
      animation.remove()
    }, 8 * 1000)
  }, 4 * 1000)
})
