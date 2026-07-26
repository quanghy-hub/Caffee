import type React from "react";
import { Composition } from "remotion";
import { CacaoPromo } from "./compositions/CacaoPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CacaoPromo"
        component={CacaoPromo}
        durationInFrames={700}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
