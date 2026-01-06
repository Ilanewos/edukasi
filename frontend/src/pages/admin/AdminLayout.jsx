import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow flex overflow-hidden">
          {/* SIDEBAR */}
          <aside className="w-64 border-r p-4">
            <h2 className="font-bold text-lg mb-4">Admin BINCLASS</h2>

            <nav className="space-y-2">
              <NavLink to="/admin/articles" className={linkClass}>
                Artikel
              </NavLink>
              <NavLink to="/admin/quizzes" className={linkClass}>
                Kuis
              </NavLink>
              <NavLink to="/admin/ml" className={linkClass}>
                ML Scan
              </NavLink>
            </nav>

            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-red-600 text-white py-2 rounded"
            >
              Logout
            </button>
          </aside>

          {/* KONTEN */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
