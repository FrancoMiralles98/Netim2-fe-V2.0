import { NetimButton } from "../../button/ButtomNetim"
import { NetimText } from "../../typography/components/NetimText"
import type { NotificationModalProps } from "../types/modals/notificationModalProps"

export const NotificationModal = ({title,onClickButton,acceptMessage}:NotificationModalProps) => {
    return (
            <div className="fixed select-none inset-0 z-[9999] flex justify-center max-h-full">
                <section className='relative'>
                    <div className="shadow-lg  top-[39%] left-[-100px] w-[350px] h-[100px] max-w-md absolute">
                        <img src="/modal/modal_wo_b.png" className="h-[120px] w-full relative" alt="" />
                        <div className="absolute  h-10 top-6 left-1 w-[97%]   z-50">
                            <NetimText text={title}/>
                        </div>
                        <div className="absolute h-5 bottom-2 left-1 w-[97%] items-center z-50">
                            <div className='w-full flex items-center justify-around col-span-2 h-[45px] '>
                                <div className='relative cursor-pointer'>
                                    <NetimButton text={acceptMessage ?? 'Ok'} onClickButtom={onClickButton!} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
}