import path from 'path'
import fs from 'fs'
import DailyEvent from './daily-event'
import lineProcess from './line-process'

function getContentFile(fileName: string) {
  const promise = new Promise<string>((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data: string) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
  return promise
}

export default async function recordTodayEvents(todayFilePath: string, dataFilePath: string) {
  // 处理 today.txt
  const todayFileName = path.resolve(__dirname, todayFilePath)
  const todayFileData: string = await getContentFile(todayFileName)
  const { nowDate, eventArray } = lineProcess(todayFileData)

  // 读取旧的 event 列表
  const dataFileName = path.resolve(
    __dirname,
    `${dataFilePath}/${nowDate.year()}/${nowDate.month()}.json`
  )
  const dataFileData: string = await getContentFile(dataFileName)
  let monthEventList: DailyEvent[][]
  if (dataFileData.trim().length === 0) {
    monthEventList = []
  } else {
    monthEventList = JSON.parse(dataFileData)
  }

  // 添加新数据，并回写
  if (monthEventList[nowDate.date() - 1] != null) {
    throw Error('该日期已有数据（防止数据覆盖，请确认日期！）')
  }
  monthEventList[nowDate.date() - 1] = eventArray
  fs.writeFile(dataFileName, JSON.stringify(monthEventList), err => {
    if (err == null) {
      console.log('everything is OK!')
      return
    }
    console.log(err)
  })
}
