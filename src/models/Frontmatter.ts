import * as t from 'io-ts'
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString'

export const Frontmatter = t.interface({
  uuid: t.string,
  date: DateFromISOString
}, 'Frontmatter')

export type Frontmatter = t.TypeOf<typeof Frontmatter>