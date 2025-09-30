import { useState, useEffect } from 'react';

import MainLayout from "../layouts/MainLayout";
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const navigate = useNavigate();



  // Check login
  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch("http://localhost:4000/me", {
          credentials: "include",
        });

        if (!res.ok) {
          // Not logged in
          navigate("/");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    }

    checkLogin();
  }, []);


  return (
    <MainLayout>
      <h1 className="text-3xl font-bold">Welcome to the Dashboard!</h1>

      <p>{user?.email}</p>
      <p>{user?.name}</p>
      <p>{user?.role}</p>
    </MainLayout>
  );
}
