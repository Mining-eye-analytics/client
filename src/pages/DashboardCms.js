import "../styles/dashboard_cms.scss";
import Dashboard from "./Dashboard";
import CmsUser from "./CmsUser";
import CmsCctv from "./CmsCctv";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserList } from "../redux/userSlice";
import { getCctvList } from "../redux/cctvSlice";
import { setMode } from "../redux/generalSlice";
import { ReactComponent as MingcuteGrid2Fill } from "../assets/iconify/mingcute--grid-2-fill.svg";
import { ReactComponent as MdiUsers } from "../assets/iconify/mdi--users.svg";
import { ReactComponent as MdiCctv } from "../assets/iconify/mdi--cctv.svg";
import { ReactComponent as PhSunFill } from "../assets/iconify/ph--sun-fill.svg";
import { ReactComponent as PhMoonFill } from "../assets/iconify/ph--moon-fill.svg";
import { ReactComponent as TablerArrowBackUp } from "../assets/iconify/tabler--arrow-back-up.svg";
import { ReactComponent as HeroiconsOutlineLogout } from "../assets/iconify/heroicons-outline--logout.svg";

const DashboardCms = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.general.mode);

  const [currentTab, setCurrentTab] = useState("dashboard");

  useEffect(() => {
    dispatch(getUserList());
    dispatch(getCctvList());
  }, []);

  return (
    <div
      className={
        "dashboard-cms" +
        (mode === "light" ? " dashboard-cms-light" : " dashboard-cms-dark")
      }
    >
      <div className="row w-100 m-0">
        <div className="navbar col-2 px-4 py-2 d-flex align-items-start flex-column">
          <div className="d-grid gap-4 mb-auto">
            <div className="d-flex justify-content-center">
              <img
                className="w-100"
                src={require("../assets/" +
                  (mode === "light" ? "logo.webp" : "logo-dark.webp"))}
                alt=""
              />
            </div>
            <div>
              <h6 className="pb-2">Dashboard</h6>
              <button
                className={
                  "border-0 rounded-2 px-3 py-2 d-flex align-items-center gap-1 w-100" +
                  (currentTab === "dashboard" ? " active" : "")
                }
                onClick={() => {
                  setCurrentTab("dashboard");
                }}
              >
                <MingcuteGrid2Fill className="icon" />
                <label>Dashboard</label>
              </button>
            </div>
            <div>
              <h6 className="pb-2">Content Management</h6>
              <div className="d-grid gap-3">
                <button
                  className={
                    "border-0 rounded-2 px-3 py-2 d-flex align-items-center gap-1 w-100" +
                    (currentTab === "cms-user" ? " active" : "")
                  }
                  onClick={() => {
                    setCurrentTab("cms-user");
                  }}
                >
                  <MdiUsers className="icon" />
                  <label>Pengguna</label>
                </button>
                <button
                  className={
                    "border-0 rounded-2 px-3 py-2 d-flex align-items-center gap-1 w-100" +
                    (currentTab === "cms-cctv" ? " active" : "")
                  }
                  onClick={() => {
                    setCurrentTab("cms-cctv");
                  }}
                >
                  <MdiCctv className="icon" />
                  <label>CCTV</label>
                </button>
              </div>
            </div>
          </div>
          <div className="exit-nav d-grid gap-2">
            <span className="mode-nav d-flex align-items-center ms-3 mb-3">
              <button
                className="border-0 rounded-5 row align-items-center m-0 p-0"
                title="mode terang/gelap"
                onClick={() => {
                  dispatch(setMode(mode === "light" ? "dark" : "light"));
                }}
              >
                {mode === "light" ? (
                  <span className="col rounded-5 d-flex p-0"></span>
                ) : (
                  ""
                )}
                {mode === "light" ? (
                  <PhSunFill className="col d-flex p-0" />
                ) : (
                  <PhMoonFill className="col d-flex p-0" />
                )}
                {mode === "dark" ? (
                  <span className="col d-flex p-0 rounded-5"></span>
                ) : (
                  ""
                )}
              </button>
            </span>

            <span
              className="back-nav d-flex align-items-center gap-1 ms-3"
              onClick={() => {
                window.location.href = "/validasi-notifikasi";
              }}
            >
              <TablerArrowBackUp className="icon" />
              <label>Kembali Ke MEA</label>
            </span>
            <span
              className="logout-nav d-flex align-items-center gap-1 mx-3"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
                window.location.reload();
              }}
            >
              <HeroiconsOutlineLogout className="icon" />
              <label>Log Out</label>
            </span>
          </div>
        </div>
        <div className="content col px-4 pt-2">
          {currentTab === "dashboard" ? (
            <Dashboard />
          ) : currentTab === "cms-user" ? (
            <CmsUser />
          ) : (
            <CmsCctv />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCms;
