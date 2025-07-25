import data from './data.js'

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.wrapper').innerHTML = data.reduce((a, i) => {
    return (
      a +
      `
      <a class="" href="https://masarabbit.github.io/nvdr/card/?invader=${encodeURIComponent(
        i.dataUrl.split(',')[1],
      )}">
        <img src="${i.dataUrl}" alt="${i.name}">
        <p>${i.name}</p>
      </a>`
    )
  }, '')
})
