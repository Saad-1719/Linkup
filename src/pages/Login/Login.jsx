import React, { useState } from "react";
import assests from "../../assets/assets";
import { signup,login } from "../../config/firebase";
import { toast } from "react-toastify";


const Login = () => {
	const [currentState, setCurrentState] = useState("Login");
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	
	const onSubmitHandler = async (event) =>
	{
		event.preventDefault(); // Corrected from preventDefaut()

        // try {
            if (currentState === "Sign up") {
                // Add validation
                if (password.length < 6) {
                    toast.error("Password should be at least 6 characters");
                    return;
                }

                await signup(userName, email, password);
                //toast.success("Account created successfully!");
                // Optional: Reset form or redirect
			}
			else {
				login(email, password);
				//toast.success("Login Successfull !!!");
			}
        // } catch (error) {
        //     console.error("Signup error:", error);
        //     toast.error("Failed to create account");
        // }
	}
	
	return (
		<div className="min-h-screen flex items-center justify-evenly bg-[url('./background.png')] bg-cover bg-no-repeat">
			<img src={assests.logo_big} alt="" className="max-w-64" />
			<form onSubmit={onSubmitHandler} className="bg-white px-5 py-8 flex flex-col space-y-5 border rounded-lg">
				<h2 className="text-3xl font-bold text-center">{currentState}</h2>
				{currentState === "Sign up" ? (
					<input
						type="text"
						placeholder="username"
						required
						onChange={(e) => setUserName(e.target.value)}
						value={userName}
						className="px-2 py-3 border-2 border-solid border-gray-200 rounded-md  outline-blue-500 "
					/>
				) : (
					""
				)}

				<input
					type="email"
					placeholder="Email address"
					className="px-2 py-3 border-2 border-solid rounded-md border-gray-200  outline-blue-500 "
					required
					onChange={(e) => setEmail(e.target.value)}
						value={email}
				/>
				<input
					type="password"
					placeholder="password"
					className="px-2 py-3 border-2 border-solid rounded-md border-gray-200  outline-blue-500 "
					required
					onChange={(e) => setPassword(e.target.value)}
					value={password}
				/>
				<button
					type="submit"
					className="px-2 py-3 rounded-md text-lg font-bold  bg-blue-500 hover:bg-blue-300 transition-all text-white"
				>
					{currentState === "Sign up" ? "Create Account" : "Login"}
				</button>
				<div className="flex  space-x-4 items-center justify-center">
					<input type="checkbox" name="" id="" className="w-4 h-4" />
					<p>Agree to the terms of use and privacy policy.</p>
				</div>
				{currentState === "Sign up" ? (
					<div>
						<p>
							Already have an account?{" "}
							<span
								className="text-blue-500 underline cursor-pointer"
								onClick={() => setCurrentState("Login")}
							>
								{" "}
								click here{" "}
							</span>
						</p>
					</div>
				) : (
					<div>
						<p>
							Create Account{" "}
							<span
								className="text-blue-500 underline cursor-pointer"
								onClick={() => setCurrentState("Sign up")}
							>
								{" "}
								click here{" "}
							</span>
						</p>
					</div>
				)}
			</form>
		</div>
	);
};

export default Login;
