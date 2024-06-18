import "../../styles/notification_chart.scss";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import customAxios from "../../utils/customAxios";
import dayjs from "dayjs";

export const ValidationChart = () => {
  const cctvList = useSelector((state) => state.cctv.list);
  const dashboardCurrentCctv = useSelector(
    (state) => state.dashboard.currentCctv
  );
  const dashboardCurrentDate = useSelector(
    (state) => state.dashboard.currentDate
  );

  const [loading, setLoading] = useState(false);
  const [validationData, setValidationData] = useState([]);

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

  const chartData = {
    labels: validationData
      ?.filter((data) => data.cctv_id === cctvList[0]?.id)
      ?.map(
        (data) =>
          `${dayjs(data.date).date()} ${monthNames[dayjs(data.date).month()]}`
      ),
    datasets: [
      {
        label: "Validasi True",
        data: validationData?.map((data) => data.true_count),
        fill: true,
        borderColor: "rgb(31, 138, 88)",
        backgroundColor: "rgba(31, 138, 88, 0.5)",
        tension: 0.1,
      },
      {
        label: "Validasi False",
        data: validationData?.map((data) => data.false_count),
        fill: true,
        borderColor: "rgb(222, 68, 82)",
        backgroundColor: "rgba(222, 68, 82, 0.5)",
        tension: 0.1,
      },
    ],
  };

  useEffect(() => {
    setLoading(true);

    customAxios({
      method: "GET",
      url:
        "/dashboards/validation_profile?" +
        (dashboardCurrentCctv.id !== 0
          ? "cctv_id=" + dashboardCurrentCctv.id + "&"
          : "") +
        "startDate=" +
        dayjs(dashboardCurrentDate[0]).format("YYYY-MM-DD") +
        "&endDate=" +
        dayjs(dashboardCurrentDate[1]).format("YYYY-MM-DD"),
    })
      .then((res) => {
        setValidationData(res.data.data);
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
        Profiling validasi
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
        <Line data={chartData} />
      </div>
    </div>
  );
};
