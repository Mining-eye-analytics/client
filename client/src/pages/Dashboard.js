import "../styles/dashboard.scss";
import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
} from "recharts";
import { useSelector } from "react-redux";

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-16} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={4} textAnchor="middle" fill={fill}>{` (${(
        percent * 100
      ).toFixed(2)}%)`}</text>
      <text
        x={cx}
        y={cy}
        dy={24}
        textAnchor="middle"
        fill={props.mode === "light" ? "#333" : "white"}
      >{`${value} Deviasi`}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const Dashboard = () => {
  const mode = useSelector((state) => state.general.mode);
  const userList = useSelector((state) => state.user.list);
  const cctvList = useSelector((state) => state.cctv.list);

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const [deviationData, setDeviationData] = useState([]);
  const [cctvData, setCctvData] = useState([]);

  const getDay = (number) => {
    const day = new Date();
    day.setDate(day.getDate() - number);
    return day;
  };

  useEffect(() => {
    const tempData = [];

    for (let i = 0; i < 7; i++) {
      tempData.unshift({
        name: new Date(getDay(i)).toLocaleString("id-ID", {
          weekday: "long",
        }),
        true: Math.floor(Math.random() * 500),
        false: Math.floor(Math.random() * 1500),
      });
    }
    setDeviationData(tempData);
  }, []);

  useEffect(() => {
    const tempData = [];

    for (let i = 0; i < cctvList.length; i++) {
      tempData.push({
        name: cctvList[i]?.name + " - " + cctvList[i]?.location,
        value: Math.floor(Math.random() * 3000),
      });
    }
    setCctvData(tempData);
  }, [cctvList]);

  return (
    <div
      className={
        "dashboard d-flex flex-column gap-3" +
        (mode === "light" ? " dashboard-light" : " dashboard-dark")
      }
    >
      <div className="row m-0">
        <div className="col p-0">
          <h1>Dasbor</h1>
        </div>
        <div className="col p-0 d-flex justify-content-end">
          <button className="border-0 rounded-2 px-3 py-2 d-flex align-items-center gap-1">
            <Icon className="icon" icon="entypo:export" />
            <label>Export</label>
          </button>
        </div>
      </div>
      <div className="d-grid gap-3 overflow-auto pb-2">
        <div className="row m-0 gap-3 align-items-end">
          <div className="col-3 p-0">
            <div className="info rounded-2 d-grid gap-3 px-3 py-2">
              <label className="info-title">
                Total pengguna pada <br /> HO
              </label>
              <div className="info-content d-flex justify-content-center align-items-end gap-1">
                <label>{userList.length}</label>
                <label>pengguna</label>
              </div>
              <div className="info-other d-flex justify-content-end gap-1">
                <Icon className="icon" icon="clarity:server-solid" />
                <label>
                  {window.location.hostname === "localhost"
                    ? "10.10.10.66"
                    : window.location.hostname}
                </label>
              </div>
            </div>
          </div>
          <div className="col-3 p-0">
            <div className="info rounded-2 d-grid gap-3 px-3 py-2">
              <label className="info-title">Jumlah pengguna yang online</label>
              <div className="info-content d-flex justify-content-center align-items-end gap-1">
                <label>3</label>
                <label>pengguna</label>
              </div>
              <div className="info-other d-flex justify-content-end gap-1">
                <Icon className="icon" icon="akar-icons:clock" />
                <label>
                  {new Date().toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="row m-0 gap-3 align-items-end">
          <div className="col-3 p-0">
            <div className="info rounded-2 d-grid gap-3 px-3 py-2">
              <label className="info-title">
                Jumlah CCTV yang telah <br /> terealisasi
              </label>
              <div className="d-flex justify-content-center align-items-end gap-1">
                <div className="info-content d-flex align-items-end gap-1">
                  <label>{cctvList.length}</label>
                  <label>CCTV</label>
                </div>
                <div className="info-content">
                  <label></label>
                  <label>/</label>
                </div>
                <div className="info-content d-flex align-items-end gap-1">
                  <label>6</label>
                  <label>CCTV</label>
                </div>
              </div>

              <div className="info-other d-flex justify-content-end gap-1">
                <Icon className="icon" icon="carbon:location-filled" />
                <label>
                  {window.location.hostname === "localhost"
                    ? "10.10.10.66"
                    : window.location.hostname}
                </label>
              </div>
            </div>
          </div>
          <div className="col-3 p-0">
            <div className="info rounded-2 d-grid gap-3 px-3 py-2">
              <label className="info-title">
                CCTV yang paling sering diakses
              </label>
              <div className="info-content d-flex justify-content-center align-items-end gap-1">
                <label>HO - Indoor Finance</label>
              </div>
              <div className="info-other d-flex justify-content-end gap-1">
                <Icon className="icon" icon="bi:calendar-week" />
                <label>
                  {new Date().getDate() +
                    " " +
                    new Date().toLocaleString("id-ID", { month: "long" }) +
                    " " +
                    new Date().getFullYear()}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="row m-0 gap-3 align-items-end">
          <div className="col-3 p-0 d-grid gap-1">
            <div className="info-header d-flex gap-1">
              <Icon className="icon" icon="bi:calendar-week" />
              <label>
                {getDay(6).getDate() +
                  " " +
                  getDay(6).toLocaleString("id-ID", { month: "long" }) +
                  " - " +
                  (new Date().getDate() +
                    " " +
                    new Date().toLocaleString("id-ID", { month: "long" }))}
              </label>
            </div>
            <div className="info rounded-2 d-grid gap-3 px-3 py-2">
              <div className="info-title">
                Perseberan data validasi selama 1 minggu
              </div>
              <div className="info-chart">
                <BarChart
                  width={500}
                  height={300}
                  data={deviationData}
                  margin={{
                    top: 20,
                    right: 5,
                    left: -30,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="true" stackId="a" fill="#8EDCA9" />
                  <Bar dataKey="false" fill="#F08C80" />
                </BarChart>
              </div>
            </div>
          </div>
          <div className="col-3 p-0">
            <div className="d-grid gap-3">
              <div className="info rounded-2 d-grid gap-2 px-3 py-2">
                <div className="info-title">
                  Jumlah data deviasi berdasarkan CCTV
                </div>
                <div className="info-bar d-flex justify-content-center">
                  <PieChart width={190} height={200}>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={cctvData}
                      cx={90}
                      cy={100}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                      mode={mode}
                    />
                  </PieChart>
                </div>
              </div>
              <div className="info rounded-2 d-grid gap-3 px-3 py-2">
                <div className="row m-0 gap-3">
                  <div className="col p-0  d-grid gap-3">
                    <label className="info-title">Total data deviasi</label>
                    <div className="info-content d-flex align-items-end gap-1">
                      <label>100</label>
                      <label>Deviasi</label>
                    </div>
                  </div>
                  <div className="col p-0 ps-3 d-grid gap-3 border-start border-dash">
                    <label className="info-title">
                      Total data deviasi tervalidasi
                    </label>
                    <div className="row m-0">
                      <div className="col p-0">
                        <div className="info-title">
                          <label>(TRUE)</label>
                        </div>
                        <div className="info-content d-flex align-items-end gap-1">
                          <label>6</label>
                          <label>Validasi</label>
                        </div>
                      </div>
                      <div className="col p-0">
                        <div className="info-title">
                          <label>(FALSE)</label>
                        </div>
                        <div className="info-content d-flex align-items-end gap-1">
                          <label>31</label>
                          <label>Validasi</label>
                        </div>
                      </div>
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

export default Dashboard;
