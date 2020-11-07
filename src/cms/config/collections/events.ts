import { IOTSTOCMSFields } from "@cms/utils"
import { EventFrontmatter } from "@models/events"
import * as A from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/pipeable"
import { CmsCollection } from "netlify-cms-core"

function camelToDashed(string: string): string {
  return string.replace(/[\w]([A-Z])/g, function(m) {
      return m[0] + "-" + m[1];
  }).toLowerCase();
}

export const events: CmsCollection[] = pipe(
  EventFrontmatter.types,
  A.map((type) => {
    const name = type.name
    const fields = IOTSTOCMSFields(type)
    const collectionName = camelToDashed(name)
    
    // console.log({ collectionName, fields })

    return {
      name: collectionName,
      label: `[Events] ${name}`,
      folder: `content/events/${collectionName}/`,
      media_folder:
        `../../../static/media/events/${collectionName}/{{fields.uuid}}/`,
      create: true,
      slug: "{{fields.uuid}}",
      summary: "[{{fields.uuid}}] {{slug}}",
      fields: fields,
    }
  })
)