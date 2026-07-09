import { NetimButton } from "../../button/ButtomNetim"
import type { ActionModalProps } from "../types/modals/actionModalProps"

export const ActionModal = ({
    acceptText,
    cancelText,
    title,
    subTitle,
    onAccept,
    onCancel
}: ActionModalProps) => {
    return (
        <div className="fixed select-none inset-0 z-[9999]  flex justify-center ">
            <section className='relative'>
                <div className="shadow-lg  top-[39%] left-[-100px] w-[350px] h-[100px] max-w-md absolute">
                    <img src="/modal/modal_wo_b.png" className="h-[120px] w-full relative" alt="" />
                    <div className="absolute  h-10 top-2 left-1 w-[97%]   z-50">
                        <p className="text-center text-white text-xs tracking-wide  font-light">{title}</p>
                        <p className="text-center text-white text-xs tracking-wide mt-3 font-light">{subTitle}</p>
                    </div>
                    <div className="absolute h-5 bottom-2 left-1 w-[97%] items-center grid grid-cols-2   z-50">
                        <div className='w-full flex items-center justify-around col-span-2 h-[45px] '>
                            <div className='relative cursor-pointer'>
                                <NetimButton text={cancelText!} onClickButtom={onCancel!} />
                            </div>
                            <div className='relative cursor-pointer'>
                                <NetimButton text={acceptText!} onClickButtom={onAccept} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}