/* eslint-disable no-restricted-imports */
import * as Eq from "fp-ts/lib/Eq"
import * as t from "io-ts"
import fs from "fs"
import path from "path"
import * as A from "fp-ts/lib/Array"
import * as O from "fp-ts/lib/Option"
import * as E from "fp-ts/lib/Either"
import {
  CreatePagesArgs,
  CreateSchemaCustomizationArgs,
  SourceNodesArgs,
  Node,
  CreateNodeArgs,
  CreateResolversArgs,
} from "gatsby"
import { GroupMarkdownRemark, GroupFrontmatter } from "../src/models/group"
import { ArticleFrontmatter } from "../src/models/article"
import { ActorFrontmatter } from "../src/models/actor"
import { TopicFrontmatter } from "../src/models/topic"
import { pipe } from "fp-ts/lib/pipeable"
import { EventFrontmatter } from "../src/models/event"
import { PageFrontmatter } from "../src/models/page"
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable"

const group = <A>(S: Eq.Eq<A>): ((as: Array<A>) => Array<Array<A>>) => {
  return A.chop((as) => {
    const { init, rest } = A.spanLeft((a: A) => S.equals(a, as[0]))(as)
    return [init, rest]
  })
}

const createArticlePages = async ({
  actions,
  graphql,
  reporter,
}: CreatePagesArgs): Promise<void> => {
  const { createPage } = actions
  const postTemplate = path.resolve(
    `src/templates/ArticleTemplate/ArticleTemplate.tsx`
  )

  const result = await graphql<{
    articles: { nodes: ArticleFrontmatter[] }
  }>(`
    {
      articles: allArticleFrontmatter {
        nodes {
          uuid
          title
          path
        }
      }
    }
  `)

  // Handle errors
  if (result.errors !== undefined) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  if (result.data === undefined) {
    reporter.panicOnBuild(`No data for article pages`)
    return
  }

  result.data.articles.nodes.forEach((node) => {
    const context = {
      articleUUID: node.uuid,
    }

    reporter.info(
      `article page [${node.title}] context: ${JSON.stringify(
        context,
        null,
        4
      )}`
    )

    createPage({
      path: `/articles/${node.path}`,
      component: postTemplate,
      // additional data can be passed via context
      context,
    })
  })
}

