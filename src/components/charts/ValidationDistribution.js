import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import customAxios from "../../utils/customAxios";
import dayjs from "dayjs";

export const ValidationDistributionChart = () => {
  const mode = useSelector((state) => state.general.mode);
  const dashboardCurrentCctv = useSelector(
    (state) => state.dashboard.currentCctv
  );
  const dashboardCurrentDate = useSelector(
    (state) => state.dashboard.currentDate
  );

  const [loading, setLoading] = useState(false);
  const [validationDistributionData, setValidationDistributionData] = useState(
    []
  );

  const daysOfWeek = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  useEffect(() => {
    setLoading(true);

    customAxios({
      method: "GET",
      url:
        "/dashboards/validation_distribution?" +
        (dashboardCurrentCctv.id !== 0
          ? "cctv_id=" + dashboardCurrentCctv.id + "&"
          : "") +
        "startDate=" +
        dayjs(dashboardCurrentDate[0]).format("YYYY-MM-DD") +
        "&endDate=" +
        dayjs(dashboardCurrentDate[1]).format("YYYY-MM-DD"),
    })
      .then((res) => {
        setValidationDistributionData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dashboardCurrentCctv, dashboardCurrentDate]);

  const getColor = (count) => {
    if (count === 0) {
      return "rgb(255, 255, 255)";
    }
    const intensity = Math.min(count * 10, 255);
    const redIntensity = 0;
    const greenIntensity = 255 - intensity;
    const blueIntensity = 0;
    return `rgb(${redIntensity}, ${greenIntensity}, ${blueIntensity})`;
  };

  return (
    <div className="info rounded-2 d-grid gap-3 px-3 py-2">
      <div className="info-title d-flex align-items-center">
        Persebaran validasi
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
        <table className={mode === "light" ? "text-dark" : "text-white"}>
          <thead>
            <tr>
              <th
                style={{
                  width: "4rem",
                  height: "1.5rem",
                  textAlign: "left",
                  fontWeight: 400,
                  fontSize: "12px",
                }}
              >
                D/T
              </th>
              {validationDistributionData?.hours?.map((hour, index) => (
                <th
                  key={index}
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    fontWeight: 400,
                    fontSize: "12px",
                  }}
                >
                  <div className="d-flex justify-content-center">{hour}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {validationDistributionData?.date?.map((date, dateIndex) => (
              <tr key={dateIndex}>
                <td>
                  <div
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "12px",
                    }}
                  >
                    <span>{daysOfWeek[new Date(date).getDay()]}</span>
                  </div>
                </td>
                {validationDistributionData?.validation_count[dateIndex]?.map(
                  (count, hourIndex) => (
                    <td
                      className="text-black border"
                      key={hourIndex}
                      style={{
                        backgroundColor: getColor(count),
                        width: "1.5rem",
                        height: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "12px",
                        }}
                      >
                        <span>{count}</span>
                      </div>
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
