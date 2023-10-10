import "../styles/data_table.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import ReactImageMagnify from "react-magnify-image";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentDeviation,
  setTablePageDataLimit,
  setCurrentTablePage,
} from "../redux/deviationSlice";

const DataTable = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.general.mode);
  const deviationList = useSelector((state) => state.deviation.list);
  const deviationLoading = useSelector((state) => state.deviation.loading);
  const currentDeviation = useSelector((state) => state.deviation.current);
  const tablePageDataLimit = useSelector(
    (state) => state.deviation.tablePageDataLimit
  );
  const currentTablePage = useSelector(
    (state) => state.deviation.currentTablePage
  );

  const [currentDeviationImageBlob, setCurrentDeviationImageBlob] = useState();
  const [reactMagnifyImageLoading, setReactMagnifyImageLoading] =
    useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setReactMagnifyImageLoading(true);
    if (currentDeviation) {
      axios
        .get(
          window.location.protocol +
            "//" +
            (window.location.hostname === "localhost"
              ? "10.10.10.66"
              : window.location.hostname) +
            ":" +
            process.env.REACT_APP_API_PORT +
            "/api/" +
            currentDeviation.path +
            currentDeviation.image,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            responseType: "arraybuffer",
          }
        )
        .then((res) => {
          let blob = new Blob([res.data], {
            type: res.headers["content-type"],
          });
          var reader = new window.FileReader();
          reader.readAsDataURL(blob);
          reader.onload = function () {
            var imageDataUrl = reader.result;
            setCurrentDeviationImageBlob(imageDataUrl);
          };
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setReactMagnifyImageLoading(false);
        });
    }
  }, [currentDeviation]);

  const handleMovePage = (action) => {
    if (action === "previous" && tablePageDataLimit - 25 === currentIndex) {
      dispatch(setCurrentTablePage(currentTablePage - 1));
      dispatch(setTablePageDataLimit(tablePageDataLimit - 25));
    } else if (action === "next" && (currentIndex + 1) % 25 === 0) {
      dispatch(setCurrentTablePage(currentTablePage + 1));
      dispatch(setTablePageDataLimit(tablePageDataLimit + 25));
    }
  };

  const deviationArray = deviationList
    .slice(tablePageDataLimit - 25, tablePageDataLimit)
    .map((deviation, index) => {
      return (
        <tr
          className={
            "align-middle" +
            (deviation.id === currentDeviation?.id ? " active" : "")
          }
          key={deviation.id}
          data-bs-toggle="modal"
          data-bs-target="#deviationModal"
          onClick={() => {
            setCurrentIndex(tablePageDataLimit - 25 + index);
            dispatch(setCurrentDeviation(deviation));
          }}
        >
          <th className="text-center" scope="row">
            {deviation.id}
          </th>
          <td className="text-center">
            {deviation.name} - {deviation.location}
          </td>
          <td className="text-center">{deviation.created_at}</td>
          <td className="text-center">{deviation.type_object}</td>
          <td className="text-center">
            {deviation.parent_id === null ? "Utama" : "Repetisi"}
          </td>
          <td className="text-center">
            <label
              className={
                "px-2 rounded-2" +
                (deviation.type_validation === "not_yet"
                  ? " status-none"
                  : deviation.type_validation === "true"
                  ? " status-true"
                  : " status-false")
              }
            >
              {deviation.type_validation === "not_yet"
                ? "Belum Divalidasi"
                : deviation.type_validation === "true"
                ? "Valid"
                : "Tidak Valid"}
            </label>
          </td>
          <td className="text-center">
            {deviation.comment === null
              ? "-"
              : deviation.comment.length < 20
              ? deviation.comment
              : deviation.comment.substr(0, 19) + "..."}
          </td>
          <td className="text-center">
            {deviation.user_name === null
              ? "-"
              : deviation.user_name.length < 10
              ? deviation.user_name
              : deviation.user_name.substr(0, 9) + "..."}
          </td>
          <td className="text-center">
            {deviation.type_validation === "not_yet"
              ? "-"
              : deviation.updated_at}
          </td>
        </tr>
      );
    });

  return (
    <div
      className={
        "data-table overflow-auto" +
        (mode === "light" ? " data-table-light" : " data-table-dark")
      }
    >
      <table className="table">
        <thead>
          <tr className="text-center">
            <th className="table-header" scope="col">
              ID
            </th>
            <th className="table-header" scope="col">
              Lokasi CCTV
            </th>
            <th className="table-header" scope="col">
              Waktu Terdeteksi
            </th>
            <th className="table-header" scope="col">
              Deviasi
            </th>
            <th className="table-header" scope="col">
              Status Grouping
            </th>
            <th className="table-header" scope="col">
              Status
            </th>
            <th className="table-header" scope="col">
              Deskripsi
            </th>
            <th className="table-header" scope="col">
              Validator
            </th>
            <th className="table-header" scope="col">
              Waktu Tervalidasi
            </th>
          </tr>
        </thead>
        {deviationList.length > 0 && deviationLoading === false ? (
          <tbody className="table-group-divider">{deviationArray}</tbody>
        ) : (
          ""
        )}
      </table>
      <div
        className="modal fade"
        id="deviationModal"
        tabIndex="-1"
        aria-labelledby="deviationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title" id="periodModalLabel">
                {"ID: " + currentDeviation?.id}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-grid gap-2">
              {reactMagnifyImageLoading === false ? (
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: "",
                      isFluidWidth: true,
                      src: currentDeviationImageBlob
                        ? currentDeviationImageBlob
                        : "",
                    },
                    largeImage: {
                      src: currentDeviationImageBlob
                        ? currentDeviationImageBlob
                        : "",
                      width: 800,
                      height: 500,
                    },
                    enlargedImagePosition: "over",
                  }}
                />
              ) : (
                <div className="d-flex justify-content-center my-3">
                  <div className="spinner-border">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col">
                  <label
                    className={
                      "px-2 rounded-2 mt-2" +
                      (currentDeviation?.type_validation === "not_yet"
                        ? " status-none"
                        : currentDeviation?.type_validation === "true"
                        ? " status-true"
                        : " status-false")
                    }
                  >
                    {currentDeviation?.type_validation === "not_yet"
                      ? "Belum Divalidasi"
                      : currentDeviation?.type_validation === "true"
                      ? "Valid"
                      : "Tidak Valid"}
                  </label>
                </div>
                <div className="col p-0">
                  <div className="deviation-navigation d-flex justify-content-end gap-2">
                    <button
                      className={
                        "border-0" + (currentIndex === 0 ? " disabled" : "")
                      }
                      onClick={() => {
                        setCurrentIndex(currentIndex - 1);
                        dispatch(
                          setCurrentDeviation(deviationList[currentIndex - 1])
                        );
                        handleMovePage("previous");
                      }}
                    >
                      <Icon className="icon" icon="akar-icons:chevron-left" />
                    </button>
                    <button
                      className={
                        "border-0" +
                        (currentIndex === deviationList.length - 1
                          ? " disabled"
                          : "")
                      }
                      onClick={() => {
                        setCurrentIndex(currentIndex + 1);
                        dispatch(
                          setCurrentDeviation(deviationList[currentIndex + 1])
                        );
                        handleMovePage("next");
                      }}
                    >
                      <Icon className="icon" icon="akar-icons:chevron-right" />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div className="row">
                  <label className="col-2 fw-bolder">CCTV</label>
                  <label className="col-10">
                    {": " +
                      currentDeviation?.name +
                      " - " +
                      currentDeviation?.location}
                  </label>
                </div>
                <div className="row">
                  <label className="col-2 fw-bolder">Pengawas</label>
                  {currentDeviation?.user_name === null ? (
                    <label className="col-10">: -</label>
                  ) : (
                    <label className="col-10">
                      {": " + currentDeviation?.user_name}
                    </label>
                  )}
                </div>
                <div className="row">
                  <label className="col-2 fw-bolder">Deskripsi</label>
                  {currentDeviation?.comment === null ? (
                    <label className="col-10">: -</label>
                  ) : (
                    <label className="col-10">
                      {": " + currentDeviation?.comment}
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="border-0 rounded-2 px-3 py-2"
                data-bs-dismiss="modal"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
