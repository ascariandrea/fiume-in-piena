import * as t from 'io-ts'

const ActorFrontmatter = t.interface({
    title: t.string,
    username: t.string,
    cover: t.union([t.null, t.string]),
    avatar: t.string
}, 'ActorFrontmatter')

export const ActorFileNode = t.interface({
    id: t.string,
    relativeDirectory: t.string,
    childMarkdownRemark: t.interface({
      frontmatter: ActorFrontmatter
    }, 'ActorFileNodeChildMarkdownRemark')
}, 'ActorFileNode')

export type ActorFileNode = t.TypeOf<typeof ActorFileNode>