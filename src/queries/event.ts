import { graphql } from "gatsby"
export const query = graphql`
  fragment EventFileNode on File {
    relativeDirectory
    childMarkdownRemark {
      id
      frontmatter {
        title
        date
        topic
        icon
        type
        actors
        links
      }
      htmlAst
    }
  }
`
