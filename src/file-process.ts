import path from 'path'
import fs from 'fs'
import DailyEvent, { PainDailyEvent } from './daily-event'
import lineProcess from './line-process'
import EventType from './event-type'

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

function stringifyMonthEventList(dateEventList: DailyEvent[]): PainDailyEvent[] {
  const painDateEventList: PainDailyEvent[] = []
  for (let dailyEvent of dateEventList) {
    painDateEventList.push({
      startOClock: dailyEvent.getStartOClock().format('YYYY-MM-DD HH:mm'),
      endOClock: dailyEvent.getEndOClock().format('YYYY-MM-DD HH:mm'),
      duration: dailyEvent.getDuration(),
      type: dailyEvent.getType(),
      detail: dailyEvent.getDetail()
    })
  }
  return painDateEventList
}

export default async function recordTodayEvents(todayFilePath: string, dataFilePath: string) {
  // 读取 event-type-list，防止 today.txt 中出现未被记录的 type
  const eventTypesFileName = path.resolve(__dirname, `${dataFilePath}/event-type-list.json`)
  const eventTypesFileData: string = await getContentFile(eventTypesFileName)
  const eventTypeList: ReadonlyArray<EventType> = JSON.parse(eventTypesFileData)
  // 处理 today.txt，产出今日新数据
  const todayFileName = path.resolve(__dirname, todayFilePath)
  const todayFileData: string = await getContentFile(todayFileName)
  const { nowDate, dateEventList } = lineProcess(todayFileData, eventTypeList) // dateEventList 即新数据

  // 读取旧的 event 列表
  const monthFileName = path.resolve(
    __dirname,
    `${dataFilePath}/${nowDate.year()}/${nowDate.month()}.json`
  )
  const monthFileData: string = await getContentFile(monthFileName)
  let monthEventList: PainDailyEvent[][]
  if (monthFileData.trim().length === 0) {
    monthEventList = []
  } else {
    monthEventList = JSON.parse(monthFileData)
  }

  // 添加新数据，并回写
  if (monthEventList[nowDate.date() - 1] != null) {
    throw Error('该日期已有数据（防止数据覆盖，请确认日期！）')
  }
  const painDateEventList = stringifyMonthEventList(dateEventList)
  monthEventList[nowDate.date() - 1] = painDateEventList
  fs.writeFile(monthFileName, JSON.stringify(monthEventList), err => {
    if (err == null) {
      console.log('everything is OK!')
      return
    }
    console.log(err)
  })
}
