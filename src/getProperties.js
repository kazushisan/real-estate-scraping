const getProperties = async (link, page) => {
  await page.goto(link)
  const properties = await page.$$eval('div.property', (list) => {
    const result = []
    for (let i = 0; i < list.length; i++) {
      const price = list[i]
        .querySelector('.detailbox-property-point')
        .innerText.slice(0, -2)
      const space = list[i]
        .querySelectorAll('td:nth-of-type(3) > div')[1]
        .innerText.slice(0, -2)
      const forthCol = list[i].querySelectorAll('td:nth-of-type(4) > div')
      const isApartment = forthCol[0].innerText === 'アパート' ? 1 : 0
      const isMansion = forthCol[0].innerText === 'マンション' ? 1 : 0
      let years = forthCol[1].innerText
      years = years.replace(/築([0-9]+)年/, '$1')
      if (years === '新築') {
        years = 0
      }

      const travelText = list[i].querySelectorAll(
        '.detailnote > .detailnote-box > div',
      )[0].innerText

      if (!/^.*歩([0-9]+)分$/.test(travelText)) {
        // eslint-disable-next-line no-continue
        continue
      }

      const time = travelText.replace(/^.*歩([0-9]+)分$/, '$1')
      const busTime = /^.*バス([0-9]+)分.*$/.test(travelText)
        ? travelText.replace(/^.*バス([0-9]+)分.*$/, '$1')
        : '0'
      const isTsukuba = /つくばエクスプレス\/つくば駅/.test(travelText) ? 1 : 0
      // eslint-disable-next-line prettier/prettier
      const isKenkyuGakuen = /つくばエクスプレス\/研究学園駅/.test(travelText) ? 1: 0

      result.push({
        price,
        space,
        isApartment,
        isMansion,
        years,
        time,
        busTime,
        isTsukuba,
        isKenkyuGakuen,
      })
    }
    return result
  })
  console.log(`scraped page ${link}`)

  const nextPage = await page.evaluate(() => {
    if (!document.querySelector('.pagination-current').nextElementSibling) {
      return ''
    }
    return document.querySelector('.pagination-current').nextElementSibling
      .nextElementSibling.firstChild.href
  })
  return { properties, nextPage }
}

export default getProperties
