import puppeteer from 'puppeteer-core'
import fs from 'fs'
import json2csv from 'json2csv'
import getProperties from './getProperties'

const { parse } = json2csv
const sleep = time => new Promise(resolve => setTimeout(resolve, time))

let link =
  'https://suumo.jp/jj/chintai/ichiran/FR301FC005/?ar=030&bs=040&ra=008&rn=0760&ek=076076160&cb=0.0&ct=9999999&mb=0&mt=9999999&et=9999999&cn=9999999&shkr1=03&shkr2=03&shkr3=03&shkr4=03&sngz=&po1=25&po2=99&pc=50'

const app = async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox']
    })
    const result = []

    const page = await browser.newPage()

    while (link) {
      const { properties, nextPage } = await getProperties(link, page)
      result.push(...properties)
      link = nextPage
      await sleep(100)
    }
    browser.close()

    const fields = Object.keys(result[0])
    const csv = parse(result, { fields })
    fs.writeFileSync('data.csv', csv)
  } catch (err) {
    throw err
  }
}

export default app
