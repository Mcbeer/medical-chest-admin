import type { Guide } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import type { FC, PropsWithChildren } from "react";
import { Seperator } from "./Seperator";

type Props = {
  guideNumber: string;
  guideName: string;
  guideId: string;
  guideLang: "da-DK" | "en-GB";
  guideData: Guide;
};

export const GuideListItem: FC<Props> = ({
  guideData,
  guideNumber,
  guideName,
  guideId,
  guideLang,
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <li
          key={guideId}
          className="bg-blue-100 box-border flex cursor-pointer items-center justify-between gap-8 p-2 pl-8 pr-8 transition-colors hover:bg-brand-opaque"
          style={{ opacity: guideData.deletedAt ? 0.5 : 1 }}
        >
          <div className="box-border flex w-full min-w-0 items-center gap-4">
            <h3 className="w-16">{guideNumber}</h3>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap">
              {guideName.replace("∆", "").replace("Δ", "")}
            </p>
          </div>
          <p>{guideLang === "da-DK" ? "🇩🇰" : "🇬🇧"}</p>
        </li>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-brand-opaque" />
        <Dialog.Content className=" fixed top-1/2 left-1/2 max-h-screen w-4/5 max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 focus:outline-none">
          <Dialog.Close asChild>
            <button
              className="fixed top-4 right-4 rounded-full p-1 transition-colors hover:bg-brand-opaque hover:text-white"
              aria-label="Close"
            >
              <Cross2Icon width={20} height={20} />
            </button>
          </Dialog.Close>
          <Dialog.Title className="pb-6 pt-4 text-2xl">
            {guideName}
          </Dialog.Title>
          {/* <Dialog.Description className="max-h-96 overflow-hidden"> */}
          <div className="flex max-h-96 flex-col gap-2 overflow-auto pr-4">
            <DescriptionElement>
              <>
                <h4>Lægemiddelstof</h4>
                <p>{guideData.name}</p>
              </>
            </DescriptionElement>
            <Seperator />
            <DescriptionElement>
              <>
                <h4>Form</h4>
                <p>{guideData.form}</p>
              </>
            </DescriptionElement>
            <Seperator />
            <DescriptionElement>
              <>
                <h4>Virkning</h4>
                <p>{guideData.effect}</p>
              </>
            </DescriptionElement>
            <Seperator />
            <DescriptionElement>
              <>
                <h4>Dosering</h4>
                <p>{guideData.dosage}</p>
              </>
            </DescriptionElement>
            <Seperator />
            <DescriptionElement>
              <>
                <h4>Bivirkninger</h4>
                <p>{guideData.sideEffects}</p>
              </>
            </DescriptionElement>
            <Seperator />
            <DescriptionElement>
              <>
                <h4>Holdbarhed</h4>
                <p>{guideData.validity}</p>
              </>
            </DescriptionElement>
            <Seperator />
            <DescriptionElement>
              <>
                <h4>Opbevaring</h4>
                <p>{guideData.storage}</p>
              </>
            </DescriptionElement>
            <Seperator />
            <DescriptionElement>
              <>
                <h4>Anmærkninger</h4>
                <p>{guideData.remarks}</p>
              </>
            </DescriptionElement>
            <Seperator />
            <DescriptionElement>
              <>
                <h4>Sidst opdateret</h4>
                <p>{guideData.updatedAt.toLocaleDateString()}</p>
              </>
            </DescriptionElement>
            {guideData.deletedAt && (
              <>
                <Seperator />
                <DescriptionElement>
                  <>
                    <h4>Slettet</h4>
                    <p>{guideData.deletedAt.toLocaleDateString()}</p>
                  </>
                </DescriptionElement>
              </>
            )}
          </div>
          {/* </Dialog.Description> */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const DescriptionElement: FC<PropsWithChildren> = ({ children }) => (
  <div className="grid grid-cols-dialogList gap-4">{children}</div>
);
