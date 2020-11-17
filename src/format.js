import fs from 'fs'
import { parse } from 'json2csv'

const data = fs.readFileSync('data.csv', 'utf-8')

const names = [
  'price',
  'space',
  'isApartment',
  'isMansion',
  'years',
  'time',
  'isOneRoom',
  'is1K',
]

const rows = data
  .split('\n')
  .slice(1)
  .map((line) =>
    Object.fromEntries(
      line.split(',').map((col, i) => [names[i], parseFloat(col)]),
    ),
  )

const modifiedRows = rows.map((row) => ({
  ...row,
  price: parseInt(row.price * 10, 10) / 10,
  space: parseInt(row.space, 10),
}))

const rowsOfOneRoom = modifiedRows.filter((row) => row.isOneRoom === 1)

const rowsOf1K = modifiedRows.filter((row) => row.is1K === 1)

const result = []

let notFoundCount = 0

while (rowsOfOneRoom.length > 0) {
  const item = rowsOfOneRoom.shift()

  const itemOfSameConditionIndex = rowsOf1K.findIndex((row) =>
    ['space', 'isApartment', 'isMansion', 'years', 'time'].every(
      (key) => row[key] === item[key],
    ),
  )

  if (itemOfSameConditionIndex === -1) {
    notFoundCount += 1
    // eslint-disable-next-line no-continue
    continue
  }

  const itemOfSameCondition = rowsOf1K[itemOfSameConditionIndex]

  rowsOf1K.splice(itemOfSameConditionIndex, 1)

  result.push({
    priceOfOneRoom: item.price,
    priceOf1K: itemOfSameCondition.price,
    space: item.space,
    isApartment: item.isApartment,
    isMansion: item.isMansion,
    years: item.years,
    time: item.time,
  })
}

console.log({ notFoundCount, createdSize: result.length })

const fields = Object.keys(result[0])
const csv = parse(result, { fields })
fs.writeFileSync('formatted_data.csv', csv)
