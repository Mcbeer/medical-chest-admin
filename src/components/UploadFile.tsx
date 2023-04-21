import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { parseExcelFile } from "../lib/parseExcelFile";
import { api } from "../utils/api";

export const UploadFile = () => {
  const { refetch } = api.guides.getAll.useQuery();
  const { mutate, isLoading } = api.guides.addGuides.useMutation({
    onSuccess: () => refetch(),
  });

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

  const getLabel = () => {
    if (isDragActive) {
      return <p>Placér filen her</p>;
    }

    if (isLoading) {
      return <p>Indlæser</p>;
    }

    return <p>Træk filen du vil uploade her - Eller klik her for at uploade</p>;
  };

  return (
    <div
      {...getRootProps()}
      className="bg-blue-700 text-blue-50 flex h-full cursor-pointer items-center justify-center p-16"
    >
      <input {...getInputProps()} />
      {getLabel()}
    </div>
  );
};
