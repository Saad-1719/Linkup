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
          setIsLoading(false);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-evenly bg-[url('./background.jpg')] bg-cover bg-no-repeat">
      <img src={assests.logo_big} alt="" className="max-w-64" />
      <form 
  onSubmit={onSubmitHandler} 
  className="bg-white bg-opacity-20 backdrop-blur-lg px-5 py-8 flex flex-col space-y-5 border border-white/30 rounded-lg min-w-[400px] shadow-lg"
>
  <h2 className="text-3xl font-bold text-center text-black">{currentState}</h2>
  {currentState === "Sign up" && (
    <input
      type="text"
      placeholder="Username"
      required
      onChange={(e) => setUserName(e.target.value)}
      value={userName}
      className="px-2 py-3 border border-solid rounded-md border-white/40 outline-blue-300 bg-white bg-opacity-10 backdrop-blur-md text-black placeholder-black/70"
      disabled={isLoading}
    />
  )}
  <input
    type="email"
    placeholder="Email address"
    className="px-2 py-3 border border-solid rounded-md border-white/40 outline-blue-300 bg-white bg-opacity-10 backdrop-blur-md text-black placeholder-black/70"
    required
    onChange={(e) => setEmail(e.target.value)}
    value={email}
    disabled={isLoading}
  />
  <input
    type="password"
    placeholder="Password"
    className="px-2 py-3 border border-solid rounded-md border-white/40 outline-blue-300 bg-white bg-opacity-10 backdrop-blur-md text-black placeholder-black/70"
    required
    onChange={(e) => setPassword(e.target.value)}
    value={password}
    disabled={isLoading}
  />
  <button
    type="submit"
    className={`px-2 py-3 rounded-md text-lg font-bold bg-white bg-opacity-10 backdrop-blur-md hover:bg-[#26a0da] transition-all text-white hover:text-black  border hover:border-none ${
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
      <p className="text-black">
        Already have an account?{" "}
        <span
          className={`text-cyan-50 underline cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}
          onClick={() => !isLoading && setCurrentState("Login")}
        >
          Click Here
        </span>
      </p>
    </div>
  ) : (
    <div>
      <p className="text-black">
        Create Account{" "}
        <span
          className={`text-cyan-50 underline cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}
          onClick={() => !isLoading && setCurrentState("Sign up")}
        >
          Click Here
        </span>
      </p>
    </div>
  )}
  {currentState === 'Login' ? (
    <p className="text-black">
      Forgot Password? {" "}
      <span
        className={`text-cyan-50 underline cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}
        onClick={() => !isLoading && resetPass(email)}
      >
        Reset Here
      </span>
    </p>
  ) : null}
</form>


    </div>
  );
};

export default Login;

