const { format } = require('date-fns')
const { v4: uuid } = require('uuid')

console.log('TimeStamp: ', format(new Date(), 'yyyyMMdd\tHH:mm:ss'))

console.log('hello...')
console.log('Generated ID: ', uuid())