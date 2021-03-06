import { Endpoints, AddEndpoint } from "@econnessione/shared/endpoints";
import { ProjectEntity } from "@entities/Project.entity";
import { Router } from "express";
import { sequenceS } from "fp-ts/lib/Apply";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { RouteContext } from "routes/route.types";
import { getORMOptions } from "../../utils/listQueryToORMOptions";
import { toProjectIO } from "./project.io";

export const MakeListProjectRoute = (r: Router, ctx: RouteContext): void => {
  AddEndpoint(r)(Endpoints.Project.List, ({ query }) => {
    const findOptions = getORMOptions(query, ctx.env.DEFAULT_PAGE_SIZE);
    return pipe(
      sequenceS(TE.taskEither)({
        data: pipe(
          ctx.db.find(ProjectEntity, {
            ...findOptions,
            relations: ["images", "areas"],
          }),
          TE.chainEitherK(A.traverse(E.either)(toProjectIO))
        ),
        count: ctx.db.count(ProjectEntity),
      }),
      TE.map(({ data, count }) => ({
        body: {
          data: data,
          total: count,
        } as any,
        statusCode: 200,
      }))
    );
  });
};
