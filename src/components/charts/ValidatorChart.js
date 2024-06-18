import "../../styles/notification_chart.scss";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import customAxios from "../../utils/customAxios";
import dayjs from "dayjs";

export const ValidatorChart = () => {
  const dashboardCurrentCctv = useSelector(
    (state) => state.dashboard.currentCctv
  );
  const dashboardCurrentDate = useSelector(
    (state) => state.dashboard.currentDate
  );

  const [loading, setLoading] = useState(false);
  const [validatorData, setValidatorData] = useState([]);

  const chartLabel = ["Tim Safety", "Tim Developer", "Pengawas Control Room"];
  const safetyTeam = [];
  const developerTeam = [1];
  const chartColor = ["31, 138, 88", "21, 115, 253", "222, 68, 82"];

  const chartData3 = {
    labels: validatorData?.map((validator) =>
      safetyTeam.includes(validator.user_id)
        ? chartLabel[0]
        : developerTeam.includes(validator.user_id)
        ? chartLabel[1]
        : chartLabel[2]
    ),
    datasets: [
      {
        label: "",
        data: validatorData?.map((validator) => validator.count),
        fill: true,
        borderColor: validatorData?.map(
          (validator, index) => `rgb(${chartColor[index]})`
        ),
        backgroundColor: validatorData?.map(
          (validator, index) => `rgba(${chartColor[index]}, 0.5)`
        ),
        tension: 0.1,
      },
    ],
  };

  useEffect(() => {
    setLoading(true);

    customAxios({
      method: "GET",
      url:
        "/dashboards/validator_profile?" +
        (dashboardCurrentCctv.id !== 0
          ? "cctv_id=" + dashboardCurrentCctv.id + "&"
          : "") +
        "startDate=" +
        dayjs(dashboardCurrentDate[0]).format("YYYY-MM-DD") +
        "&endDate=" +
        dayjs(dashboardCurrentDate[1]).format("YYYY-MM-DD"),
    })
      .then((res) => {
        setValidatorData(res.data.data);
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
        Profiling Validator
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
        <Pie data={chartData3} />
      </div>
    </div>
  );
};
