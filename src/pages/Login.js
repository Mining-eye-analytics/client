// importing style
import "../styles/login.scss";

// importing libraries
import { useState, useEffect } from "react";
import customAxios from "../utils/customAxios";
import { useSelector } from "react-redux";
import { ReactComponent as ClarityEyeLine } from "../assets/iconify/clarity--eye-line.svg";
import { ReactComponent as ClarityEyeHideLine } from "../assets/iconify/clarity--eye-hide-line.svg";

const Login = () => {
  // defining state variables with redux
  const mode = useSelector((state) => state.general.mode);

  // defining state variables with react hooks
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  // function to handle login when the button is clicked or enter is pressed
  const loginHandler = (key) => {
    if (key === "Enter") {
      setLoginMessage("");
      if (username === "" || password === "") {
        setLoginMessage("username dan password tidak boleh kosong");
      } else {
        setLoginLoading(true);
        customAxios({
          method: "POST",
          url: "/users/login",
          data: {
            username: username,
            password: password,
          },
        })
          .then((res) => {
            setLoginStatus(res.data.meta.status);
            localStorage.setItem(
              "authorization",
              JSON.stringify({
                user_id: res.data.data.id,
                user_name: res.data.data.full_name,
                user_role: res.data.data.role,
                bearer_token: res.data.data.token,
              })
            );
          })
          .catch((err) => {
            setLoginStatus("failed");
            setLoginMessage("username atau password salah");
          })
          .finally(() => {
            setLoginLoading(false);
          });
      }
    }
  };

  // react hooks to handle page redirection if login is successful
  useEffect(() => {
    if (loginStatus === "success") {
      if (window.location.href.includes("login")) {
        window.location.href = "/validasi-notifikasi";
      } else {
        window.location.reload();
      }
    }
  }, [loginStatus]);

  return (
    <div
      className={
        "login d-flex justify-content-center align-items-center" +
        (mode === "light" ? " login-light" : " login-dark")
      }
    >
      <div className="form-container rounded-4">
        <div className="row gap-0 m-0">
          <div className="col d-flex justify-content-center align-items-center pt-3 p-0">
            <div className="login-container">
              <img
                className="mb-5"
                src={require("../assets/logo" +
                  (mode === "light" ? "" : "-dark") +
                  ".webp")}
                alt=""
              />
              <h3>Log in</h3>
              <p>
                Selamat Datang kembali! Silahkan isi beberapa detail di bawah
                ini.
              </p>
              <form className="my-4 d-grid gap-2">
                <div className="d-grid gap-1">
                  <label>Username/ SID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan Username atau SID"
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                      loginHandler(e.key);
                    }}
                  />
                </div>
                <div className="d-grid gap-1">
                  <label>Password</label>
                  <div className="d-flex align-items-center">
                    <input
                      type={passwordVisibility === false ? "password" : "text"}
                      className="form-control"
                      placeholder="Masukkan Password"
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        loginHandler(e.key);
                      }}
                    />
                    <span
                      className="password-visibility"
                      title="tampilkan/sembunyikan password"
                      onClick={() => {
                        setPasswordVisibility(!passwordVisibility);
                      }}
                    >
                      {passwordVisibility === false ? (
                        <ClarityEyeLine />
                      ) : (
                        <ClarityEyeHideLine />
                      )}
                    </span>
                  </div>
                </div>
              </form>
              {loginLoading === false ? (
                <div className="d-grid">
                  <button
                    className="border-0 rounded-2 px-3 py-2"
                    onClick={() => {
                      loginHandler("Enter");
                    }}
                  >
                    Masuk
                  </button>
                </div>
              ) : (
                <div className="d-flex justify-content-center my-3">
                  <div className="spinner-border">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <label className="login-message mt-2">
                {loginMessage !== "" ? "*" + loginMessage : ""}
              </label>
            </div>
          </div>
          <div className="col-6 d-flex justify-content-center align-items-center d-none d-xl-inline p-0">
            <div
              id="carouselExampleDark"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselExampleDark"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleDark"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleDark"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active" data-bs-interval="3000">
                  <img
                    src={require("../assets/login-slider/slider_live_monitoring" +
                      (mode === "light" ? "" : "-dark") +
                      ".webp")}
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
                <div className="carousel-item" data-bs-interval="3000">
                  <img
                    src={require("../assets/login-slider/slider_validasi_deviasi" +
                      (mode === "light" ? "" : "-dark") +
                      ".webp")}
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
                <div className="carousel-item" data-bs-interval="3000">
                  <img
                    src={require("../assets/login-slider/slider_data_tervalidasi" +
                      (mode === "light" ? "" : "-dark") +
                      ".webp")}
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleDark"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleDark"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
