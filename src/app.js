import puppeteer from 'puppeteer'
import fs from 'fs'
import { parse } from 'json2csv'
import getProperties from './getProperties.js'

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

let link =
  'https://suumo.jp/jj/chintai/ichiran/FR301FC005/?shkr1=03&shkr3=03&cb=0.0&shkr2=03&smk=&mt=9999999&sc=13104&ar=030&bs=040&shkr4=03&ct=9999999&md=01&md=02&cn=9999999&ta=13&mb=0&fw2=&et=9999999'

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
