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
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		setError('')
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoader(true);
		try {
			const res = await api.post('/customers/login', form);
			setUser(res.data.customer); // Update the user state in AuthContext
			setError(''); // Clear any previous errors
			navigate('/home', { replace: true }); // Redirect to home page after successful login
			// console.log('User logged in !');
		} catch (error) {
			setError(error.response?.data?.message || 'Unable to login. Please try again.');
			// console.log(error.message);
		}
		finally {
			setLoader(false);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-amber-400 selection:text-zinc-900 font-sans">
			{/* Brand Logo Header */}
			<Link to="/" className="mb-4 flex items-center gap-2 group select-none cursor-pointer">
				<div className="w-7 h-7 rounded-md bg-amber-400 text-zinc-900 flex items-center justify-center font-bold shadow-xs transition-transform duration-200 group-hover:scale-105">
					<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
					</svg>
				</div>
				<span className="text-xl font-bold tracking-tight text-zinc-900">
					Shop<span className="text-amber-500">Kart</span>
				</span>
			</Link>

			{/* Main Card - Amazon Sign-in Box */}
			<div className="w-full max-w-[350px] bg-white rounded-lg border border-zinc-300 shadow-xs p-5 sm:p-6">

				{/* Heading */}
				<div className="mb-3.5">
					<h1 className="text-xl font-bold text-zinc-900">Sign in</h1>
				</div>

				{/* Pill Tabs */}
				<div className="flex bg-zinc-100 p-0.5 rounded-md mb-3.5 border border-zinc-200">
					<Link to="/register" className="flex-1 py-1 text-center text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer">
						Create account
					</Link>
					<div className="flex-1 py-1 text-center text-xs font-bold rounded bg-white text-zinc-900 shadow-xs">
						Sign in
					</div>
				</div>

				{/* Error Alert Message */}
				{error && (
					<div className="mb-3.5 p-2.5 rounded-md bg-red-50 border border-red-300 text-red-800 flex items-start gap-2 text-xs">
						<svg className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
						</svg>
						<p className="flex-1 font-medium leading-relaxed">{error}</p>
						<button
							type="button"
							onClick={() => setError('')}
							className="text-red-500 hover:text-red-800 p-0.5 rounded cursor-pointer"
							title="Dismiss"
						>
							<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				)}

				{/* Form */}
				<form className="space-y-3" onSubmit={handleSubmit} autoComplete="off">

					{/* Email */}
					<div>
						<label htmlFor="email" className="block text-[11px] font-bold text-zinc-800 mb-0.5">
							Email address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="name@example.com"
							readOnly
							onFocus={(e) => e.target.readOnly = false}
							autoComplete="username"
							className="w-full px-2.5 py-1.5 rounded-md border border-zinc-400 bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
							value={form.email}
							onChange={handleChange}
						/>
					</div>

					{/* Password */}
					<div>
						<label htmlFor="password" className="block text-[11px] font-bold text-zinc-800 mb-0.5">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							placeholder="Enter your password"
							readOnly
							onFocus={(e) => e.target.readOnly = false}
							autoComplete="current-password"
							className="w-full px-2.5 py-1.5 rounded-md border border-zinc-400 bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
							value={form.password}
							onChange={handleChange}
						/>
					</div>

					{/* Submit Button - Amazon Yellow Button */}
					<button
						type="submit"
						className="w-full mt-1.5 bg-amber-400 hover:bg-amber-500 active:scale-[0.99] text-zinc-950 font-bold py-2 px-4 rounded-md border border-amber-500 shadow-xs transition-all text-xs sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
						disabled={loader}
					>
						{loader ? (
							<>
								<svg className="animate-spin h-3.5 w-3.5 text-zinc-900" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Signing in...
							</>
						) : 'Continue'}
					</button>

					{/* Divider */}
					<div className="flex items-center gap-2 my-2.5">
						<div className="flex-1 h-px bg-zinc-200"></div>
						<span className="text-[10px] text-zinc-500">or sign in with</span>
						<div className="flex-1 h-px bg-zinc-200"></div>
					</div>

					{/* Social Buttons */}
					<div className="grid grid-cols-2 gap-2">
						<button
							type="button"
							className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-md border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-all cursor-pointer"
						>
							<svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
								<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
								<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
								<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
								<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
							</svg>
							Google
						</button>
						<button
							type="button"
							className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-md border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-all cursor-pointer"
						>
							<svg className="w-3.5 h-3.5 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
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