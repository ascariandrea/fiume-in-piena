import * as io from "@econnessione/shared/io";
import { UserEntity } from "@entities/User.entity";
import { ControllerError, DecodeError } from "@io/ControllerError";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

export const toUserIO = ({
  passwordHash,
  ...user
}: UserEntity): E.Either<ControllerError, io.http.User.User> => {
  return pipe(
    io.http.User.User.decode({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }),
    E.mapLeft(DecodeError)
  );
};
