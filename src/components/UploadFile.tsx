import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { parseExcelFile } from "../lib/parseExcelFile";
import { api } from "../utils/api";

export const UploadFile = () => {
  const { mutate } = api.guides.addGuides.useMutation();

  const onDrop = useCallback(
    (files: File[]) => {
      const tryParseFile = async () => {
        if (!files[0]) {
          alert("No files found... strange...");
          return;
        }

        const fileData = await files[0].arrayBuffer();

        const parsedFile = parseExcelFile(fileData);

        return parsedFile;
      };

      tryParseFile()
        .then((parsedGuides) => {
          if (!parsedGuides) {
            return;
          }

          mutate(parsedGuides);
        })
        .catch(alert);
    },
    [mutate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="flex h-full cursor-pointer items-center justify-center bg-blue-700 p-16 text-blue-50"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Placér filen her</p>
      ) : (
        <p>Træk filen du vil uploade her - Eller klik her for at uploade</p>
      )}
    </div>
  );
};
