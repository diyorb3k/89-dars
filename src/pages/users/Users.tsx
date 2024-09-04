import React, { useState, useEffect } from "react";
import axios from "axios";

// Foydalanuvchi interfeysi
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  additionalInfo?: string; // Qo'shimcha ma'lumot
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Foydalanuvchilar ro'yxati
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    additionalInfo: "",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null); // Tahrirlanayotgan foydalanuvchi
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal holati
  const [searchTerm, setSearchTerm] = useState(""); // Qidiruv so'zini saqlash
  const [language, setLanguage] = useState<string>("uzb"); // Tanlangan til

  // Ma'lumotlarni olish
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>("http://localhost:3000/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Foydalanuvchilarni olishda xato:", error);
      }
    };

    fetchUsers();
  }, []);

  // Yangi foydalanuvchi qo'shish
  const handleAddUser = async () => {
    try {
      const response = await axios.post("http://localhost:3000/users", newUser);
      setUsers((prevUsers) => [...prevUsers, response.data]);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        phone: "",
        additionalInfo: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Yangi foydalanuvchini qo'shishda xato:", error);
    }
  };

  // Foydalanuvchini tahrirlash
  const handleEditUser = async () => {
    if (editingUser) {
      try {
        const response = await axios.put(
          `http://localhost:3000/users/${editingUser.id}`,
          editingUser
        );
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUser.id ? response.data : user
          )
        );
        setEditingUser(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Foydalanuvchini tahrirlashda xato:", error);
      }
    }
  };

  // Foydalanuvchini o'chirish
  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Foydalanuvchini o'chirishda xato:", error);
    }
  };

  // Kirish maydonini yangilash
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  // Foydalanuvchilarni qidirish
  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">{language === "uzb" ? "Foydalanuvchilar" : "Users"}</h1>
      
      {/* Til tanlash select elementi */}
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)} 
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        <option value="uzb">O'zbekcha</option>
        <option value="eng">English</option>
      </select>
      
      <input
        type="text"
        placeholder={language === "uzb" ? "Qidiruv..." : "Search..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      <button
        onClick={() => {
          setIsModalOpen(true);
          setEditingUser(null);
        }}
        className="bg-green-500 text-white px-3 py-2 rounded mb-4 hover:bg-green-600 transition"
      >
        {language === "uzb" ? "Foydalanuvchi Qo'shish" : "Add User"}
      </button>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">{language === "uzb" ? "Ism" : "First Name"}</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">{language === "uzb" ? "Familiya" : "Last Name"}</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">{language === "uzb" ? "Email" : "Email"}</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">{language === "uzb" ? "Foydalanuvchi Nomi" : "Username"}</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">{language === "uzb" ? "Parol" : "Password"}</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">{language === "uzb" ? "Telefon" : "Phone"}</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">{language === "uzb" ? "Bunga ham" : "Additional Info"}</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">{language === "uzb" ? "Amallar" : "Actions"}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-t border-gray-300">
              <td className="py-2 px-4">{user.firstName}</td>
              <td className="py-2 px-4">{user.lastName}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.username}</td>
              <td className="py-2 px-4">{user.password}</td>
              <td className="py-2 px-4">{user.phone}</td>
              <td className="py-2 px-4">{user.additionalInfo || (language === "uzb" ? "Yoq" : "No")}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setEditingUser(user);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  {language === "uzb" ? "Tahrir" : "Edit"}
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  {language === "uzb" ? "O'chirish" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">{editingUser ? (language === "uzb" ? "Foydalanuvchini Tahrirlash" : "Edit User") : (language === "uzb" ? "Foydalanuvchi Qo'shish" : "Add User")}</h2>
            <input
              type="text"
              name="firstName"
              placeholder={language === "uzb" ? "Ism" : "First Name"}
              value={editingUser ? editingUser.firstName : newUser.firstName}
              onChange={handleInputChange}
              className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              name="lastName"
              placeholder={language === "uzb" ? "Familiya" : "Last Name"}
              value={editingUser ? editingUser.lastName : newUser.lastName}
              onChange={handleInputChange}
              className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="email"
              name="email"
              placeholder={language === "uzb" ? "Email" : "Email"}
              value={editingUser ? editingUser.email : newUser.email}
              onChange={handleInputChange}
              className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              name="username"
              placeholder={language === "uzb" ? "Foydalanuvchi Nomi" : "Username"}
              value={editingUser ? editingUser.username : newUser.username}
              onChange={handleInputChange}
              className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="password"
              name="password"
              placeholder={language === "uzb" ? "Parol" : "Password"}
              value={editingUser ? editingUser.password : newUser.password}
              onChange={handleInputChange}
              className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder={language === "uzb" ? "Telefon" : "Phone"}
              value={editingUser ? editingUser.phone : newUser.phone}
              onChange={handleInputChange}
              className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              name="additionalInfo"
              placeholder={language === "uzb" ? "Qo'shimcha Ma'lumot" : "Additional Info"}
              value={editingUser ? editingUser.additionalInfo : newUser.additionalInfo}
              onChange={handleInputChange}
              className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            <button
              onClick={editingUser ? handleEditUser : handleAddUser}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
            >
              {editingUser ? (language === "uzb" ? "Saqlash" : "Save") : (language === "uzb" ? "Qo'shish" : "Add")}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition ml-2"
            >
              {language === "uzb" ? "Yopish" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
