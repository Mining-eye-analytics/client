import "../styles/database_deviasi.scss";
import "../styles/calendar.css";
import "../styles/time_picker.css";
import DataTable from "../components/DataTable";
import DataExport from "../components/DataExport";
import { useState } from "react";
import Calendar from "react-calendar";
import TimePicker from "react-time-picker";
import { useSelector, useDispatch } from "react-redux";
import {
  setDeviationCurrentCctv,
  setDeviationCurrentObject,
  setDeviationCurrentValidationStatus,
  setDeviationCurrentTime,
  enableTimeFilter,
  setTablePageDataLimit,
  setCurrentTablePage,
} from "../redux/deviationSlice";
import { ReactComponent as MdiCctv } from "../assets/iconify/mdi--cctv.svg";
import { ReactComponent as IcRoundFilterCenterFocus } from "../assets/iconify/ic--round-filter-center-focus.svg";
import { ReactComponent as BiCalendarWeek } from "../assets/iconify/bi--calendar-week.svg";
import { ReactComponent as CodiconFoldUp } from "../assets/iconify/codicon--fold-up.svg";
import { ReactComponent as CodiconFoldDown } from "../assets/iconify/codicon--fold-down.svg";
import { ReactComponent as MingcuteCheckFill } from "../assets/iconify/mingcute--check-fill.svg";

