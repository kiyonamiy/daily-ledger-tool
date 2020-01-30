import moment from 'moment'
import DailyEvent from './daily-event'
import EventType from './event-type'

function getSubTypeSet(eventTypeList: ReadonlyArray<EventType>): Set<string> {
  const subTypeSet = new Set<string>()

  for (const eventType of eventTypeList) {
    if (eventType.subTypeList == null) {
      continue
    }
    for (const eventSubType of eventType.subTypeList) {
      if (subTypeSet.has(eventSubType.type)) {
        throw Error(`“${eventSubType.type}” 类型重复，请检查 event-type-list ！`)
      }
      subTypeSet.add(eventSubType.type)
    }
  }
  return subTypeSet
}

export default function linesProcess(
  todayFileData: string,
  eventTypeList: ReadonlyArray<EventType>
): { nowDate: moment.Moment; dateEventList: DailyEvent[] } {
  const subTypeSet: Set<string> = getSubTypeSet(eventTypeList)

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
    if (!subTypeSet.has(dailyEvent.getType())) {
      throw Error(`“${dailyEvent.getType()}” 类型不存在，请确认是输入错误还是忘记录入。`)
    }
    dateEventList.push(dailyEvent)

    startOClock = dailyEvent.getEndOClock() // 为下一次循环做准备
  }

  return { nowDate, dateEventList }
}
