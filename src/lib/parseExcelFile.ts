import type { Guide } from "@prisma/client";
import * as xlsx from "xlsx";

const isDanish = (str: string) => {
  if (!str) {
    return false;
  }

  return str.includes("æ") || str.includes("ø") || str.includes("å");
};

export const parseExcelFile = (data: string | ArrayBuffer) => {
  const workbook = xlsx.read(data);
  const sheets = workbook.SheetNames.map(
    (sheetName) => workbook.Sheets[sheetName]
  ).filter((sheet) => !!sheet) as xlsx.WorkSheet[];

  const sheetsAsJSON = sheets.map((sheet) => xlsx.utils.sheet_to_json(sheet));

  const firstSheet = sheetsAsJSON[0] as Record<
    "Medicinkiste" | "__EMPTY" | "__EMPTY_1" | "__EMPTY_2",
    string
  >[];

  if (!firstSheet) {
    return;
  }

  const groupedData: Omit<Guide, "createdAt" | "updatedAt" | "guideNumber">[] =
    [];
  let intermediate: Omit<Guide, "createdAt" | "updatedAt" | "guideNumber"> = {
    id: "",
    name: "",
    dosage: "",
    form: "",
    effect: "",
    groupNumber: 0,
    groupName: "",
    sideEffects: "",
    validity: "",
    storage: "",
    remarks: "",
    lang: "da-DK",
  };

  firstSheet.forEach((row) => {
    if (row["Medicinkiste"] && row["Medicinkiste"].includes("Grp")) {
      intermediate.groupNumber = Number(row["Medicinkiste"].substring(5, 6));
      intermediate.groupName = row["Medicinkiste"].substring(6);
      return;
    }

    if (row["Medicinkiste"] && row.__EMPTY.includes(".")) {
      // This is the id if the item
      let formattedId = "";
      const splitId = row.__EMPTY.split("+");
      if (splitId.length > 1) {
        formattedId = splitId.map((id) => id?.trim()).join(" + ");
      } else {
        formattedId = splitId[0] ?? "Unknown item";
      }

      intermediate.id = formattedId;
      intermediate.name = row.__EMPTY_2 ?? "-";
      return;
    }

    if (
      ["form"].includes(row.__EMPTY_1?.replace(":", "").toLocaleLowerCase())
    ) {
      intermediate.form = row.__EMPTY_2 ?? "-";

      if (isDanish(row.__EMPTY_2)) {
        intermediate.lang = "da-DK";
      }

      return;
    }

    if (
      ["virkning", "effect"].includes(
        row.__EMPTY_1?.replace(":", "").toLocaleLowerCase()
      )
    ) {
      intermediate.effect = row.__EMPTY_2 ?? "-";

      if (isDanish(row.__EMPTY_2)) {
        intermediate.lang = "da-DK";
      }

      return;
    }

    if (
      ["dosering", "dosage"].includes(
        row.__EMPTY_1?.replace(":", "").toLocaleLowerCase()
      )
    ) {
      intermediate.dosage = row.__EMPTY_2 ?? "-";

      if (isDanish(row.__EMPTY_2)) {
        intermediate.lang = "da-DK";
      }

      return;
    }

    if (
      ["bivirkninger", "side-effects"].includes(
        row.__EMPTY_1?.replace(":", "").toLocaleLowerCase()
      )
    ) {
      intermediate.sideEffects = row.__EMPTY_2 ?? "-";

      if (isDanish(row.__EMPTY_2)) {
        intermediate.lang = "da-DK";
      }

      return;
    }

    if (
      ["holdbarhed", "validity"].includes(
        row.__EMPTY_1?.replace(":", "").toLocaleLowerCase()
      )
    ) {
      intermediate.validity = row.__EMPTY_2 ?? "-";

      if (isDanish(row.__EMPTY_2)) {
        intermediate.lang = "da-DK";
      }

      return;
    }

    if (
      ["opbevaring", "storage"].includes(
        row.__EMPTY_1?.replace(":", "").toLocaleLowerCase()
      )
    ) {
      intermediate.storage = row.__EMPTY_2 ?? "-";

      if (isDanish(row.__EMPTY_2)) {
        intermediate.lang = "da-DK";
      }

      return;
    }

    if (
      ["anmærkninger", "remarks"].includes(
        row.__EMPTY_1?.replace(":", "").toLocaleLowerCase()
      )
    ) {
      // This is the last entry, we should reset after "saving" the data
      intermediate.remarks = row.__EMPTY_2 ?? "-";

      if (isDanish(row.__EMPTY_2)) {
        intermediate.lang = "da-DK";
      }

      console.log(intermediate);

      groupedData.push(intermediate);
      intermediate = {
        id: "",
        name: "",
        dosage: "",
        form: "",
        effect: "",
        groupNumber: intermediate.groupNumber,
        groupName: intermediate.groupName,
        sideEffects: "",
        validity: "",
        storage: "",
        remarks: "",
        lang: "en-GB",
      };

      return;
    }

    return;
  });

  return groupedData;
};
