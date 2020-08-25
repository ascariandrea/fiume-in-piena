import { List, ListItemProps } from "@components/Common/List"
import { TopicFrontmatter } from "@models/topic"
import theme, {  CustomTheme } from "@theme/CustomeTheme"
import { StyledLink } from "baseui/link"
import { Tag, VARIANT, KIND } from "baseui/tag"
import * as React from "react"

export interface TopicListTopic extends TopicFrontmatter {
  selected: boolean
  color: string
}

interface TopicListProps {
  topics: TopicListTopic[]
  onTopicClick: (t: TopicListTopic) => void
}

export const TopicListItem: React.FC<
  ListItemProps<TopicListTopic> & { $theme: CustomTheme }
> = ({ item: t, $theme, onClick }) => (
  <StyledLink href={`/topics/${t.uuid}`}>
  <Tag
    key={t.slug}
    kind={KIND.custom}
    variant={t.selected ? VARIANT.solid : VARIANT.outlined}
    color={t.color}
    title={t.label}
    onClick={() => onClick?.(t)}
    closeable={false}
    overrides={{
      Text: {
        style: () => ({
          fontFamily: $theme.typography.secondaryFont,
        }),
      },
    }}
  >
    {t.label}
  </Tag>
  </StyledLink>
)

const TopicList: React.FC<TopicListProps> = ({ topics, onTopicClick }) => {

  return (
    <List<TopicListTopic>
      data={topics}
      filter={(_) => true}
      onItemClick={onTopicClick}
      getKey={(t) => t.uuid}
      ListItem={(p) => <TopicListItem $theme={theme} {...p} />}
    />
  )
}

export default TopicList