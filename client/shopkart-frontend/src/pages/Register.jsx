import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const Register = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth(); // Access the setUser function from AuthContext
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: ""
    });
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoader(true)
        setError('')
        try {
            const res = await api.post('/customers/register', form)
            setUser(res.data.customer) // Update the user state in AuthContext
            navigate('/home', { replace: true }) // Redirect to home page after successful registration
            // console.log('User registered !')
        } catch (error) {
            setError(error.response?.data?.message || 'Unable to register. Please try again.')
            // console.log(error.message)
        }
        finally {
            setLoader(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-amber-400 selection:text-zinc-900 font-sans">
            {/* Brand Logo Header */}
            <div className="mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-amber-400 text-zinc-900 flex items-center justify-center font-bold shadow-xs">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-zinc-900">
                    Shop<span className="text-amber-500">Kart</span>
                </span>
            </div>

            {/* Main Card - Amazon Create Account Box */}
            <div className="w-full max-w-[350px] bg-white rounded-lg border border-zinc-300 shadow-xs p-5 sm:p-6">

                {/* Heading */}
                <div className="mb-3.5">
                    <h1 className="text-xl font-bold text-zinc-900">Create account</h1>
                </div>

                {/* Pill Tabs */}
                <div className="flex bg-zinc-100 p-0.5 rounded-md mb-3.5 border border-zinc-200">
                    <div className="flex-1 py-1 text-center text-xs font-bold rounded bg-white text-zinc-900 shadow-xs">
                        Create account
                    </div>
                    <Link to="/login" className="flex-1 py-1 text-center text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer">
                        Sign in
                    </Link>
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

                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-[11px] font-bold text-zinc-800 mb-0.5">
                            Your name
                        </label>
                        <input
                            id="fullName"
                            name='fullName'
                            type="text"
                            placeholder="First and last name"
                            className="w-full px-2.5 py-1.5 rounded-md border border-zinc-400 bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                            value={form.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-[11px] font-bold text-zinc-800 mb-0.5">
                            Email address
                        </label>
                        <input
                            id="email"
                            name='email'
                            type="email"
                            placeholder="name@example.com"
                            readOnly
                            onFocus={(e) => e.target.readOnly = false}
                            autoComplete="off"
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
                            name='password'
                            type="password"
                            placeholder="At least 6 characters"
                            readOnly
                            onFocus={(e) => e.target.readOnly = false}
                            autoComplete="new-password"
                            className="w-full px-2.5 py-1.5 rounded-md border border-zinc-400 bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-[11px] font-bold text-zinc-800 mb-0.5">
                            Mobile number
                        </label>
                        <input
                            id="phone"
                            name='phone'
                            type="tel"
                            placeholder="Mobile number"
                            className="w-full px-2.5 py-1.5 rounded-md border border-zinc-400 bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                            value={form.phone}
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
                                Creating account...
                            </>
                        ) : 'Create your ShopKart account'}
                    </button>

                </form>

            </div>
        </div>
    );
};

export default Register;