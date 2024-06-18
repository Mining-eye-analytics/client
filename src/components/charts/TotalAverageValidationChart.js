import "../../styles/notification_chart.scss";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import customAxios from "../../utils/customAxios";
import dayjs from "dayjs";

export const TotalAverageValidationChart = () => {
  const dashboardCurrentCctv = useSelector(
    (state) => state.dashboard.currentCctv
  );
  const dashboardCurrentDate = useSelector(
    (state) => state.dashboard.currentDate
  );

  const [loading, setLoading] = useState(false);
  const [totalAverageValidation, setTotalAverageValidationData] = useState([]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    setLoading(true);

    customAxios({
      method: "GET",
      url:
        "/dashboards/total_average_validation?" +
        (dashboardCurrentCctv.id !== 0
          ? "cctv_id=" + dashboardCurrentCctv.id + "&"
          : "") +
        "startDate=" +
        dayjs(dashboardCurrentDate[1]).format("YYYY-MM-DD"),
    })
      .then((res) => {
        setTotalAverageValidationData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dashboardCurrentCctv, dashboardCurrentDate]);

  return (
    <div className="info rounded-2 d-grid gap-3 px-3 py-2">
      <div className="info-title d-flex align-items-center">
        Data deviasi tervalidasi
        {loading ? (
          <div
            className="d-flex justify-content-center ms-auto"
            style={{ color: "#3B9315" }}
          >
            <div className="spinner-border spinner-border-sm">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="info-chart">
        <div className="row m-0 gap-3">
          <div className="col p-0 d-grid gap-3">
            <div className="d-grid justify-content-center">
              <div className="d-flex justify-content-center">
                <label className="info-title">7 Hari terakhir</label>
              </div>
              <div className="d-flex justify-content-center">
                <label className="info-title">
                  (
                  {`${dayjs(
                    totalAverageValidation?.this_week?.date_range?.split(
                      " - "
                    )[0]
                  ).date()} ${
                    monthNames[
                      dayjs(
                        totalAverageValidation?.this_week?.date_range?.split(
                          " - "
                        )[0]
                      ).month()
                    ]
                  } -
                  ${dayjs(
                    totalAverageValidation?.this_week?.date_range?.split(
                      " - "
                    )[1]
                  ).date()} ${
                    monthNames[
                      dayjs(
                        totalAverageValidation?.this_week?.date_range?.split(
                          " - "
                        )[1]
                      ).month()
                    ]
                  } ${dayjs().year()}`}
                  )
                </label>
              </div>
            </div>
            <div className="d-flex gap-4">
              <div>
                <div className="info-title">
                  <label>Total</label>
                </div>
                <div className="info-content d-flex justify-content-center align-items-end gap-1">
                  <label>{totalAverageValidation?.this_week?.total}</label>
                  <label></label>
                </div>
              </div>
              <div>
                <div className="info-title">
                  <label>Rata-rata</label>
                </div>
                <div className="info-content d-flex align-items-end gap-1">
                  <label>
                    {totalAverageValidation?.this_week?.day_average.toFixed(2)}
                  </label>
                  <label>/hari</label>
                </div>
              </div>
            </div>
          </div>
          <div className="col p-0 ps-3 d-grid gap-3 border-start border-dash">
            <div className="d-grid justify-content-center">
              <div className="d-flex justify-content-center">
                <label className="info-title">Minggu sebelumnya</label>
              </div>
              <div className="d-flex justify-content-center">
                <label className="info-title">
                  (
                  {`${dayjs(
                    totalAverageValidation?.last_week?.date_range?.split(
                      " - "
                    )[0]
                  ).date()} ${
                    monthNames[
                      dayjs(
                        totalAverageValidation?.last_week?.date_range?.split(
                          " - "
                        )[0]
                      ).month()
                    ]
                  } -
                  ${dayjs(
                    totalAverageValidation?.last_week?.date_range?.split(
                      " - "
                    )[1]
                  ).date()} ${
                    monthNames[
                      dayjs(
                        totalAverageValidation?.last_week?.date_range?.split(
                          " - "
                        )[1]
                      ).month()
                    ]
                  } ${dayjs().year()}`}
                  )
                </label>
              </div>
            </div>
            <div className="d-flex gap-4">
              <div>
                <div className="info-title">
                  <label>Total</label>
                </div>
                <div className="info-content d-flex justify-content-center align-items-end gap-1">
                  <label>{totalAverageValidation?.last_week?.total}</label>
                  <label></label>
                </div>
              </div>
              <div>
                <div className="info-title">
                  <label>Rata-rata</label>
                </div>
                <div className="info-content d-flex align-items-end gap-1">
                  <label>
                    {totalAverageValidation?.last_week?.day_average.toFixed(2)}
                  </label>
                  <label>/hari</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
