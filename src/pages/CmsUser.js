import "../styles/cms.scss";
import { useState } from "react";
import customAxios from "../utils/customAxios";
import { useSelector, useDispatch } from "react-redux";
import { getUserList } from "../redux/userSlice";
import { ReactComponent as MingcuteCheckFill } from "../assets/iconify/mingcute--check-fill.svg";
import { ReactComponent as EpCloseBold } from "../assets/iconify/ep--close-bold.svg";
import { ReactComponent as MaterialSymbolsEdit } from "../assets/iconify/material-symbols--edit.svg";
import { ReactComponent as MingcuteDeleteFill } from "../assets/iconify/mingcute--delete-fill.svg";
import { ReactComponent as EntypoExport } from "../assets/iconify/entypo--export.svg";
import { ReactComponent as ClarityServerSolid } from "../assets/iconify/clarity--server-solid.svg";
import { ReactComponent as AkarIconsClock } from "../assets/iconify/akar-icons--clock.svg";

const CmsUser = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.general.mode);
  const userList = useSelector((state) => state.user.list);

  const [action, setAction] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [formMessage, setFormMessage] = useState("");
  const userRole = [
    { id: 1, name: "Super Admin", value: "super_admin" },
    { id: 2, name: "Admin", value: "admin" },
    { id: 3, name: "User", value: "user" },
  ];

  const [addDataForm, setAddDataForm] = useState({
    id: userList.length !== 0 ? userList[userList.length - 1]?.id + 1 : 1,
    full_name: "",
    username: "",
    password: "",
    role: "",
    company: "",
  });

  const [editDataForm, setEditDataForm] = useState({});

  const userRoleArr = userRole.map((role) => {
    return (
      <option value={role.value} key={role.id}>
        {role.name}
      </option>
    );
  });

  const addUser = (addForm) => {
    setFormMessage("");
    if (
      addForm.full_name !== "" &&
      addForm.username !== "" &&
      addForm.password !== "" &&
      addForm.role !== ""
    ) {
      customAxios({
        method: "POST",
        url: "/users/create",
        data: addForm,
      })
        .then((res) => {
          dispatch(getUserList());
          setAddDataForm({
            id:
              userList.length !== 0 ? userList[userList.length - 1]?.id + 1 : 1,
            full_name: "",
            username: "",
            password: "",
            role: "",
            company: "",
          });
          setEditDataForm({});
        })
        .catch((err) => {
          if (err.message.includes("401")) {
            setFormMessage("*anda tidak memiliki akses");
            setAddDataForm({
              id:
                userList.length !== 0
                  ? userList[userList.length - 1]?.id + 1
                  : 1,
              full_name: "",
              username: "",
              password: "",
              role: "",
              company: "",
            });
          }
          console.log(err);
        });
      setFormMessage("");
    } else {
      setFormMessage("*form tidak boleh kosong");
    }
  };

  const editUser = (editForm) => {
    setFormMessage("");
    customAxios({
      method: "PUT",
      url: "/users/" + editForm.id,
      data: editForm,
    })
      .then((res) => {
        dispatch(getUserList());
      })
      .catch((err) => {
        if (err.message.includes("401")) {
          setFormMessage("*anda tidak memiliki akses");
          setCurrentUser();
          setAction();
          setEditDataForm({});
        }
        console.log(err);
      });
  };

  const deleteUser = (userId) => {
    setFormMessage("");
    customAxios({
      method: "DELETE",
      url: "/users/" + userId,
    })
      .then((res) => {
        dispatch(getUserList());
      })
      .catch((err) => {
        if (err.message.includes("401")) {
          setFormMessage("*anda tidak memiliki akses");
        }
        console.log(err);
      });
  };

  const userArr = userList.map((user, index) => {
    return (
      <tr className="align-middle" key={user.id}>
        <th className="text-center" scope="row">
          {user.id}
        </th>
        <td className="text-center">
          <input
            className={
              "form-control w-100" +
              (currentUser === user.id ? "" : " disabled")
            }
            type="text"
            value={
              editDataForm.id !== user.id ? user.full_name : editDataForm.name
            }
            placeholder="Masukkan nama"
            disabled={currentUser === user.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, full_name: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <input
            className={
              "form-control w-100" +
              (currentUser === user.id ? "" : " disabled")
            }
            type="text"
            value={
              editDataForm.id !== user.id
                ? user.username
                : editDataForm.username
            }
            placeholder="Masukkan username"
            disabled={currentUser === user.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, username: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <input
            className={
              "form-control w-100" +
              (currentUser === user.id ? "" : " disabled")
            }
            type="text"
            defaultValue="-"
            value={
              editDataForm.id !== user.id
                ? user.password
                : editDataForm.password
            }
            placeholder="Masukkan password"
            disabled={currentUser === user.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, password: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <select
            className={
              "form-control form-select" +
              (currentUser === user.id ? "" : " disabled")
            }
            aria-label="Default select example"
            value={editDataForm.id !== user.id ? user.role : editDataForm.role}
            disabled={currentUser === user.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, role: e.target.value });
            }}
          >
            {userRoleArr}
          </select>
        </td>
        <td className="text-center">
          <input
            className={
              "form-control w-100" +
              (currentUser === user.id ? "" : " disabled")
            }
            type="text"
            value={
              editDataForm.id !== user.id ? user.company : editDataForm.company
            }
            placeholder="Masukkan instansi"
            disabled={currentUser === user.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, company: e.target.value });
            }}
          />
        </td>
        {currentUser === user.id ? (
          <td className="text-center">
            <button
              className="border-0 me-2"
              onClick={() => {
                action === "edit"
                  ? editUser(editDataForm, index)
                  : deleteUser(user.id);
                setCurrentUser();
                setAction();
              }}
            >
              <MingcuteCheckFill className="icon icon-green" />
            </button>
            <button
              className="border-0"
              onClick={() => {
                formMessage === ""
                  ? setFormMessage(formMessage)
                  : setFormMessage("");
                setCurrentUser();
                setAction();
                setEditDataForm({});
              }}
            >
              <EpCloseBold className="icon icon-red" />
            </button>
          </td>
        ) : (
          <td className="text-center">
            <button
              className="border-0 me-2"
              onClick={() => {
                setCurrentUser(user.id);
                setAction("edit");
                setEditDataForm(user);
              }}
            >
              <MaterialSymbolsEdit className="icon icon-green" />
            </button>
            <button
              className="border-0"
              onClick={() => {
                setCurrentUser(user.id);
                setAction("delete");
              }}
            >
              <MingcuteDeleteFill className="icon icon-red" />
            </button>
          </td>
        )}
      </tr>
    );
  });

  return (
    <div
      className={
        "cms d-flex flex-column gap-3" +
        (mode === "light" ? " cms-light" : " cms-dark")
      }
    >
      <div className="row m-0">
        <div className="col p-0">
          <h1>CMS - Pengguna</h1>
        </div>
        <div className="col p-0 d-flex justify-content-end">
          <button className="border-0 rounded-2 px-3 py-2 d-flex align-items-center gap-1">
            <EntypoExport className="icon" />
            <label>Export</label>
          </button>
        </div>
      </div>
      <div className="d-grid gap-3 overflow-auto pb-2">
        <div className="row m-0 gap-3 align-items-end">
          <div className="col-3 p-0">
            <div className="info rounded-2 d-grid gap-3 px-3 py-2">
              <label className="info-title">
                Total pengguna pada <br /> BMO 2 Blok 8
              </label>
              <div className="info-content d-flex justify-content-center align-items-end gap-1">
                <label>{userList.length}</label>
                <label>pengguna</label>
              </div>
              <div className="info-other d-flex justify-content-end gap-1">
                <ClarityServerSolid className="icon" />
                <label>10.10.10.66</label>
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
                <AkarIconsClock className="icon" />
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
        <div>
          <div className="cms-table-title row m-0 mb-2">
            <div className="col p-0">
              <label>Daftar Pengguna</label>
            </div>
            <div className="col p-0 d-flex justify-content-end">
              <label>{formMessage}</label>
            </div>
          </div>
          <div className="cms-table overflow-auto">
            <table className="table">
              <thead>
                <tr className="text-center">
                  <th className="table-header" scope="col">
                    ID
                  </th>
                  <th className="table-header" scope="col">
                    Nama Lengkap
                  </th>
                  <th className="table-header" scope="col">
                    Username
                  </th>
                  <th className="table-header" scope="col">
                    Password
                  </th>
                  <th className="table-header" scope="col">
                    Role
                  </th>
                  <th className="table-header" scope="col">
                    Instansi
                  </th>
                  <th className="table-header" scope="col">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                <tr className="align-middle">
                  <th className="text-center" scope="row">
                    *
                  </th>
                  <td className="text-center">
                    <input
                      className={
                        "form-control w-100" + (!currentUser ? "" : " disabled")
                      }
                      type="text"
                      value={addDataForm.full_name}
                      placeholder="Masukkan nama lengkap"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setAddDataForm({
                          ...addDataForm,
                          full_name: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className={
                        "form-control w-100" + (!currentUser ? "" : " disabled")
                      }
                      type="text"
                      value={addDataForm.username}
                      placeholder="Masukkan username"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setAddDataForm({
                          ...addDataForm,
                          username: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className={
                        "form-control w-100" + (!currentUser ? "" : " disabled")
                      }
                      type="text"
                      value={addDataForm.password}
                      placeholder="Masukkan username"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setAddDataForm({
                          ...addDataForm,
                          password: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <select
                      className={
                        "form-control form-select" +
                        (!currentUser ? "" : " disabled")
                      }
                      aria-label="Default select example"
                      value={addDataForm.role}
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setAddDataForm({
                          ...addDataForm,
                          role: e.target.value,
                        });
                      }}
                    >
                      {userRoleArr}
                    </select>
                  </td>
                  <td className="text-center">
                    <input
                      className={
                        "form-control w-100" + (!currentUser ? "" : " disabled")
                      }
                      type="text"
                      value={addDataForm.company}
                      placeholder="Masukkan instansi"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setAddDataForm({
                          ...addDataForm,
                          company: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <button
                      className="border-0"
                      onClick={() => {
                        addUser(addDataForm);
                      }}
                    >
                      <label className="button-green">Tambah Data</label>
                    </button>
                  </td>
                </tr>
                {userArr}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsUser;
