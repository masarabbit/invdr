window.addEventListener('DOMContentLoaded', () => {
  const saveData = localStorage.getItem('ma5a_nvdr_generated_data')

  if (saveData) {
    const textarea = document.querySelector('textarea')
    const data = JSON.parse(saveData)
    textarea.value = JSON.stringify(data, null, 2)
    textarea.style.height = textarea.scrollHeight + 'px'

    document
      .querySelector('button[data-id="download"]')
      .addEventListener('click', () => {
        const url = window.URL.createObjectURL(
          new Blob([textarea.value], {
            type: 'text/plain',
          }),
        )
        const link = document.createElement('a')
        link.href = url
        link.download = `nvdr_config_${new Date().getTime()}.txt`
        link.click()
      })

    document
      .querySelector('button[data-id="delete"]')
      .addEventListener('click', () => {
        if (window.confirm('Are you sure you want to delete?')) {
          localStorage.removeItem('ma5a_nvdr_generated_data')
          const textarea = document.querySelector('textarea')
          textarea.value = ''
          textarea.style.height = 'auto'
        }
      })
  }
})

// convert from old config to new one
// const convert = config => {
//   return config
//     .split('|')
//     .map(d => {
//       return d
//         .split(',')
//         .map(c => {
//           return configKey[c.replace('.', '')]
//         })
//         .join('')
//     })
//     .join('0')
// }
