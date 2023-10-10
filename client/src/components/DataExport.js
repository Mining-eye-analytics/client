import "../styles/data_export.scss";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

const DataExport = () => {
  const deviationList = useSelector((state) => state.deviation.list);
  const [ayam, setAyam] = useState([]);

  useEffect(() => {
    setAyam(deviationList);

    for (let i = 0; i < ayam.length; i++) {
      ayam[i]["link"] =
        "http://" +
        (window.location.hostname === "localhost"
          ? "10.10.10.66"
          : window.location.hostname) +
        ayam[i].path +
        ayam[i].image;
    }
  }, [deviationList]);

  const downloadExcel = (data) => {
    const fileName =
      new Date().getDate() +
      "-" +
      new Date().getMonth() +
      "-" +
      new Date().getFullYear();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(
      workbook,
      (window.location.hostname === "localhost"
        ? "10.10.10.66"
        : window.location.hostname) +
        "_" +
        fileName +
        ".xlsx"
    );
  };

  return (
    <button
      className="export-button border-0 rounded-2 px-3 py-1 d-flex align-items-center gap-1"
      onClick={() => {
        downloadExcel(ayam);
      }}
    >
      <Icon className="icon" icon="entypo:export" />
      <label>Export</label>
    </button>
  );
};

export default DataExport;
