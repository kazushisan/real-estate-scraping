import puppeteer from 'puppeteer'
import fs from 'fs'
import { parse } from 'json2csv'
import getProperties from './getProperties.js'

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

let link =
  'https://suumo.jp/jj/chintai/ichiran/FR301FC005/?ar=030&bs=040&ta=13&sc=13104&cb=0.0&ct=9999999&mb=0&mt=9999999&md=01&md=02&et=9999999&cn=9999999&shkr1=03&shkr2=03&shkr3=03&shkr4=03&sngz=&po1=25&po2=99&pc=100'

const app = async () => {
  const browser = await puppeteer.launch()
  const result = []

  const page = await browser.newPage()

  while (link) {
    const { properties, nextPage } = await getProperties(link, page)
    result.push(...properties)
    link = nextPage
    await sleep(100)
  }

  // const { properties } = await getProperties(link, page)
  // result.push(...properties)
  browser.close()

  const fields = Object.keys(result[0])
  const csv = parse(result, { fields })
  fs.writeFileSync('data.csv', csv)
}

export default app
