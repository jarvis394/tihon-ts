import { VK } from 'vk-io'
import { TOKEN as token } from '../config/keys'
import log from './log'

const vk = new VK({ token })

vk.captchaHandler = (payload: { src: string }) => log.warn('Need captcha: ' + payload.src)

export default vk
