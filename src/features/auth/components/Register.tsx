import { useRegisterForm } from "../hooks/useRegisterForm"

export const Register = () => {
    const { handleSubmit } = useRegisterForm()

    return (
        <div className="bg-[url('/landing/content-box-bg.jpg')] z-20 border-[1px] border-black/50 border-b-5 right-[12.5%] top-[20%] absolute bg-contain bg-repeat-y pl-3 w-[75%]  bg-red-200 mx-auto ">
            <h1 className="pl-3 text-red-800 font-semibold">Registro</h1>
            <form id='registerForm' className="w-full gap-y-3 grid my-3" onSubmit={handleSubmit}>
                <div className="flex pl-3 text-yellow-900  gap-2">
                    <label htmlFor="" className="w-[20%]">Username</label>
                    <input type="text" name='username' className="w-[40%] text-sm bg-yellow-700/30 pl-1" />
                </div>
                
                <hr className="border-[1px] w-[95%]  border-red-950/40" />
                <div className="flex pl-3 text-yellow-900  gap-2">
                    <label htmlFor="" className="w-[20%]">Contraseña</label>
                    <input type="password" name='password' className="w-[40%] bg-yellow-700/30 pl-1" />
                </div>
                
                <hr className="border-[1px] w-[95%]  border-red-950/40" />
                <div className="flex pl-3  text-yellow-900 gap-2">
                    <label htmlFor="" className="w-[20%]">Email</label>
                    <input type="email" name="email" className="w-[40%] text-sm bg-yellow-700/30 pl-1" />
                </div>
                
                <hr className="border-[1px] w-[95%]  border-red-950/40" />
                <div className="flex pl-3 flex-wrap  text-yellow-900 gap-2">
                    <label htmlFor="" className="w-[20%]">Codigo</label>
                    <input type="password" name='codigo' className="w-[40%] text-sm bg-yellow-700/30 pl-1" />
                    <p className="w-[100%] text-xs  mt-[-5px]">*Codigo de 8 números que se requiere cuando se quiere eliminar un personaje. </p>
                </div>
                
                <hr className="border-[1px] w-[95%]  border-red-950/40" />

                <div className="flex">
                    <button type="submit" className="bg-[url('/landing/register-botton.png')] bg-contain bg-no-repeat w-[37%] h-6 flex hover:text-orange-400">
                        <p className="pl-7 cursor-pointer-custom text-orange-200 hover:text-orange-300">Registrarme</p>
                    </button>
                    
                </div>

            </form>
        </div>
    )
}