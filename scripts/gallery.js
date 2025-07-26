import data from './data.js'

window.addEventListener('DOMContentLoaded', () => {
  const saveData = localStorage.getItem('ma5a_nvdr_generated_data')
  const invaderData = saveData ? [...JSON.parse(saveData), ...data] : data

  document.querySelector('.wrapper').innerHTML = invaderData.reduce((a, i) => {
    if (!i.dataUrl) return a
    return (
      a +
      `
      <a class="" href="https://masarabbit.github.io/nvdr/card/?invader=${encodeURIComponent(
        i.dataUrl.split(',')[1],
      )}">
        <img src="${i.dataUrl}" alt="${i.name || 'unknown'}">
        <p>${i.name || 'unknown'}</p>
      </a>`
    )
  }, '')
})
