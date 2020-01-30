import moment from 'moment'

export interface PainDailyEvent {
  readonly startOClock: string
  readonly endOClock: string
  readonly duration: number
  readonly type: string
  readonly detail: string
}

export default class DailyEvent {
  private startOClock: moment.Moment
  private endOClock: moment.Moment
  private duration: number
  private type: string
  private detail: string

  constructor(aLine: string, startOClock: moment.Moment) {
    this.startOClock = startOClock
    // 2:30 前端 写分析日志小工具 很小的工具呀
    // endOClock type ...detail
    const elements = aLine.split(' ')
    this.endOClock = moment(
      `${startOClock.format('YYYY-MM-DD')} ${elements[0]}`,
      'YYYY-MM-DD HH:mm'
    )
    if (this.endOClock.isBefore(this.startOClock)) {
      // 下午增加 12 个小时
      this.endOClock.add(12, 'hours')
    }
    this.duration = this.endOClock.diff(this.startOClock, 'hours', true)
    this.type = elements[1]
    this.detail = elements.slice(2).join(' ')
  }

  getStartOClock() {
    return this.startOClock
  }

  getEndOClock() {
    return this.endOClock
  }

  getDuration() {
    return this.duration
  }

  getType() {
    return this.type
  }

  getDetail() {
    return this.detail
  }
}
