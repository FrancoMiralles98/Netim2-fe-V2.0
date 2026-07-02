import { useState } from "react"
import { Login } from "../../features/auth/components/Login"
import { Register } from "../../features/auth/components/Register"
import { PatchNotes } from "../../features/landing/components/PatchNotes"
import { ForgotPassword } from "../../features/auth/components/forgotPassword"
import type { LandingSectionType } from "../../features/landing/types/landing-section.type"

export const LandingPage = () => {
    const [type,setType] = useState<LandingSectionType>('parche')

    const changeType = (value: LandingSectionType) => {
        setType(value)
    }

    return (
        <>
            <main className="relative w-300 mx-auto overflow-hidden bg-center bg-[url('/landing/bg_pattern.jpg')]">
                <img src="/landing/Netim2_2.png" className="relative mx-auto mt-10 z-10 w-100 h-37.5" alt="" />
                <img src="/landing/header-bg.png" className="relative z-10 w-full" alt="" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/90 ">
                    <Login />
                </div>
                <div className="relative bg-[url('/landing/container_bg.png')] w-[49%] bg-no-repeat mx-auto h-[244px] ">
                    <section className="top-[7%] absolute min-h-7 w-full">
                        <section className="flex gap-5 justify-center">
                            <button onClick={() => changeType('register')} className="hover:text-red-800 text-yellow-950 cursor-pointer-custom">Registro</button>
                            <button onClick={() => changeType('password')} className="hover:text-red-800 text-yellow-950 cursor-pointer-custom">Olvide mi contraseña</button>
                            <button onClick={() => changeType('parche')} className="hover:text-red-800 text-yellow-950 cursor-pointer-custom">Notas del parche</button>
                        </section>
                    </section>
                    {
                        type === 'register' && <Register />
                    }
                    {
                        type === 'parche' && <PatchNotes />
                    }
                    {
                        type === 'password' && <ForgotPassword/>
                    }
                </div>
                <div className="relative bg-[url('/landing/container_bg_mid.png')] w-[49%] bg-repeat-y h-[380px]  mx-auto">
                    <div className="absolute w-[100%] top-[8rem]   text-red-500 text-center">
                    </div>
                </div>
                <div className=" inset-0 bg-gradient-to-r from-black via-transparent to-black/90">                </div>
                <footer className="bg-center w-[100%] bottom-0 mx-auto z-20 absolute ">
                    <img src='/landing/footer-bg.png' className="relative z-10 w-[1200px] mx-auto " alt="" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none"></div>
                </footer>

            </main>
        </>
    )
}