const DatabaseDeviasi = ({ setDate }) => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.general.mode);
  const cctvList = useSelector((state) => state.cctv.list);
  const objectList = useSelector((state) => state.object.list);
  const objectCountingCrossingList = useSelector(
    (state) => state.object.countingCrossingList
  );
  const validationStatusList = useSelector(
    (state) => state.validationStatus.list
  );
  const deviationList = useSelector((state) => state.deviation.list);
  const deviationLoading = useSelector((state) => state.deviation.loading);
  const deviationCurrentCctv = useSelector(
    (state) => state.deviation.currentCctv
  );
  const deviationCurrentObject = useSelector(
    (state) => state.deviation.currentObject
  );
  const deviationCurrentValidationStatus = useSelector(
    (state) => state.deviation.currentValidationStatus
  );
  const deviationCurrentDate = useSelector(
    (state) => state.deviation.currentDate
  );
  const deviationCurrentTime = useSelector(
    (state) => state.deviation.currentTime
  );
  const timeFilter = useSelector((state) => state.deviation.timeFilter);
  const tablePageDataLimit = useSelector(
    (state) => state.deviation.tablePageDataLimit
  );
  const currentTablePage = useSelector(
    (state) => state.deviation.currentTablePage
  );

  const [currentAnalyticsTab, setCurrentAnalyticsTab] = useState("Others");

  const [dateStatus, setDateStatus] = useState("*pilih tanggal (start)");

  const timeHandler = (index, value) => {
    if (index === 0) {
      dispatch(setDeviationCurrentTime([value, deviationCurrentTime[1]]));
    } else {
      dispatch(setDeviationCurrentTime([deviationCurrentTime[0], value]));
    }
  };

  const cctvFilter = cctvList.map((cctv) => {
    if (
      currentAnalyticsTab === "Others" &&
      cctv.type_analytics !== "AnalyticsCountingCrossing"
    ) {
      return (
        <option key={cctv.id} value={JSON.stringify(cctv)}>
          {cctv.name + " - " + cctv.location}
        </option>
      );
    } else if (
      currentAnalyticsTab === "AnalyticsCountingCrossing" &&
      cctv.type_analytics === "AnalyticsCountingCrossing"
    ) {
      return (
        <option key={cctv.id} value={JSON.stringify(cctv)}>
          {cctv.name + " - " + cctv.location}
        </option>
      );
    }
  });

  const objectFilter = (
    currentAnalyticsTab !== "AnalyticsCountingCrossing"
      ? objectList
      : objectCountingCrossingList
  ).map((object) => {
    return (
      <option key={object.id} value={object.value}>
        {object.name}
      </option>
    );
  });

  const validationTypeFilter = validationStatusList.map((validationType) => {
    return (
      <option key={validationType.id} value={validationType.value}>
        {validationType.name === "Semua" ? "Semua Status" : validationType.name}
      </option>
    );
  });

  return (
    <div
      className={
        "database-deviasi" +
        (mode === "light"
          ? " database-deviasi-light"
          : " database-deviasi-dark")
      }
    >
      <div className="title d-grid gap-3 mb-3">
        {cctvList.filter(
          (cctv) => cctv.type_analytics === "AnalyticsCountingCrossing"
        ).length === 0 ? (
          <h6>Database Deviasi</h6>
        ) : (
          <div className="analytics-tab d-flex gap-3">
            <button
              className={
                "border-0 rounded-2 px-3 py-2 d-flex align-items-center gap-1" +
                (currentAnalyticsTab === "Others" ? " active" : "")
              }
              onClick={() => {
                setCurrentAnalyticsTab("Others");
                dispatch(setDeviationCurrentCctv({ id: 0 }));
              }}
            >
              <h6>Area Pit</h6>
            </button>
            <button
              className={
                "border-0 rounded-2 px-3 py-2 d-flex align-items-center gap-1" +
                (currentAnalyticsTab === "AnalyticsCountingCrossing"
                  ? " active"
                  : "")
              }
              onClick={() => {
                setCurrentAnalyticsTab("AnalyticsCountingCrossing");
                dispatch(
                  setDeviationCurrentCctv(
                    cctvList.filter((cctv) => {
                      return (
                        cctv.type_analytics === "AnalyticsCountingCrossing"
                      );
                    })[0]
                  )
                );
              }}
            >
              <h6>Area Crossing</h6>
            </button>
          </div>
        )}
        <div className="d-xl-flex gap-4">
          <div className="d-grid gap-1 mb-xl-0 mb-3">
            <label>CCTV</label>
            <div
              className={
                "input-group" + (deviationLoading === true ? " disabled" : "")
              }
            >
              <label className="input-group-text" htmlFor="inputGroupSelect01">
                <MdiCctv className="filter-icon" />
              </label>
              <select
                className="form-select"
                id="inputGroupSelect01"
                defaultValue={deviationCurrentCctv}
                onChange={(value) => {
                  dispatch(
                    setDeviationCurrentCctv(JSON.parse(value.target.value))
                  );
                }}
              >
                {currentAnalyticsTab !== "AnalyticsCountingCrossing" ? (
                  <option value={JSON.stringify({ id: 0 })}>Semua CCTV</option>
                ) : (
                  ""
                )}
                {cctvFilter}
              </select>
            </div>
          </div>
          <div className="d-grid gap-1 mb-xl-0 mb-3">
            <label>
              {currentAnalyticsTab !== "AnalyticsCountingCrossing"
                ? "Deviasi"
                : "Objek"}
            </label>
            <div
              className={
                "input-group" + (deviationLoading === true ? " disabled" : "")
              }
            >
              <label className="input-group-text" htmlFor="inputGroupSelect02">
                <IcRoundFilterCenterFocus className="filter-icon" />
              </label>
              <select
                className="form-select"
                id="inputGroupSelect02"
                defaultValue={deviationCurrentObject}
                onChange={(value) => {
                  dispatch(setDeviationCurrentObject(value.target.value));
                }}
              >
                {objectFilter}
              </select>
            </div>
          </div>
          <div className="d-grid gap-1 mb-xl-0 mb-3">
            <label>Periode</label>
            <div
              className={
                "input-group" + (deviationLoading === true ? " disabled" : "")
              }
            >
              <label className="input-group-text" htmlFor="inputGroupSelect03">
                <BiCalendarWeek className="filter-icon" />
              </label>
              <button
                className="period-button d-flex justify-content-start align-items-center"
                id="inputGroupSelect03"
                data-bs-toggle="modal"
                data-bs-target="#periodModal"
              >
                <label>
                  {(deviationCurrentDate[0].getDate() < 10 ? "0" : "") +
                    deviationCurrentDate[0].getDate() +
                    "/" +
                    (deviationCurrentDate[0].getMonth() + 1 < 10 ? "0" : "") +
                    (deviationCurrentDate[0].getMonth() + 1) +
                    "/" +
                    deviationCurrentDate[0].getFullYear() +
                    " - " +
                    (deviationCurrentDate[1].getDate() < 10 ? "0" : "") +
                    deviationCurrentDate[1].getDate() +
                    "/" +
                    (deviationCurrentDate[1].getMonth() + 1 < 10 ? "0" : "") +
                    (deviationCurrentDate[1].getMonth() + 1) +
                    "/" +
                    deviationCurrentDate[1].getFullYear()}
                </label>
              </button>
            </div>
            <div
              className="modal fade"
              id="periodModal"
              tabIndex="-1"
              aria-labelledby="periodModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title" id="periodModalLabel">
                      Pilih Periode
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body d-grid justify-content-center gap-3">
                    <Calendar
                      onChange={setDate}
                      onClickDay={() => {
                        dateStatus.includes("start")
                          ? setDateStatus("*pilih tanggal (end)")
                          : dateStatus.includes("end")
                          ? setDateStatus("")
                          : setDateStatus("*pilih tanggal (end)");
                      }}
                      value={deviationCurrentDate}
                      maxDate={new Date()}
                      selectRange={true}
                    />
                    {timeFilter === false ? (
                      ""
                    ) : (
                      <div className="row">
                        <div className="col d-grid">
                          <label>Start</label>
                          <TimePicker
                            onChange={(value) => {
                              timeHandler(0, value);
                            }}
                            value={deviationCurrentTime[0]}
                            disableClock={true}
                          />
                        </div>
                        <div className="col d-grid">
                          <label>End</label>
                          <TimePicker
                            onChange={(value) => {
                              timeHandler(1, value);
                            }}
                            value={deviationCurrentTime[1]}
                            disableClock={true}
                          />
                        </div>
                      </div>
                    )}
                    <button
                      className="advanced-filter-button border-0"
                      title="filter waktu"
                      onClick={() => {
                        dispatch(
                          enableTimeFilter(timeFilter === false ? true : false)
                        );
                      }}
                    >
                      {timeFilter === false ? (
                        <CodiconFoldDown />
                      ) : (
                        <CodiconFoldUp />
                      )}
                    </button>
                  </div>
                  <div className="modal-footer">
                    <div className="row w-100 d-flex align-items-center">
                      <div className="col p-0">
                        <label>{dateStatus}</label>
                      </div>
                      <div className="col d-flex justify-content-end p-0 gap-3">
                        <button
                          className="reset-button rounded-2 px-3 py-2"
                          onClick={() => {
                            setDate([new Date(), new Date()]);
                            JSON.stringify(deviationCurrentDate) !==
                            JSON.stringify([new Date(), new Date()])
                              ? setDateStatus("*pilih tanggal (start)")
                              : setDateStatus(dateStatus);
                            dispatch(
                              setDeviationCurrentTime(["00:01", "23:59"])
                            );
                          }}
                        >
                          Reset
                        </button>
                        <button
                          className="ok-button border-0 rounded-2 px-3 py-2"
                          data-bs-dismiss="modal"
                        >
                          Ok
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {currentAnalyticsTab !== "AnalyticsCountingCrossing" ? (
            <div className="d-grid gap-1 mb-xl-0 mb-3">
              <label>Status Validasi</label>
              <div
                className={
                  "input-group" + (deviationLoading === true ? " disabled" : "")
                }
              >
                <label
                  className="input-group-text"
                  htmlFor="inputGroupSelect04"
                >
                  <MingcuteCheckFill className="filter-icon" />
                </label>
                <select
                  className="form-select"
                  id="inputGroupSelect04"
                  defaultValue={deviationCurrentValidationStatus}
                  onChange={(value) => {
                    dispatch(
                      setDeviationCurrentValidationStatus(value.target.value)
                    );
                  }}
                >
                  {validationTypeFilter}
                </select>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="col-xl d-xl-flex justify-content-end align-items-end">
            <DataExport currentAnalyticsTab={currentAnalyticsTab} />
          </div>
        </div>
      </div>
      <div className="content">
        <DataTable currentAnalyticsTab={currentAnalyticsTab} />
        <div>
          {deviationLoading === false ? (
            deviationList.length > 0 ? (
              <div className="row align-items-center mt-5">
                <div className="col">
                  <label>
                    {tablePageDataLimit <= deviationList.length
                      ? tablePageDataLimit
                      : deviationList.length}{" "}
                    dari {deviationList.length} data
                  </label>
                </div>
                <div className="col">
                  <div className="pagination-nav d-flex justify-content-center align-items-center gap-3">
                    <button
                      className={
                        "border-0 rounded-start py-2" +
                        (currentTablePage === 1 ? " disabled" : "")
                      }
                      onClick={() => {
                        dispatch(setCurrentTablePage(currentTablePage - 1));
                        dispatch(
                          setTablePageDataLimit(tablePageDataLimit - 25)
                        );
                      }}
                    >
                      Previous
                    </button>
                    <label>{currentTablePage}</label>
                    <button
                      className={
                        "border-0 rounded-end py-2" +
                        (tablePageDataLimit >= deviationList.length
                          ? " disabled"
                          : "")
                      }
                      onClick={() => {
                        dispatch(setCurrentTablePage(currentTablePage + 1));
                        dispatch(
                          setTablePageDataLimit(tablePageDataLimit + 25)
                        );
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="col"></div>
              </div>
            ) : (
              <label className="w-100 text-center my-2">
                Tidak terdapat data yang sesuai dengan filter CCTV, Objek,
                Status Validasi, maupun Periode
              </label>
            )
          ) : (
            <div className="d-flex justify-content-center my-3">
              <div className="spinner-border">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseDeviasi;
