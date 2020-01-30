import moment from 'moment'
import DailyEvent from './daily-event'
import EventType from './event-type'

function getSubTypeList(eventTypeList: ReadonlyArray<EventType>): string[] {
  const subTypeList: string[] = []

  for (const eventType of eventTypeList) {
    if (eventType.subTypeList == null) {
      continue
    }
    for (const eventSubType of eventType.subTypeList) {
      subTypeList.push(eventSubType.type)
    }
  }

  return subTypeList
}

export default function linesProcess(
  todayFileData: string,
  eventTypeList: ReadonlyArray<EventType>
): { nowDate: moment.Moment; dateEventList: DailyEvent[] } {
  const subTypeList: string[] = getSubTypeList(eventTypeList)

  const lines: string[] = todayFileData.split('\n')

  // 获取当前日期
  const nowDate: moment.Moment = moment(lines[0], 'YYYY-MM-DD HH:mm:ss') // YYYYY-MM-DD

  // 获取所有 event
  const dateEventList: DailyEvent[] = []
  let startOClock: moment.Moment = nowDate // YYYYY-MM-DD 00:00:00
  for (let i = 1; i < lines.length; i++) {
    lines[i] = lines[i].trim()
    if (lines[i] === '') {
      continue
    }
    const dailyEvent = new DailyEvent(lines[i], startOClock)

    // --- for show data ---
    dailyEvent.type = subTypeList[Math.floor(subTypeList.length * Math.random())]
    dailyEvent.detail = Math.random() > 0.75 ? `mock${dailyEvent.type}详情` : ''
    // if (!subTypeSet.has(dailyEvent.getType())) {
    //   throw Error(`“${dailyEvent.getType()}” 类型不存在，请确认是输入错误还是忘记录入。`)
    // }
    dateEventList.push(dailyEvent)

    startOClock = dailyEvent.getEndOClock() // 为下一次循环做准备
  }

  return { nowDate, dateEventList }
}