const createGroupPages = async ({
  actions,
  graphql,
  reporter,
}: CreatePagesArgs): Promise<void> => {
  const { createPage } = actions
  const groupTemplate = path.resolve(
    `src/templates/GroupTemplate/GroupTemplate.tsx`
  )

  const result = await graphql<{
    groups: { nodes: { childMarkdownRemark: GroupMarkdownRemark }[] }
  }>(`
    {
      groups: allFile(filter: { sourceInstanceName: { eq: "groups" } }) {
        nodes {
          childMarkdownRemark {
            frontmatter {
              ... on GroupFrontmatter {
                uuid
                name
                members {
                  uuid
                }
              }
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.errors !== undefined) {
    reporter.panicOnBuild(
      `Error while running createTimelinePages query.`,
      result.errors
    )
    return
  }

  if (result.data === undefined) {
    reporter.panicOnBuild(`No data for group pages`)
    return
  }

  const nodes = result.data.groups.nodes

  nodes.forEach((node) => {
    const groupUUID = node.childMarkdownRemark.frontmatter.uuid
    const nodePath = `/groups/${groupUUID}`

    const context = {
      group: groupUUID,
      members: (node.childMarkdownRemark.frontmatter.members as any).map(
        (m: any) => m.uuid
      ),
    }

    reporter.info(
      `Group template [${groupUUID}], context: ${JSON.stringify(
        context,
        null,
        4
      )}`
    )

    createPage({
      path: nodePath,
      component: groupTemplate,
      // additional data can be passed via context
      context,
    })
  })
}

const createActorTimelinePages = async ({
  actions,
  graphql,
  reporter,
}: CreatePagesArgs): Promise<void> => {
  const { createPage } = actions
  const postTemplate = path.resolve(
    `src/templates/ActorTimelineTemplate/ActorTimelineTemplate.tsx`
  )

  const result = await graphql<{ actors: { nodes: Array<{ name: string }> } }>(`
    {
      actors: allFile(filter: { sourceInstanceName: { eq: "actors" } }) {
        nodes {
          name
        }
      }
    }
  `)

  // Handle errors
  if (result.errors !== undefined) {
    reporter.panicOnBuild(`Error while running createTimelinePages query.`)
    return
  }

  if (result.data === undefined) {
    reporter.panicOnBuild(`No data for actor pages`)
    return
  }

  const nodes = result.data.actors.nodes
  nodes.forEach((node) => {
    const actorUUID = node.name
    const nodePath = `/actors/${actorUUID}`

    const context = {
      actorUUID,
    }

    reporter.info(
      `Actor page [${nodePath}] context: ${JSON.stringify(context, null, 4)}`
    )

    createPage({
      path: nodePath,
      component: postTemplate,
      // additional data can be passed via context
      context,
    })
  })
}

const createEventPages = async ({
  actions,
  graphql,
  reporter,
}: CreatePagesArgs): Promise<void> => {
  const { createPage } = actions
  const postTemplate = path.resolve(`src/templates/EventTemplate.tsx`)

  const result = await graphql<{ events: { nodes: Array<{ name: string }> } }>(`
    {
      events: allFile(filter: { sourceInstanceName: { eq: "events" } }) {
        nodes {
          name
        }
      }
    }
  `)

  // Handle errors
  if (result.errors !== undefined) {
    reporter.panicOnBuild(`Error while running createEventPages query.`)
    return
  }

  if (result.data === undefined) {
    reporter.panicOnBuild(`No data for actor pages`)
    return
  }

  const nodes = result.data.events.nodes
  nodes.forEach((node) => {
    const eventUUID = node.name
    const nodePath = `/events/${eventUUID}`

    const context = {
      eventUUID,
    }

    reporter.info(
      `Event page [${nodePath}] context: ${JSON.stringify(context, null, 4)}`
    )

    createPage({
      path: nodePath,
      component: postTemplate,
      // additional data can be passed via context
      context,
    })
  })
}

// const createNetworkPages = async ({
//   actions,
//   graphql,
//   reporter,
// }: CreatePagesArgs): Promise<void> => {
//   const { createPage } = actions

//   const result = await graphql<{
//     networks: { nodes: Array<{ name: string }> }
//   }>(`
//     {
//       networks: allDirectory(
//         filter: { relativeDirectory: { glob: "networks" } }
//       ) {
//         nodes {
//           name
//         }
//       }
//     }
//   `)

//   // Handle errors
//   if (result.errors !== undefined) {
//     reporter.panicOnBuild(`Error while running GraphQL allNetworks query.`)
//     return
//   }

//   const component = path.resolve(
//     `src/templates/NetworkTemplate/NetworkTemplate.tsx`
//   )

//   if (result.data === undefined) {
//     reporter.panicOnBuild(`No data for networks pages`)
//     return
//   }

//   result.data.networks.nodes.forEach(({ name }) => {
//     const relativeDirectory = `events/networks/${name}`
//     const eventsRelativeDirectory = `events/networks/${name}/*`
//     const imagesRelativeDirectory = `events/networks/${name}/*/images`

//     const context = {
//       relativeDirectory,
//       eventsRelativeDirectory,
//       imagesRelativeDirectory,
//     }
//     reporter.info(
//       `network page [${name}] context: ${JSON.stringify(context, null, 4)}`
//     )

//     createPage({
//       path: `/networks/${name}`,
//       component,
//       // additional data can be passed via context
//       context,
//     })
//   })
// }

const createTopicTimelinePages = async ({
  actions,
  graphql,
  reporter,
}: CreatePagesArgs): Promise<void> => {
  const { createPage } = actions
  const topicTimelineTemplate = path.resolve(
    `src/templates/TopicTimelineTemplate/TopicTimelineTemplate.tsx`
  )

  const result = await graphql<{ topics: { nodes: Array<{ name: string }> } }>(`
    {
      topics: allFile(filter: { sourceInstanceName: { eq: "topics" } }) {
        nodes {
          name
        }
      }
    }
  `)

  // Handle errors
  if (result.errors !== undefined) {
    reporter.panicOnBuild(
      `Error while running createNetworkTopicTimelinePages query.`
    )
    return
  }

  if (result.data === undefined) {
    reporter.panicOnBuild(`No data for topics pages`)
    return
  }

  const nodes = result.data.topics.nodes

  nodes.forEach((node) => {
    const nodePath = `/topics/${node.name}`

    const context = {
      topic: node.name,
    }

    reporter.info(
      `Topic [${node.name}] context: ${JSON.stringify(context, null, 4)}`
    )
    reporter.info(`Building to path: ${nodePath}`)

    createPage({
      path: nodePath,
      component: topicTimelineTemplate,
      // additional data can be passed via context
      context,
    })
  })
}

export const createPages = async (options: CreatePagesArgs) => {
  await createGroupPages(options)
  await createArticlePages(options)
  await createActorTimelinePages(options)
  await createTopicTimelinePages(options)
  await createEventPages(options)
  // await createNetworkPages(options)
}

const { avatar, ...ActorFrontmatterProps } = ActorFrontmatter.type.props
const ActorF = t.type({
  ...ActorFrontmatterProps,
  avatar: optionFromNullable(t.string),
})

const {
  avatar: _groupAvatar,
  members,
  ...GroupFrontmatterProps
} = GroupFrontmatter.type.props
const GroupF = t.type({
  ...GroupFrontmatterProps,
  avatar: optionFromNullable(t.string),
  members: optionFromNullable(t.array(t.string)),
})
const {
  groups,
  topics,
  actors,
  images,
  ...EventFrontmatterProps
} = EventFrontmatter.type.props

const EventF = t.type({
  ...EventFrontmatterProps,
  groups: optionFromNullable(t.array(t.string)),
  topics: optionFromNullable(t.array(t.string)),
  actors: optionFromNullable(t.array(t.string)),
  images: optionFromNullable(
    t.array(
      t.type({
        description: t.string,
        image: t.string,
      })
    )
  ),
})

export const createSchemaCustomization = async ({
  actions,
  schema,
}: CreateSchemaCustomizationArgs) => {
  const { createTypes } = actions
  const typeDefs = fs.readFileSync(`${__dirname}/types-def.gql`, {
    encoding: "utf-8",
  })

  createTypes(
    [
      typeDefs as any,
      schema.buildUnionType({
        name: "Frontmatter",
        types: [
          "ArticleFrontmatter",
          "ActorFrontmatter",
          "GroupFrontmatter",
          "EventFrontmatter",
          "TopicFrontmatter",
          "PageFrontmatter",
          "MarkdownRemarkFrontmatter",
        ],
        resolveType: async (source) => {
          // console.log({
          //   source,
          //   ActorFrontmatter: ActorF.decode(source),
          //   GroupFrontmatter: GroupF.decode(source),
          //   EventFrontmatter: EventF.decode(source),
          //   TopicFrontmatter: TopicFrontmatter.decode(source),
          //   ArticleFrontmatter: ArticleFrontmatter.decode(source),
          //   PageFrontmatter: PageFrontmatter.decode(source)
          // })

          if (E.isRight(ActorF.decode(source))) {
            return "ActorFrontmatter"
          }

          if (E.isRight(GroupF.decode(source))) {
            return "GroupFrontmatter"
          }

          if (E.isRight(TopicFrontmatter.decode(source))) {
            return "TopicFrontmatter"
          }

          if (E.isRight(ArticleFrontmatter.decode(source))) {
            return "ArticleFrontmatter"
          }

          if (E.isRight(EventF.decode(source))) {
            return "EventFrontmatter"
          }

          if (E.isRight(PageFrontmatter.decode(source))) {
            return "PageFrontmatter"
          }

          return "MarkdownRemarkFrontmatter"
        },
      }),
    ],
    { name: "default-site-plugin" }
  )
}

export const createResolvers = ({ createResolvers }: CreateResolversArgs) => {
  const resolvers = {
    ArticleFrontmatter: {
      date: {
        type: "Date!",
      },
    },
    ActorFrontmatter: {
      date: {
        type: "Date!",
      },
      avatar: {
        type: "File",
      },
    },
    GroupFrontmatter: {
      uuid: {
        type: "String!",
        resolve: (source: any) => source.uuid,
      },
      avatar: {
        type: "File!",
      },
      members: {
        type: "[ActorFrontmatter!]",
        resolve: async (source: any, args: any, context: any) => {
          const memberIds = source.members ?? []
          return context.nodeModel
            .getAllNodes({
              type: "ActorFrontmatter",
            })
            .filter((m: any) => memberIds.includes(m.uuid))
        },
      },
    },
    EventFrontmatter: {
      actors: {
        type: "[ActorFrontmatter!]",
        resolve: async (source: any, args: any, context: any) => {
          const actorIds = source.actors ?? []
          return context.nodeModel
            .getAllNodes({
              type: "ActorFrontmatter",
            })
            .filter((m: any) => actorIds.includes(m.uuid))
        },
      },
      groups: {
        type: "[GroupFrontmatter!]",
        resolve: async (source: any, args: any, context: any) => {
          const groupIds = source.groups ?? []
          return context.nodeModel
            .getAllNodes({
              type: "GroupFrontmatter",
            })
            .filter((m: any) => groupIds.includes(m.uuid))
        },
      },
      topics: {
        type: "[TopicFrontmatter!]",
        resolve: async (source: any, args: any, context: any) => {
          const topicIds = source.topics ?? []
          return context.nodeModel
            .getAllNodes({
              type: "TopicFrontmatter",
            })
            .filter((m: any) => topicIds.includes(m.uuid))
        },
      },
      images: {
        type: "[ImageWithDescription!]",
        resolve: async (source: any, args: any, context: any) => {
          const images: Array<{
            description?: string
            image: string
          }> = pipe(
            source.images ?? [],
            A.map((i: any) => ({
              ...i,
              image: path.join(process.cwd(), i.image.replace("../../", "/")),
            }))
          )

          const imagesPaths = images.map((i) => i.image)

          const results = await context.nodeModel.runQuery({
            type: "File",
            query: {
              filter: { absolutePath: { in: imagesPaths } },
            },
            firstOnly: false,
          })

          if (results === null) {
            return null
          }

          return pipe(
            results,
            A.map((image: any) => ({
              description: pipe(
                images,
                A.findFirst((i) => i.image === image.absolutePath),
                O.mapNullable((i) => i.description),
                O.toNullable
              ),
              image: image,
            }))
          )
        },
      },
    },
  }
  createResolvers(resolvers)
}

export const sourceNodes = ({
  boundActionCreators,
  getNodesByType,
}: SourceNodesArgs) => {
  const { createNodeField } = boundActionCreators

  pipe(
    getNodesByType("MarkdownRemark"),
    group(
      Eq.contramap<string, Node>((n) => (n.fields as any).collection as string)(
        Eq.eqString
      )
    ),
    A.map((n) => {
      const firstNode = A.head(n)
      if (O.isSome(firstNode)) {
        const collection = (firstNode.value as any).fields.collection
        switch (collection) {
          case "events": {
            n.forEach((e) => {
              createNodeField({
                node: e,
                name: `actors`,
                value: (e.frontmatter as any).actors || [],
              })

              createNodeField({
                node: e,
                name: `groups`,
                value: (e.frontmatter as any).groups || [],
              })

              createNodeField({
                node: e,
                name: `topics`,
                value: (e.frontmatter as any).topics || [],
              })
            })
          }

          case "groups": {
            n.forEach((e) => {
              createNodeField({
                node: e,
                name: `members`,
                value: (e.frontmatter as any).members || [],
              })
            })
          }
        }
      }
    })
  )

  return Promise.resolve(undefined as any)
}

type Collection =
  | "actors"
  | "articles"
  | "groups"
  | "events"
  | "pages"
  | "topics"

const collectionToTypeMap: Record<Collection, string> = {
  actors: "ActorFrontmatter",
  articles: "ArticleFrontmatter",
  groups: "GroupFrontmatter",
  events: "EventFrontmatter",
  pages: "PageFrontmatter",
  topics: "TopicFrontmatter",
}

export const onCreateNode = ({
  node,
  actions,
  getNode,
  getNodesByType,
  createNodeId,
}: CreateNodeArgs) => {
  const { createNodeField, createNode } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const collection = getNode(node.parent).sourceInstanceName as Collection

    createNodeField({
      name: `collection`,
      node,
      value: collection,
    })

    switch (collection) {
      case "events": {
        createNodeField({
          name: "actors",
          node,
          value: (node.frontmatter as any).actors ?? [],
        })

        createNodeField({
          name: "groups",
          node,
          value: (node.frontmatter as any).groups ?? [],
        })

        createNodeField({
          name: "topics",
          node,
          value: (node.frontmatter as any).topics ?? [],
        })
      }

      case "groups": {
        createNodeField({
          name: "members",
          node,
          value: (node.frontmatter as any).members ?? [],
        })
      }
    }

    const type = collectionToTypeMap[collection]
    const nodeId = createNodeId(`${type}-${node.id}`)

    createNode({
      ...(node.frontmatter as any),
      id: nodeId,
      parent: node.id,
      internal: {
        type,
        contentDigest: node.internal.contentDigest,
      },
    })
  }
}
