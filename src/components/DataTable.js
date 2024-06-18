import "../styles/data_table.scss";
import { useState, useEffect } from "react";
import customAxios from "../utils/customAxios";
import ReactImageMagnify from "react-magnify-image";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentDeviation,
  setTablePageDataLimit,
  setCurrentTablePage,
} from "../redux/deviationSlice";
import { ReactComponent as AkarIconsChevronLeft } from "../assets/iconify/akar-icons--chevron-left.svg";
import { ReactComponent as AkarIconsChevronRight } from "../assets/iconify/akar-icons--chevron-right.svg";

const DataTable = ({ currentAnalyticsTab }) => {
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
  const cctvList = useSelector((state) => state.cctv.list);
  const userList = useSelector((state) => state.user.list);

  const [currentDeviationImageBlob, setCurrentDeviationImageBlob] = useState();
  const [reactMagnifyImageLoading, setReactMagnifyImageLoading] =
    useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setReactMagnifyImageLoading(true);
    if (currentDeviation) {
      customAxios({
        method: "GET",
        url: "/analytics/" + currentDeviation.path + currentDeviation.image,
        responseType: "arraybuffer",
      })
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
            {cctvList.map((cctv) => {
              return cctv.id === deviation.cctv_id
                ? cctv.name + " - " + cctv.location
                : "";
            })}
          </td>
          <td className="text-center">{deviation.created_at}</td>
          <td className="text-center">
            {deviation.type_object.charAt(0).toUpperCase() +
              deviation.type_object.slice(1)}
          </td>
          <td className="text-center">
            {currentAnalyticsTab !== "AnalyticsCountingCrossing"
              ? deviation.parent_id === null
                ? "Utama"
                : "Repetisi"
              : deviation?.direction?.charAt(0).toUpperCase() +
                deviation?.direction?.slice(1)}
          </td>
          {currentAnalyticsTab !== "AnalyticsCountingCrossing" ? (
            <td className="text-center">
              <label
                className={
                  "px-2 rounded-2" +
                  (deviation.type_validation === "true"
                    ? " status-true"
                    : deviation.type_validation === "false"
                    ? " status-false"
                    : " status-none")
                }
              >
                {deviation.type_validation === "true"
                  ? "Valid"
                  : deviation.type_validation === "false"
                  ? "Tidak Valid"
                  : "Belum Divalidasi"}
              </label>
            </td>
          ) : (
            ""
          )}
          <td className="text-center">
            {currentAnalyticsTab !== "AnalyticsCountingCrossing"
              ? deviation.comment === null
                ? "-"
                : deviation.comment?.length < 20
                ? deviation.comment
                : deviation.comment?.substr(0, 19) + "..."
              : deviation.count}
          </td>
          {currentAnalyticsTab !== "AnalyticsCountingCrossing" ? (
            <td className="text-center">
              {userList.map((user) => {
                return user.id === deviation.user_id ? user?.full_name : "";
              })}
            </td>
          ) : (
            ""
          )}
          {currentAnalyticsTab !== "AnalyticsCountingCrossing" ? (
            <td className="text-center">
              {deviation.type_validation === "not_yet"
                ? "-"
                : deviation.updated_at}
            </td>
          ) : (
            ""
          )}
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
              {currentAnalyticsTab !== "AnalyticsCountingCrossing"
                ? "Deviasi"
                : "Objek"}
            </th>
            <th className="table-header" scope="col">
              {currentAnalyticsTab !== "AnalyticsCountingCrossing"
                ? "Status Grouping"
                : "Arah"}
            </th>
            <th className="table-header" scope="col">
              {currentAnalyticsTab !== "AnalyticsCountingCrossing"
                ? "Status"
                : "Jumlah Objek"}
            </th>
            {currentAnalyticsTab !== "AnalyticsCountingCrossing" ? (
              <th className="table-header" scope="col">
                Deskripsi
              </th>
            ) : (
              ""
            )}
            {currentAnalyticsTab !== "AnalyticsCountingCrossing" ? (
              <th className="table-header" scope="col">
                Validator
              </th>
            ) : (
              ""
            )}
            {currentAnalyticsTab !== "AnalyticsCountingCrossing" ? (
              <th className="table-header" scope="col">
                Waktu Tervalidasi
              </th>
            ) : (
              ""
            )}
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
                      (currentDeviation?.type_validation === "true"
                        ? " status-true"
                        : currentDeviation?.type_validation === "false"
                        ? " status-false"
                        : " status-none")
                    }
                  >
                    {currentAnalyticsTab !== "AnalyticsCountingCrossing"
                      ? currentDeviation?.type_validation === "true"
                        ? "Valid"
                        : currentDeviation?.type_validation === "false"
                        ? "Tidak Valid"
                        : "Belum Divalidasi"
                      : currentDeviation?.direction.charAt(0).toUpperCase() +
                        currentDeviation?.direction.slice(1) +
                        ", " +
                        currentDeviation?.count}
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
                      <AkarIconsChevronLeft className="icon" />
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
                      <AkarIconsChevronRight className="icon" />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div className="row">
                  <label className="col-2 fw-bolder">CCTV</label>
                  <label className="col-10">
                    {": "}
                    {cctvList.map((cctv) => {
                      return cctv.id === currentDeviation?.cctv_id
                        ? cctv.name + " - " + cctv.location
                        : "";
                    })}
                  </label>
                </div>
                <div className="row">
                  <label className="col-2 fw-bolder">
                    {currentAnalyticsTab !== "AnalyticsCountingCrossing"
                      ? "Deviasi"
                      : "Objek"}
                  </label>
                  <label className="col-10">
                    {": "}
                    {currentDeviation?.type_object.charAt(0).toUpperCase() +
                      currentDeviation?.type_object.slice(1)}
                  </label>
                </div>
                {currentAnalyticsTab !== "AnalyticsCountingCrossing" ? (
                  <div className="row">
                    <label className="col-2 fw-bolder">Pengawas</label>
                    {currentDeviation?.user_name === null ? (
                      <label className="col-10">: -</label>
                    ) : (
                      <label className="col-10">
                        {": "}
                        {userList.map((user) => {
                          return user.id === currentDeviation?.user_id
                            ? user?.full_name
                            : "";
                        })}
                      </label>
                    )}
                  </div>
                ) : (
                  ""
                )}
                {currentAnalyticsTab !== "AnalyticsCountingCrossing" ? (
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
                ) : (
                  ""
                )}
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
