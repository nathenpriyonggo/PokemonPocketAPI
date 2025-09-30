import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const res = await fetch("http://localhost:4000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // include cookies
      });
      if (res.ok) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  }

  return (
    <nav className="w-full h-16 bg-white shadow flex items-center px-4">
      <h1 className="text-xl font-bold flex-grow">My App</h1>
      <button
        className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
}
