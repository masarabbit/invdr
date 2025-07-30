window.addEventListener('DOMContentLoaded', () => {
  const saveData = localStorage.getItem('ma5a_nvdr_generated_data')

  if (saveData)
    document.querySelector('.wrapper').innerHTML = JSON.stringify(
      saveData,
      null,
      1,
    )

  // document.querySelector({

  // })
})
