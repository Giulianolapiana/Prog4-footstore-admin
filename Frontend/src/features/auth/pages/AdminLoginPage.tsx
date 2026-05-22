import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../../../store/useAuthStore';

export const AdminLoginPage = () => {
    // 1. Estados locales para el formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 2. Traemos nuestra mutación de TanStack Query y el estado global
    const { mutate: login, isPending, isError } = useLogin();
    const { isAuthenticated } = useAuthStore();

    // 3. Si ya está logueado, lo mandamos directo al panel
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // 4. Manejador del formulario
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        login({ email, password });
    };

    return (
        <main className="flex w-full min-h-screen font-body-md">
            {/* Left Visual Canvas (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-high overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-on-surface/20 to-transparent z-10"></div>
                <img
                    alt="Gourmet Food Display"
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrPgJrgxnX31s0symL-uWmy1zKLr9SqQT1DSwHCba41l8eLxqDWhutYp4TGR_TuP6IP7niMGZky3UBYNvxpJ8kBNLWj-MqAVJQy3jCunMKKdwAhc6rZW0WtvvldnUYNp9MN0qnGdOn9vvpydXtuLM2rC4N-S4FZWBMYMBCl_N8HmjekXd_fY5S1Qv8Fj4KoHraSqqtYEYOCsDsmiB_A3MNzW4yAcpTLa7LyS_N4xnWpKNngyB9lOnMrMMvkjp6sY8cTqQx8GFuew"
                />
                {/* Floating Brand Element overlay */}
                <div className="relative z-20 p-margin-desktop text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-xl mb-stack-md">
                        <span
                            className="material-symbols-outlined text-[48px] text-primary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            restaurant_menu
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Form Canvas */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-surface relative z-10">
                <div className="w-full max-w-md bg-surface-container-lowest p-stack-lg rounded-2xl shadow-xl border border-outline-variant/30">
                    {/* Header Section */}
                    <div className="text-center mb-stack-lg">
                        <div className="flex items-center justify-center gap-2 mb-stack-md text-primary">
                            <span
                                className="material-symbols-outlined text-[32px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                local_dining
                            </span>
                            <span className="font-headline-lg text-headline-lg hidden md:block">
                                FoodStore Admin
                            </span>
                            <span className="font-headline-lg-mobile text-headline-lg-mobile md:hidden">
                                FoodStore Admin
                            </span>
                        </div>
                        <h1 className="font-display-lg text-display-lg text-on-surface mb-unit tracking-tight">
                            Panel de Control
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Inicia sesión con tus credenciales de administrador.
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-stack-md" onSubmit={handleSubmit}>
                        {/* Mensaje de Error (Se muestra solo si isError es true) */}
                        {isError && (
                            <div
                                className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200"
                                role="alert"
                            >
                                <span className="font-medium">Error:</span> Credenciales
                                inválidas o no tienes permisos.
                            </div>
                        )}

                        {/* Email Input */}
                        <div>
                            <label
                                className="block font-label-md text-label-md text-on-surface-variant mb-unit"
                                htmlFor="email"
                            >
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                                    <span className="material-symbols-outlined text-[20px]">
                                        mail
                                    </span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-3 font-body-md text-body-md bg-surface text-on-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow placeholder:text-on-surface-variant/50"
                                    id="email"
                                    name="email"
                                    placeholder="admin@foodstore.com"
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label
                                className="block font-label-md text-label-md text-on-surface-variant mb-unit"
                                htmlFor="password"
                            >
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                                    <span className="material-symbols-outlined text-[20px]">
                                        lock
                                    </span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-3 font-body-md text-body-md bg-surface text-on-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow placeholder:text-on-surface-variant/50"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        {/* Primary Action */}
                        <button
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-button-text text-button-text text-on-primary bg-primary hover:bg-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors active:scale-[0.98] duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                                    Accediendo...
                                </>
                            ) : (
                                "Acceder al Panel"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};;