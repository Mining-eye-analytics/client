import "../styles/not_found.scss";
import { useSelector } from "react-redux";

const NotFound = () => {
  const mode = useSelector((state) => state.general.mode);

  return (
    <div
      className={
        "not-found" +
        (mode === "light" ? " not-found-light" : " not-found-dark")
      }
    >
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="d-grid gap-5">
          <div className="d-flex justify-content-center">
            <img src={require("../assets/error.webp")} alt="" />
          </div>
          <div className="text-center">
            <h3>Halaman tidak ditemukan</h3>
            <label>
              Sepertinya anda mengakses halaman yang salah. Coba untuk kembali
              ke halaman sebelumnya atau laporkan error pada tim developer!
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
