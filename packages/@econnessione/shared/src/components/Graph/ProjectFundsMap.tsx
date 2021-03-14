import Map from "@components/Map";
import { Project } from "@io/http";
import ParentSize from "@vx/responsive/lib/components/ParentSize";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as React from "react";

export interface ProjectFundsMapProps {
  project: Project.Project;
}

export const ProjectFundsMap: React.FC<ProjectFundsMapProps> = (props) => {
  return (
    <ParentSize style={{ height: 400 }}>
      {({ width, height }) => {
        return pipe(
          O.some(props.project.areas),
          O.fold(
            () => null,
            (areas) => {
              return (
                <Map
                  width={width}
                  height={height}
                  data={areas}
                  center={[0, 0]}
                  zoom={6}
                  onMapClick={() => {}}
                />
              );
            }
          )
        );
      }}
    </ParentSize>
  );
};
