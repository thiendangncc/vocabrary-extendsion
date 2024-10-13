import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  UserCredential,
} from "firebase/auth/web-extension";

import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [, user, loading, error] = useSignInWithGoogle(auth);
  const [user, setUser] = useState<UserCredential>();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle email/password login logic here
    createUserWithEmailAndPassword(auth, email, password).then((u) => {
      setUser(u);
      navigate("/login");
    });
  };

  if (user) {
    navigate("/");
    return;
    // return <div>Logged in as {user.user.email}</div>;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="p-8 w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
