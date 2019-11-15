export const ADMINS: number[] = [555444315]

export const EXCLUDE_ADMINS: boolean = Boolean(
  process.env.EXCLUDE_ADMINS === 'true'
)

export const ADMINS_ONLY: boolean = Boolean(process.env.ADMINS_ONLY === 'true')
