export const LoadingModal = ({ message }: { message: string }) => {
    return (
        <div className="fixed select-none inset-0 z-[9999] flex justify-center ">
            <section className='relative'>
                <div className="shadow-lg top-[39%] left-[-100px] w-[350px] h-[100px] max-w-md absolute">
                    <img src="/modal/modal_wo_b.png" className="h-[120px] w-full relative" alt="" />
                    <div className="absolute flex justify-center items-center h-full bg-red-500/80 top-2 left-1 w-[97%]   z-50">
                        <p className="text-center text-white align-middle mb-12 text-xs tracking-wide  font-light">{message}</p>
                    </div>
                </div>
            </section>
        </div>
    )
}