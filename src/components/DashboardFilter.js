import "../styles/dashboard_filter.scss";
import "../styles/calendar.css";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useSelector, useDispatch } from "react-redux";
import {
  setDashboardCurrentCctv,
  setDashboardCurrentDate,
} from "../redux/dashboardSlice";
import dayjs from "dayjs";
import { ReactComponent as MdiCctv } from "../assets/iconify/mdi--cctv.svg";
import { ReactComponent as BiCalendarWeek } from "../assets/iconify/bi--calendar-week.svg";

export const DashboardFilter = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.general.mode);
  const cctvList = useSelector((state) => state.cctv.list);
  const deviationLoading = useSelector((state) => state.deviation.loading);
  const dashboardCurrentCctv = useSelector(
    (state) => state.dashboard.currentCctv
  );
  const dashboardCurrentDate = useSelector(
    (state) => state.dashboard.currentDate
  );

  const [dateStatus, setDateStatus] = useState("*pilih tanggal (start)");
  const [date, setDate] = useState([
    new Date(dayjs().subtract(6, "day")),
    new Date(dayjs()),
  ]);

  useEffect(() => {
    dispatch(setDashboardCurrentDate(date));
  }, [date]);

  const cctvFilter = cctvList.map((cctv) => {
    return (
      <option key={cctv.id} value={JSON.stringify(cctv)}>
        {cctv.name + " - " + cctv.location}
      </option>
    );
  });

  return (
    <div
      className={
        "dashboard-filter" +
        (mode === "light"
          ? " dashboard-filter-light"
          : " dashboard-filter-dark")
      }
    >
      <div className="d-flex gap-4">
        <div>
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
              defaultValue={dashboardCurrentCctv}
              onChange={(value) => {
                dispatch(
                  setDashboardCurrentCctv(JSON.parse(value.target.value))
                );
              }}
            >
              <option value={JSON.stringify({ id: 0 })}>Semua CCTV</option>
              {cctvFilter}
            </select>
          </div>
        </div>
        <div>
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
                {(dashboardCurrentDate[0].getDate() < 10 ? "0" : "") +
                  dashboardCurrentDate[0].getDate() +
                  "/" +
                  (dashboardCurrentDate[0].getMonth() + 1 < 10 ? "0" : "") +
                  (dashboardCurrentDate[0].getMonth() + 1) +
                  "/" +
                  dashboardCurrentDate[0].getFullYear() +
                  " - " +
                  (dashboardCurrentDate[1].getDate() < 10 ? "0" : "") +
                  dashboardCurrentDate[1].getDate() +
                  "/" +
                  (dashboardCurrentDate[1].getMonth() + 1 < 10 ? "0" : "") +
                  (dashboardCurrentDate[1].getMonth() + 1) +
                  "/" +
                  dashboardCurrentDate[1].getFullYear()}
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
                    value={dashboardCurrentDate}
                    maxDate={new Date()}
                    selectRange={true}
                  />
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
                          setDate([
                            new Date(dayjs().subtract(6, "day")),
                            new Date(dayjs()),
                          ]);
                          JSON.stringify(dashboardCurrentDate) !==
                          JSON.stringify([
                            new Date(dayjs().subtract(6, "day")),
                            new Date(dayjs()),
                          ])
                            ? setDateStatus("*pilih tanggal (start)")
                            : setDateStatus(dateStatus);
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
      </div>
    </div>
  );
};
