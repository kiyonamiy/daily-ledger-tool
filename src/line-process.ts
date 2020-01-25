import moment from 'moment'
import DailyEvent from './daily-event'

export default function linesProcess(
  todayFileData: string
): { nowDate: moment.Moment; eventArray: DailyEvent[] } {
  const lines: string[] = todayFileData.split('\n')

  // 获取当前日期
  const nowDate: moment.Moment = moment(lines[0], 'YYYY-MM-DD HH:mm:ss') // YYYYY-MM-DD

  // 获取所有 event
  const eventArray: DailyEvent[] = []
  let startOClock: moment.Moment = nowDate // YYYYY-MM-DD 00:00:00
  for (let i = 1; i < lines.length; i++) {
    lines[i] = lines[i].trim()
    if (lines[i] === '') {
      continue
    }
    const dailyEvent = new DailyEvent(lines[i], startOClock)
    eventArray.push(dailyEvent)

    startOClock = dailyEvent.getEndOClock() // 为下一次循环做准备
  }

  return { nowDate, eventArray }
}
