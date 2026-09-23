import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const Login = () => {
	const navigate = useNavigate();
	const { user, setUser } = useAuth(); // Access the setUser function from AuthContext
	const [form, setForm] = useState({
		email: "",
		password: ""
	});
	const [loader, setLoader] = useState(false);

	const handleChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoader(true);
		try {
			const res = await api.post('/customers/login', form);
			setUser(res.data.customer); // Update the user state in AuthContext
			setLoader(false);

			navigate('/home'); // Redirect to home page after successful login
			console.log('User logged in !');
		} catch (error) {
			setLoader(false);
			console.log(error.message);
		}
	};

	return (
		<div className="relative min-h-screen bg-slate-50/60 flex items-center justify-center p-4 overflow-hidden selection:bg-violet-500 selection:text-white">
			{/* Ambient Background Light Elements */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[540px] h-[340px] bg-gradient-to-tr from-violet-200/50 via-purple-100/40 to-indigo-100/30 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-28 -right-20 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl"></div>
				<div className="absolute top-1/3 -left-24 w-72 h-72 bg-violet-100/40 rounded-full blur-3xl"></div>
			</div>

			{/* Main Card */}
			<div className="relative w-full max-w-[390px] bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_16px_40px_-12px_rgba(99,102,241,0.12)] border border-slate-100/80 ring-1 ring-slate-900/[0.03] p-6 sm:p-7">

				{/* Logo & Heading */}
				<div className="text-center mb-5">
					<div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 ring-4 ring-violet-50 mb-3 transition-transform duration-300 hover:scale-105">
						<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
						</svg>
					</div>
					<h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
					<p className="text-xs text-slate-500 mt-1">Please log in to your account.</p>
				</div>

				{/* Pill Tabs */}
				<div className="flex bg-slate-100/80 p-1 rounded-xl mb-5 border border-slate-200/50">
					<Link to="/register" className="flex-1 py-1.5 text-center text-xs font-medium rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
						Sign up
					</Link>
					<div className="flex-1 py-1.5 text-center text-xs font-semibold rounded-lg bg-white text-slate-900 shadow-sm border border-slate-200/60 transition-all">
						Log in
					</div>
				</div>

				{/* Form */}
				<form className="space-y-3" onSubmit={handleSubmit} autoComplete="off">

					{/* Email */}
					<div className="relative group">
						<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors duration-200">
							<svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
							</svg>
						</div>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="Email Address"
							readOnly
							onFocus={(e) => e.target.readOnly = false}
							autoComplete="username"
							className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 text-xs sm:text-sm font-normal"
							value={form.email}
							onChange={handleChange}
						/>
					</div>

					{/* Password */}
					<div className="relative group">
						<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors duration-200">
							<svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
							</svg>
						</div>
						<input
							id="password"
							name="password"
							type="password"
							placeholder="Password"
							readOnly
							onFocus={(e) => e.target.readOnly = false}
							autoComplete="current-password"
							className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 text-xs sm:text-sm font-normal"
							value={form.password}
							onChange={handleChange}
						/>
					</div>


					{/* Submit Button */}
					<button
						type="submit"
						className="w-full mt-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.99] text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-xs sm:text-sm shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
						disabled={loader}
					>
						{loader ? (
							<>
								<svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Signing in...
							</>
						) : 'Sign In'}
					</button>

					{/* Divider */}
					<div className="flex items-center gap-3 my-4">
						<div className="flex-1 h-px bg-slate-200/80"></div>
						<span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Or continue with</span>
						<div className="flex-1 h-px bg-slate-200/80"></div>
					</div>

					{/* Social Buttons */}
					<div className="grid grid-cols-2 gap-3">
						<button
							type="button"
							className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50/80 hover:border-slate-300 active:scale-[0.98] text-xs font-medium text-slate-700 shadow-sm transition-all duration-150 cursor-pointer"
						>
							<svg className="w-4 h-4" viewBox="0 0 24 24">
								<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
								<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
								<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
								<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
							</svg>
							Google
						</button>
						<button
							type="button"
							className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50/80 hover:border-slate-300 active:scale-[0.98] text-xs font-medium text-slate-700 shadow-sm transition-all duration-150 cursor-pointer"
						>
							<svg className="w-4 h-4 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
								<path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
							</svg>
							GitHub
						</button>
					</div>

				</form>

			</div>
		</div>
	);
};

export default Login;