import * as t from "io-ts";
import { DateFromISOString } from "io-ts-types/lib/DateFromISOString";
import { BaseFrontmatter } from "../../Common/BaseFrontmatter";
import { ByGroupOrActor } from "../../Common/ByGroupOrActor";
import { Impact } from "../../Common/Impact";

export const PROJECT_IMPACT = "ProjectImpact";

export const ProjectImpact = t.strict(
  {
    ...BaseFrontmatter.type.props,
    title: t.string,
    type: t.literal(PROJECT_IMPACT),
    project: t.string,
    date: DateFromISOString,
    approvedBy: t.array(ByGroupOrActor),
    executedBy: t.array(ByGroupOrActor),
    images: t.array(t.string),
    impact: Impact,
  },
  PROJECT_IMPACT
);

export type ProjectImpact = t.TypeOf<typeof ProjectImpact>;
