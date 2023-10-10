import "../styles/cctv.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentCctv,
  deleteDeviationIndicatedCctv,
} from "../redux/cctvSlice";
import {
  setNotificationCurrentCctv,
  setCurrentNotification,
  setNotificationLimit,
  showNotificationChild,
} from "../redux/notificationSlice";

const Cctv = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.general.mode);
  const page = useSelector((state) => state.general.page);
  const cctvList = useSelector((state) => state.cctv.list);
  const cctvLoading = useSelector((state) => state.cctv.loading);
  const currentCctv = useSelector((state) => state.cctv.current);
  const deviationIndicatedCctv = useSelector(
    (state) => state.cctv.deviationIndicatedCctv
  );

  const fullscreenHandler = (event) => {
    document.getElementById(event)?.requestFullscreen();
  };

  const cctvArray = cctvList.map((cctv, index) => {
    return (
      <button
        key={cctv.id}
        className={
          "border-0 text-start rounded-2 px-3 py-2" +
          (currentCctv?.id === cctv.id ? " active" : "")
        }
        onClick={() => {
          dispatch(setCurrentCctv(cctvList[index]));
          dispatch(setNotificationCurrentCctv(cctv.id));
          dispatch(setCurrentNotification());
          dispatch(showNotificationChild());
          dispatch(setNotificationLimit(10));
          dispatch(deleteDeviationIndicatedCctv(cctv.id?.toString()));
        }}
      >
        <div className="row align-items-center">
          <div className="col">{cctv.name + " - " + cctv.location}</div>
          {deviationIndicatedCctv.includes(cctv.id?.toString()) ? (
            <div className="col-1 p-0">
              <div></div>
            </div>
          ) : (
            ""
          )}
        </div>
      </button>
    );
  });

  return (
    <div className={"cctv" + (mode === "light" ? " cctv-light" : " cctv-dark")}>
      <div className="title mb-3">
        <h6>List CCTV</h6>
        <label>Pilih CCTV untuk melihat Live Monitoring</label>
      </div>
      <div className="content">
        {cctvLoading === false ? (
          <div className="cctv-list d-grid gap-2">
            {cctvList.length !== 0 ? (
              <button
                className={
                  "border-0 text-start rounded-2 px-3 py-2 mb-2" +
                  (currentCctv?.id === 0 ? " active" : "")
                }
                onClick={() => {
                  dispatch(
                    setCurrentCctv({
                      id: 0,
                    })
                  );
                  dispatch(setNotificationCurrentCctv(0));
                  dispatch(setCurrentNotification());
                  dispatch(showNotificationChild());
                  dispatch(setNotificationLimit(10));
                }}
              >
                <div className="d-flex justify-content-center">
                  <div>Semua CCTV</div>
                </div>
              </button>
            ) : (
              ""
            )}
            {cctvList.length !== 0 ? (
              cctvArray
            ) : (
              <div className="d-flex justify-content-center">
                <label className="data-not-found">CCTV tidak ditemukan</label>
              </div>
            )}
          </div>
        ) : (
          <div className="d-flex justify-content-center my-3">
            <div className="spinner-border">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {page === "live-monitoring" && cctvList.length !== 0 ? (
          <div className="view-all-cctv d-grid mt-4">
            <button
              className="border-0 rounded-2 px-3 py-2"
              onClick={() => {
                fullscreenHandler("all-cctv");
              }}
            >
              Lihat Semua CCTV
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Cctv;
