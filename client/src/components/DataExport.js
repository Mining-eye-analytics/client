import "../styles/data_export.scss";
import { useState, useEffect } from "react";
import customAxios from "../axios/customAxios";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

const DataExport = ({ currentAnalyticsTab }) => {
  const mode = useSelector((state) => state.general.mode);
  const userList = useSelector((state) => state.user.list);
  const cctvList = useSelector((state) => state.cctv.list);
  const deviationList = useSelector((state) => state.deviation.list);
  const deviationCurrentDate = useSelector(
    (state) => state.deviation.currentDate
  );
  const deviationCurrentTime = useSelector(
    (state) => state.deviation.currentTime
  );
  const [exportData, setExportData] = useState([]);
  const [notificationCctvData, setNotificationCctvData] = useState({});
  const [notificationObjectData, setNotificationObjectData] = useState({});

  useEffect(() => {
    customAxios({
      method: "GET",
      url:
        "/api/count_cctv?startDate=" +
        dayjs(
          new Date(deviationCurrentDate[0]).setHours(
            deviationCurrentTime[0]?.slice(0, 2),
            deviationCurrentTime[0]?.slice(3, 5),
            "00"
          )
        ).format("YYYY-MM-DD HH:mm:ss") +
        "&endDate=" +
        dayjs(
          new Date(deviationCurrentDate[1]).setHours(
            deviationCurrentTime[1]?.slice(0, 2),
            deviationCurrentTime[1]?.slice(3, 5),
            "00"
          )
        ).format("YYYY-MM-DD HH:mm:ss"),
    })
      .then((res) => {
        const data = res.data.data;
        const tempData = [];
        if (data !== undefined || data !== null) {
          for (let i = 0; i < data?.length; i++) {
            tempData.push({
              tanggal: data[i].tanggal,
            });
            for (let j = 0; j < data[i].data.length; j++) {
              tempData[i][data[i].data[j].camera] = data[i].data[j].jumlah;
            }
          }
        }
        setNotificationCctvData(tempData);
      })
      .catch((err) => console.log(err));
  }, [deviationCurrentDate, deviationCurrentTime]);

  useEffect(() => {
    customAxios({
      method: "GET",
      url:
        "/api/count_object?startDate=" +
        dayjs(
          new Date(deviationCurrentDate[0]).setHours(
            deviationCurrentTime[0]?.slice(0, 2),
            deviationCurrentTime[0]?.slice(3, 5),
            "00"
          )
        ).format("YYYY-MM-DD HH:mm:ss") +
        "&endDate=" +
        dayjs(
          new Date(deviationCurrentDate[1]).setHours(
            deviationCurrentTime[1]?.slice(0, 2),
            deviationCurrentTime[1]?.slice(3, 5),
            "00"
          )
        ).format("YYYY-MM-DD HH:mm:ss"),
    })
      .then((res) => {
        const data = res.data.data;
        const tempData = [];
        if (data !== undefined || data !== null) {
          for (let i = 0; i < data?.length; i++) {
            tempData.push({
              tanggal: data[i].tanggal,
            });
            for (let j = 0; j < data[i].data.length; j++) {
              tempData[i][data[i].data[j].objek] = data[i].data[j].jumlah;
            }
          }
        }
        setNotificationObjectData(tempData);
      })
      .catch((err) => console.log(err));
  }, [deviationCurrentDate, deviationCurrentTime]);

  useEffect(() => {
    const tempData =
      currentAnalyticsTab !== "AnalyticsCountingCrossing"
        ? deviationList.map((item) => ({
            ID: item.id,
            ID_Grup_Data: item.parent_id,
            Tanggal: item.created_at.substring(5, 16),
            Validator:
              item.user_id !== null
                ? userList.filter((user) => item.user_id === user.id)[0]
                    .full_name
                : null,
            SID:
              item.user_id !== null
                ? userList.filter((user) => item.user_id === user.id)[0]
                    .username
                : null,
            CCTV:
              cctvList.filter((cctv) => item.cctv_id === cctv.id)[0].name +
              " - " +
              cctvList.filter((cctv) => item.cctv_id === cctv.id)[0].location,
            Status_Validasi:
              item.type_validation.charAt(0).toUpperCase() +
              item.type_validation.slice(1),
            Objek:
              item.type_object.charAt(0).toUpperCase() +
              item.type_object.slice(1),
            Deskripsi_Validasi: item.comment,
            Nama_Gambar: item.image,
            Waktu_Capture: item.created_at,
            Waktu_Validasi: item.updated_at,
            Link_Gambar:
              window.location.protocol +
              "//" +
              (window.location.hostname === "localhost"
                ? "10.10.10.66"
                : window.location.hostname) +
              "/" +
              item.path +
              item.image,
          }))
        : deviationList.map((item) => ({
            ID: item.id,
            Tanggal: item.created_at.substring(5, 16),
            Jam: item.created_at.substring(17, 24),
            Shift:
              parseInt(item.created_at.substring(17, 19)) > 5 &&
              parseInt(item.created_at.substring(17, 19)) < 18
                ? "1"
                : "2",
            CCTV:
              cctvList.filter((cctv) => item.cctv_id === cctv.id)[0].name +
              " - " +
              cctvList.filter((cctv) => item.cctv_id === cctv.id)[0].location,
            Objek:
              item.type_object.charAt(0).toUpperCase() +
              item.type_object.slice(1),
            Arah:
              item.direction.charAt(0).toUpperCase() + item.direction.slice(1),
            Jumlah_Objek: item.count,
            Nama_Gambar: item.image,
            Waktu_Capture: item.created_at,
            Link_Gambar:
              window.location.protocol +
              "//" +
              (window.location.hostname === "localhost"
                ? "10.10.10.66"
                : window.location.hostname) +
              "/" +
              item.path +
              item.image,
          }));

    setExportData(tempData);
  }, [deviationList]);

  const downloadWeeklyData = (
    exportData,
    notificationCctvData,
    notificationObjectData
  ) => {
    const fileName =
      new Date().getDate() +
      "-" +
      new Date().getMonth() +
      "-" +
      new Date().getFullYear();
    const validationWorksheet = XLSX.utils.json_to_sheet(exportData);
    const notificationCctvWorksheet =
      XLSX.utils.json_to_sheet(notificationCctvData);
    const notificationObjectWorksheet = XLSX.utils.json_to_sheet(
      notificationObjectData
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, validationWorksheet, "Validasi");
    XLSX.utils.book_append_sheet(
      workbook,
      notificationCctvWorksheet,
      "Notifikasi_CCTV"
    );
    XLSX.utils.book_append_sheet(
      workbook,
      notificationObjectWorksheet,
      "Notifikasi_Objek"
    );
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

  const downloadData = (data) => {
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
    <div
      className={
        "button-group d-flex align-items-center gap-3" +
        (mode === "light" ? " button-group-light" : " button-group-dark") +
        (exportData.length === 0 ? " d-none" : "")
      }
    >
      {/* <button
        className={
          "export-weekly border-0 rounded-2 px-3 py-1" +
          (currentAnalyticsTab === "AnalyticsCountingCrossing" ||
          JSON.parse(localStorage.getItem("authorization"))?.user_role !==
            "super_admin"
            ? " d-none"
            : "")
        }
        onClick={() => {
          downloadWeeklyData(
            exportData,
            notificationCctvData,
            notificationObjectData
          );
        }}
      >
        <Icon className="icon me-1" icon="entypo:export" />
        <label>Export Weekly</label>
      </button> */}
      <button
        className="export border-0 rounded-2 px-3 py-1"
        onClick={() => {
          downloadData(exportData);
        }}
      >
        <Icon className="icon m-1" icon="entypo:export" />
        <label>Export</label>
      </button>
    </div>
  );
};

export default DataExport;
