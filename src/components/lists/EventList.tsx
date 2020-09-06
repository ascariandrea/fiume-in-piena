import { Slider } from "@components/Slider/Slider"
import ActorList from "@components/lists/ActorList"
import TopicList from "@components/lists/TopicList"
import { EventMarkdownRemark } from "@models/event"
import { formatDate } from "@utils//date"
import renderHTMLAST from "@utils/renderHTMLAST"
import { Accordion, Panel } from "baseui/accordion"
import { Block } from "baseui/block"
import { Card, StyledBody } from "baseui/card"
import { FlexGrid, FlexGridItem } from "baseui/flex-grid"
import { CheckIndeterminate, Overflow } from "baseui/icon"
import { StyledLink } from "baseui/link"
import { ListItem, ListItemLabel } from "baseui/list"
import { ParagraphSmall } from "baseui/typography"
import * as A from "fp-ts/lib/Array"
import * as O from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"
import { navigate } from "gatsby"
import * as React from "react"
import GroupList from "./GroupList"

interface EventListProps {
  events: EventMarkdownRemark[]
}

const EventList: React.FC<EventListProps> = (props) => {
  return (
    <div className="events">
      {pipe(
        props.events,
        A.map((event) => (
          <div key={event.frontmatter.uuid} id={event.frontmatter.uuid}>
            <Card
              title={
                <StyledLink href={`/events/${event.frontmatter.uuid}`}>
                  {event.frontmatter.title}
                </StyledLink>
              }
            >
              <StyledBody>
                <Block overrides={{ Block: { style: { textAlign: "right" } } }}>
                  <StyledLink
                    href={`/admin/#/collections/events/entries/${event.frontmatter.uuid}`}
                    target="_blank"
                  >
                    <Overflow size={24} />
                  </StyledLink>
                </Block>
                <FlexGrid flexDirection="row">
                  <FlexGridItem>
                    {pipe(
                      event.frontmatter.images,
                      O.map((images) => (
                        <Slider
                          key="home-slider"
                          height={600}
                          slides={images.map((i) => ({
                            authorName: "",
                            info: O.getOrElse(() => "")(i.description),
                            imageURL: i.image.childImageSharp.fluid.src,
                          }))}
                          arrows={true}
                          adaptiveHeight={true}
                          dots={true}
                          size="contain"
                        />
                      )),
                      O.toNullable
                    )}
                  </FlexGridItem>
                </FlexGrid>
                <FlexGrid flexGridColumnCount={2}>
                  <FlexGridItem
                    display="flex"
                    flexGridColumnCount={1}
                    alignItems="center"
                  >
                    {pipe(event.frontmatter.topics, (topics) => (
                      // eslint-disable-next-line react/jsx-key
                      <TopicList
                        topics={topics.map((t) => ({
                          ...t,
                          selected: true,
                        }))}
                        onTopicClick={async (t) =>
                          await navigate(`/topics/${t.uuid}`)
                        }
                      />
                    ))}
                  </FlexGridItem>
                  <FlexGridItem
                    display="flex"
                    flexGridColumnCount={1}
                    alignItems="flex-end"
                    flexDirection="column"
                  >
                    {pipe(
                      event.frontmatter.groups,
                      O.fold(
                        () => null,
                        (groups) => (
                          <GroupList
                            groups={groups.map((g) => ({
                              ...g,
                              selected: false,
                            }))}
                            onGroupClick={async (group) => {
                              await navigate(`/groups/${group.uuid}`)
                            }}
                            avatarScale="scale1000"
                          />
                        )
                      )
                    )}
                    {pipe(
                      event.frontmatter.actors,
                      O.fold(
                        () => null,
                        (actors) => (
                          <ActorList
                            actors={actors.map((a) => ({
                              ...a,
                              selected: false,
                            }))}
                            onActorClick={async (actor) => {
                              await navigate(`/actors/${actor.uuid}`)
                            }}
                            avatarScale="scale1000"
                          />
                        )
                      )
                    )}
                  </FlexGridItem>
                  <FlexGridItem flexGridColumnCount={2}>
                    <time dateTime={formatDate(event.frontmatter.date)}>
                      {formatDate(event.frontmatter.date)}
                    </time>
                  </FlexGridItem>
                  <FlexGridItem />
                  <FlexGridItem flexGridColumnCount={2}>
                    {renderHTMLAST(event.htmlAst)}

                    {pipe(
                      event.frontmatter.links,
                      O.map((links) => (
                        // eslint-disable-next-line react/jsx-key
                        <Accordion>
                          <Panel title={`Links (${links.length})`}>
                            <ul>
                              {links.map((l, i) => (
                                <ListItem key={i} artwork={CheckIndeterminate}>
                                  <ListItemLabel>
                                    <ParagraphSmall>
                                      <a href={l}>{l}</a>
                                    </ParagraphSmall>
                                  </ListItemLabel>
                                </ListItem>
                              ))}
                            </ul>
                          </Panel>
                        </Accordion>
                      )),
                      O.toNullable
                    )}
                  </FlexGridItem>
                  <FlexGridItem display="none" />
                </FlexGrid>
              </StyledBody>
            </Card>
          </div>
        ))
      )}
    </div>
  )
}

export default EventList
