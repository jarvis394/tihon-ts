import { VK } from 'vk-io'
import { TOKEN as token } from '../config/keys'
import log from './log'

export const vk = new VK({ token })
export const api = vk.api
export const updates = vk.updates
export const collect = vk.collect

vk.captchaHandler = (payload: { src: string }) => log.warn('Need captcha: ' + payload.src)