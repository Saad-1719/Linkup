import React, { useContext, useState } from "react";
import assests from "../../assets/assets";
import { signup, login,resetPass } from "../../config/firebase";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loadUserData } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (currentState === "Sign up") {
        if (password.length < 6) {
          toast.error("Password should be at least 6 characters");
          setIsLoading(false);
          return;
        }
        await signup(userName, email, password);
      } else {
        const user = await login(email, password);
        if (user) {
          await loadUserData(user.uid);
        }
      }
    } catch (error) {
      console.error("Login/Signup error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-evenly bg-[url('./background.png')] bg-cover bg-no-repeat">
      <img src={assests.logo_big} alt="" className="max-w-64" />
      <form onSubmit={onSubmitHandler} className="bg-white px-5 py-8 flex flex-col space-y-5 border rounded-lg min-w-[400px]">
        <h2 className="text-3xl font-bold text-center">{currentState}</h2>
        {currentState === "Sign up" && (
          <input
            type="text"
            placeholder="username"
            required
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            className="px-2 py-3 border-2 border-solid border-gray-200 rounded-md outline-blue-500"
            disabled={isLoading}
          />
        )}
        <input
          type="email"
          placeholder="Email address"
          className="px-2 py-3 border-2 border-solid rounded-md border-gray-200 outline-blue-500"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="password"
          className="px-2 py-3 border-2 border-solid rounded-md border-gray-200 outline-blue-500"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`px-2 py-3 rounded-md text-lg font-bold bg-blue-500 hover:bg-blue-300 transition-all text-white ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Loading...
            </div>
          ) : currentState === "Sign up" ? (
            "Create Account"
          ) : (
            "Login"
          )}
        </button>
        {currentState === "Sign up" ? (
          <div>
            <p>
              Already have an account?{" "}
              <span
                className={`text-blue-500 underline cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}
                onClick={() => !isLoading && setCurrentState("Login")}
              >
                Click Here
              </span>
            </p>
          </div>
        ) : (
          <div>
            <p>
              Create Account{" "}
              <span
                className={`text-blue-500 underline cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}
                onClick={() => !isLoading && setCurrentState("Sign up")}
              >
                Click Here
              </span>
            </p>
          </div>
			  )}
			  {currentState === 'Login' ? <p>
              Forgot Password? {" "}
              <span
                className={`text-blue-500 underline cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}
                onClick={() => !isLoading && resetPass(email)}
              >
                Reset Here
              </span>
            </p> :null}
      </form>
    </div>
  );
};

export default Login;

