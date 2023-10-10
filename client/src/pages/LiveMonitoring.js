import "../styles/live_monitoring.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import ReactImageMagnify from "react-magnify-image";
import { useSelector } from "react-redux";

const LiveMonitoring = () => {
  const mode = useSelector((state) => state.general.mode);
  const cctvList = useSelector((state) => state.cctv.list);
  const currentCctv = useSelector((state) => state.cctv.current);
  const objectList = useSelector((state) => state.object.list);

  const [realTimeCctvLoading, setRealTimeCctvLoading] = useState(false);
  const [realTimeCctv, setRealTimeCctv] = useState();
  const [realTimeCctvError, setRealTimeCctvError] = useState(false);
  const [annotation, setAnnotation] = useState([]);
  const [perimeterSecureArea, setPerimeterSecureArea] = useState();
  const [perimeterObject, setPerimeterObject] = useState([]);
  const [distanceHdDefault, setDistanceHdDefault] = useState();
  const [distanceHd, setDistanceHd] = useState();
  const [controlLoading, setControlLoading] = useState(false);

  const perimeterSecureAreaData = [
    { id: 1, value: true, desc: "Di Dalam Box" },
    { id: 2, value: false, desc: "Di Luar Box" },
  ];

  const annotationAdder = (e) => {
    setAnnotation((arr) => [
      ...arr,
      [e.nativeEvent.offsetX * 1.70, e.nativeEvent.offsetY * 1.70],
    ]);
  };

  const annotationDotArray = annotation.map((annotation, index) => {
    return (
      <div
        className="annotation-dot position-absolute rounded-5 d-flex justify-content-center align-items-center"
        style={{
          width: "16px",
          height: "16px",
          fontSize: "12px",
          color: "black",
          backgroundColor: "#FFD801",
          left: annotation[0] / 1.70 - 8 + "px",
          top: annotation[1] / 1.70 - 8 + "px",
        }}
        key={index}
      >
        <label>{index + 1}</label>
      </div>
    );
  });

  const perimeterSecureAreaArray = perimeterSecureAreaData.map((data) => {
    return (
      <div className="form-check d-flex gap-1" key={data.id}>
        <input
          className="form-check-input"
          type="radio"
          name="flexRadioDefault"
          id={"secure" + data.id}
          onChange={() => {
            setPerimeterSecureArea(data.value);
          }}
          checked={perimeterSecureArea === data.value ? true : false}
        />
        <label className="form-check-label" htmlFor={"secure" + data.id}>
          {data.desc}
        </label>
      </div>
    );
  });

  const perimeterObjectArray = objectList.map((data) => {
    if (data.value !== "All") {
      return (
        <div className="form-check d-flex gap-1" key={data.id}>
          <input
            className="form-check-input"
            type="checkbox"
            value={data.value}
            id={"object" + data.id}
            checked={perimeterObject.includes(data.value)}
            onChange={() => {
              perimeterObject.includes(data.value)
                ? setPerimeterObject((arr) =>
                    arr.filter((value) => value !== data.value)
                  )
                : setPerimeterObject((arr) => [...arr, data.value]);
            }}
          />
          <label className="form-check-label" htmlFor={"object" + data.id}>
            {data.value}
          </label>
        </div>
      );
    }
  });

  useEffect(() => {
    if (currentCctv && currentCctv?.id !== 0) {
      axios
        .get(
          window.location.protocol +
            "//" +
            (window.location.hostname === "localhost"
              ? "10.10.10.66"
              : window.location.hostname) +
            ":" +
            process.env.REACT_APP_API_PORT +
            "/api/polygon/" +
            currentCctv?.id,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          setAnnotation(res.data.data.polygon);
          setPerimeterSecureArea(res.data.data.outside_secure_area);
          setPerimeterObject(res.data.data.object_perimeter);
        })
        .catch((err) => console.log(err));
    }
  }, [currentCctv]);

  const perimeterAreaHandler = () => {
    axios({
      method: "post",
      url:
        window.location.protocol +
        "//" +
        (window.location.hostname === "localhost"
          ? "10.10.10.66"
          : window.location.hostname) +
        ":" +
        process.env.REACT_APP_API_PORT +
        "/api/polygon/" +
        currentCctv?.id,
      data: {
        polygon: annotation,
        outside_secure_area: perimeterSecureArea,
        object_perimeter: perimeterObject,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (currentCctv && currentCctv?.id !== 0) {
      axios
        .get(
          window.location.protocol +
            "//" +
            (window.location.hostname === "localhost"
              ? "10.10.10.66"
              : window.location.hostname) +
            ":" +
            process.env.REACT_APP_API_PORT +
            "/api/distance_hd/" +
            currentCctv?.id,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          setDistanceHdDefault(res.data.data.Distance);
          setDistanceHd(res.data.data.Distance);
        })
        .catch((err) => console.log(err));
    }
  }, [currentCctv]);

  const distanceHdHandler = () => {
    axios({
      method: "post",
      url:
        window.location.protocol +
        "//" +
        (window.location.hostname === "localhost"
          ? "10.10.10.66"
          : window.location.hostname) +
        ":" +
        process.env.REACT_APP_API_PORT +
        "/api/distance_hd/" +
        currentCctv?.id,
      data: {
        distance_hd: distanceHd,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setRealTimeCctvLoading(true);
    if (currentCctv) {
      var image = new Image();
      image.src =
        window.location.protocol +
        "//" +
        (window.location.hostname === "localhost"
          ? "10.10.10.66"
          : window.location.hostname) +
        ":" +
        process.env.REACT_APP_API_PORT +
        "/api/video_feed/" +
        currentCctv?.id;
      image.onload = () => {
        setRealTimeCctvLoading(false);
        setRealTimeCctvError(false);
        setRealTimeCctv(
          window.location.protocol +
            "//" +
            (window.location.hostname === "localhost"
              ? "10.10.10.66"
              : window.location.hostname) +
            ":" +
            process.env.REACT_APP_API_PORT +
            "/api/video_feed/" +
            currentCctv?.id
        );
      };
      image.onerror = () => {
        setRealTimeCctvLoading(false);
        setRealTimeCctvError(true);
      };
    }
  }, [currentCctv]);

  const controlHandler = (act) => {
    setControlLoading(true);
    axios({
      method: "post",
      url:
        window.location.protocol +
        "//" +
        (window.location.hostname === "localhost"
          ? "10.10.10.66"
          : window.location.hostname) +
        ":" +
        process.env.REACT_APP_API_PORT +
        "/api/control-cctv/" +
        currentCctv?.id,
      data: {
        control: act,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((data) => {})
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setControlLoading(false);
      });
  };

  const fullscreenHandler = (event) => {
    document.getElementById(event)?.requestFullscreen();
  };

  const allCctvArray = cctvList.map((cctv) => {
    return (
      <div className="col-6 m-0 p-0" key={cctv.id}>
        <ReactImageMagnify
          className="w-100"
          {...{
            smallImage: {
              alt: "live_monitoring",
              isFluidWidth: true,
              src:
                window.location.protocol +
                "//" +
                (window.location.hostname === "localhost"
                  ? "10.10.10.66"
                  : window.location.hostname) +
                ":" +
                process.env.REACT_APP_API_PORT +
                "/api/video_feed/" +
                cctv.id,
            },
            largeImage: {
              src:
                window.location.protocol +
                "//" +
                (window.location.hostname === "localhost"
                  ? "10.10.10.66"
                  : window.location.hostname) +
                ":" +
                process.env.REACT_APP_API_PORT +
                "/api/video_feed/" +
                cctv.id,
              width: 2000,
              height: 1100,
            },
            enlargedImagePosition: "over",
          }}
        />
      </div>
    );
  });

  return (
    <div
      className={
        "live-monitoring col-xl mb-xl-0" +
        (mode === "light" ? " live-monitoring-light" : " live-monitoring-dark")
      }
    >
      <div className="title mb-3">
        <h6>Real-Time Monitoring</h6>
        <label>
          Monitoring deviasi yang terdeteksi secara real-time melalui CCTV
          Mining Eyes
        </label>
      </div>
      <div className="content d-grid">
        {currentCctv?.id !== 0 ? (
          <div className="live-cctv d-flex justify-content-center align-items-center rounded-top">
            {realTimeCctvLoading === true ? (
              <div className="d-flex justify-content-center my-3">
                <div className="spinner-border">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : realTimeCctvError === false ? (
              <ReactImageMagnify
                className="mw-100"
                {...{
                  smallImage: {
                    alt: "live_monitoring",
                    isFluidWidth: true,
                    src: realTimeCctv ? realTimeCctv : "",
                  },
                  largeImage: {
                    src: realTimeCctv ? realTimeCctv : "",
                    width: 2000,
                    height: 1100,
                  },
                  enlargedImagePosition: "over",
                }}
              />
            ) : (
              <img
                className="my-2"
                src={require("../assets/error.webp")}
                alt=""
              />
            )}
          </div>
        ) : (
          ""
        )}
        {currentCctv?.id !== 0 ? (
          <div className="cam-navigation row mb-3 m-0 px-0 py-1 align-items-center">
            <div className="col p-0 d-flex gap-1">
              <div>
                <button
                  className="border-0 d-flex align-items-center gap-1 d-none"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#perimeterModal"
                >
                  <Icon className="icon" icon="uil:setting" />
                  <label>Buat Batas Perimeter Dumping</label>
                </button>
                <div
                  className="modal modal-lg fade"
                  id="perimeterModal"
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Atur Perimeter Area
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body overflow-auto">
                        <label className="mb-3">
                          Cara kerja: Buat batas perimeter untuk menentukan area
                          tidak aman pada HD yang melebihi batas dumping.
                        </label>
                        <div className="d-flex justify-content-center">
                          <div className="position-relative">
                            <img
                              src={realTimeCctv}
                              alt=""
                              onClick={annotationAdder}
                            />
                            {annotationDotArray}
                          </div>
                        </div>
                        <div className="row mt-2 d-none">
                          <div className="col-6">
                            <label>Area Tidak Aman</label>
                            <div className="d-flex gap-2">
                              {perimeterSecureAreaArray}
                            </div>
                          </div>
                          <div className="col">
                            <label>Objek</label>
                            <div className="d-flex gap-2">
                              {perimeterObjectArray}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <div className="row w-100 d-flex align-items-center">
                          <div className="col p-0">
                            <button
                              className="border-0"
                              onClick={() => {
                                setAnnotation([]);
                              }}
                            >
                              Reset anotasi
                            </button>
                          </div>
                          <div className="col d-flex justify-content-end p-0">
                            <button
                              type="button"
                              className="submit-button border-0 rounded-2 px-3 py-2"
                              data-bs-dismiss="modal"
                              onClick={perimeterAreaHandler}
                            >
                              Simpan
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="border-0 d-flex align-items-center gap-1 d-none"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#distanceModal"
                >
                  <Icon className="icon" icon="ri:pin-distance-line" />
                  <label>Atur Distance HD</label>
                </button>
                <div
                  className="modal fade"
                  id="distanceModal"
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Tentukan Jarak Antar HD
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => {
                            setDistanceHd(distanceHdDefault);
                          }}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="d-flex align-items-center gap-2">
                          <label className="text-nowrap">Jarak antar HD:</label>
                          <input
                            className="form-control"
                            type="number"
                            value={distanceHd ? distanceHd : ""}
                            placeholder="Masukkan Jarak Antar HD"
                            onChange={(e) => {
                              setDistanceHd(e.target.value);
                            }}
                          />
                          <label className="text-nowrap">X Panjang unit</label>
                        </div>
                      </div>
                      <div className="modal-footer d-flex justify-content-end">
                        <button
                          type="button"
                          className="submit-button border-0 rounded-2 px-3 py-2"
                          data-bs-dismiss="modal"
                          onClick={distanceHdHandler}
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-2 p-0 d-flex justify-content-end gap-1">
              <button
                className={
                  "border-0" + (controlLoading === true ? " d-none" : "")
                }
                title="reload cctv"
                onClick={() => {
                  controlHandler("reload");
                }}
              >
                <Icon className="icon" icon="charm:refresh" />
              </button>
              <button
                className="border-0"
                title="full-screen"
                onClick={() => {
                  fullscreenHandler("realtime-cctv");
                }}
              >
                <Icon className="icon" icon="ic:outline-zoom-out-map" />
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="cctv-info">
          {currentCctv.id !== 0 ? (
            <h6>{currentCctv?.name + " - " + currentCctv?.location}</h6>
          ) : (
            <label className="d-flex justify-content-center">
              Pilih CCTV pada List CCTV untuk melihat Real-Time CCTV
            </label>
          )}
        </div>
      </div>
      <div className="visually-hidden">
        <div id="realtime-cctv">
          <img className="w-100" src={realTimeCctv} alt="" />
        </div>
      </div>
      <div className="visually-hidden">
        <div className="row overflow-auto position-relative" id="all-cctv">
          {allCctvArray}
          <div className="zoom-free position-absolute d-flex justify-content-center">
            <label className="rounded-2 px-3 py-1">Zoom Free Box</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
