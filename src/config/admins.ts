export const ADMINS: number[] = [437920818, 243763437, 555444315]

export const EXCLUDE_ADMINS: boolean = Boolean(
  process.env.EXCLUDE_ADMINS === 'true'
)

export const ADMINS_ONLY: boolean = Boolean(process.env.ADMINS_ONLY === 'true')
