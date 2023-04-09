import type { FC } from "react";

type Props = {
  guideNumber: string;
  guideName: string;
  guideId: string;
  guideLang: "da-DK" | "en-GB";
};

export const GuideListItem: FC<Props> = ({
  guideNumber,
  guideName,
  guideId,
  guideLang,
}) => {
  return (
    <li
      key={guideId}
      className="bg-blue-100 box-border flex cursor-pointer items-center justify-between gap-8 p-2 pl-8 pr-8 transition-colors hover:bg-brand-opaque"
    >
      <div className="box-border flex w-full items-center justify-between gap-4">
        <h3>{guideNumber}</h3>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {guideName}
        </p>
      </div>
      <p>{guideLang === "da-DK" ? "🇩🇰" : "🇬🇧"}</p>
    </li>
  );
};
