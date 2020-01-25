import recordTodayEvents from './file-process'
import 'moment/locale/zh-cn'

const TODAY_FILE_NAME = '../data/today.txt'
const DATA_FILE_NAME = '../../daily-ledger-frontend/public/data'
recordTodayEvents(TODAY_FILE_NAME, DATA_FILE_NAME)
