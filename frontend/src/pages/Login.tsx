import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [signUp, isSignUp] = useState(false);

  function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();

      try {
        const res = await fetch("http://localhost:4000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }), // send user input
        });

        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
          alert(data.error || "Sign up failed");
          return;
        }

        alert("Sign up successful!");
        // Switch to sign-in form
        isSignUp(false);
      } catch (err) {
        console.error(err);
        alert("Something went wrong!");
      }
    }

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <input
              className="mt-1 p-2 block w-full border border-gray-200 rounded"
              type="text"
              name="name"
              placeholder="Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="block mb-2">
            <input
              className="mt-1 p-2 block w-full border border-gray-200 rounded"
              type="email"
              name="email"
              placeholder="Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block mb-4">
            <input
              className="mt-1 p-2 block w-full border border-gray-200 rounded"
              type="password"
              name="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded block mx-auto"
            type="submit"
          >
            Sign Up
          </button>
        </form>

        <div className="block mx-auto text-xs mt-4 text-center text-gray-500 underline hover:text-blue-600 cursor-pointer">
          <p onClick={() => isSignUp(!signUp)}>
            Already have an account? Sign in.
          </p>
        </div>
      </div>
    );
  }

  function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();

      try {
        const res = await fetch("http://localhost:4000/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }), // send user input
          credentials: "include"
        });

        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
          alert(data.error || "Sign in failed");
          return;
        }

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        alert("Something went wrong!");
      }
    }

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <input
              className="mt-1 p-2 block w-full border border-gray-200 rounded"
              type="email"
              name="email"
              placeholder="Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block mb-4">
            <input
              className="mt-1 p-2 block w-full border border-gray-200 rounded"
              type="password"
              name="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded block mx-auto"
            type="submit"
          >
            Sign In
          </button>
        </form>

        <div className="block mx-auto text-xs mt-4 text-center text-gray-500 underline hover:text-blue-600 cursor-pointer">
          <p onClick={() => isSignUp(!signUp)}>
            Dont have an account? Sign up.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 shadow rounded bg-white height-full w-1/2">
      {signUp ? <SignUp /> : <SignIn />}
    </div>
  );
}
