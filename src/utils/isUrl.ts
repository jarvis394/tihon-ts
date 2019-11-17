import isUrl from 'is-url'

export default (url: string): boolean => url ? isUrl(url) : false
