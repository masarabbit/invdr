import { data, saveDataName, url, generateLinks } from '../generate/data.js'

window.addEventListener('DOMContentLoaded', () => {
  const saveData = localStorage.getItem(saveDataName)
  const invaderData = saveData ? [...JSON.parse(saveData), ...data] : data
  const F = 4

  document.querySelector('.wrapper').innerHTML = invaderData.reduce((a, i) => {
    if (!i.imgConfig.frames.length) return a
    return (
      a +
      `<a class="thumbnail-link" href="${url}/display/?invader=${encodeURIComponent(
        i.imgConfig.frames[0],
      )}">
        <img 
          class="thumbnail" src="data:image/png;base64,${
            i.imgConfig.frames[0]
          }" 
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

  const createAnimationDisplay = config => {
    const {
      frames,
      size: { w, h },
    } = config
    const animation = Object.assign(document.createElement('div'), {
      className: 'invader-display animate',
      style: `width: ${w * F}px; height: ${h * F}px;`,
      innerHTML: `<div style="width: 300%; display: flex;">${frames.reduce(
        (a, f) =>
          (a += `
            <img src="data:image/png;base64,${f}" style="width: ${w * F}px;"/>
            `),
        '',
      )}</div>`,
    })
    animation.style.setProperty('--w', `-${w * F}px`)
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

  generateLinks()

  // invaders.forEach(invader => {
  //   if (!invader || invader.el.classList.contains('img-hidden')) return

  //   const currentInvader = invader.el
  //   currentInvader.classList.add('img-hidden')
  //   const animation = createAnimationDisplay(invader.config.imgConfig)
  //   invader.el.appendChild(animation)
  // })
})
