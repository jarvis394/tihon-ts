import EventEmitter from 'events'

class Events extends EventEmitter {}

const events = new Events()

export default events