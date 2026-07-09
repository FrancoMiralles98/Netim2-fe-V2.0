import { useLoginForm } from "../hooks/useLoginForm"

export const Login = () => {
    const { handleSubmit } = useLoginForm()
    return (
        <form action="" onSubmit={handleSubmit} className="relative mt-[16%] h-[100px] z-10">
            <label htmlFor="" className="absolute top-[14%] right-[61%] z-10 text-orange-100">Username:</label>
            <input type="text" defaultValue={"eracil1"} name='username' className="absolute top-[14%] text-orange-300 right-[43%] text-sm py-0.5 pl-1 w-[181px] z-10 bg-black/50" />
            <label htmlFor="" className="absolute top-[45%] right-[61%] z-10  text-orange-100">Contraseña:</label>
            <input type="password" defaultValue={"eracil1"} name='password' className="absolute top-[45%] text-orange-300 right-[43%] z-10 text-sm py-0.5 pl-1 w-[181px] bg-black/50" />
            <button type="submit" className="absolute cursor-pointer-custom hover:bg-white/20 hover:text-orange-100 text-orange-200  z-10 top-[16%] right-[34%] border-black/50 bg-black/50 border-[1px] px-3">
                <h1>Login</h1>
                <i className="bi bi-arrow-bar-right"></i>
            </button>
        </form>
    )
}