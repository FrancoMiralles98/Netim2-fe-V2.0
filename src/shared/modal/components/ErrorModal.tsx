import { NetimButton } from "../../button/ButtomNetim"
import { NetimText } from "../../typography/components/NetimText"
import type { ErrorModalProps } from "../types/modals/error-modal-props.type"

export const ErrorModal = ({ message, errors, onAccept }: ErrorModalProps) => {
    return (
        <div className="fixed  inset-0 z-[9999] flex justify-center max-h-full">
            <section className='relative '>
                <div className="shadow-lg top-[39%] left-[-100px] bg-white/50 h-[120px] w-[350px]  max-w-md absolute">
                    <img src="/modal/modal_wo_b.png" className="h-[130px] w-full absolute z-1" alt="" />
                    <section className="relative grid grid-rows-2 h-full z-50 mx-1 mt-1">
                        <section id='title' className=" flex justify-center items-center">
                            <NetimText text={message} cssAditionals="!text-sm" />
                        </section>
                        <section id="button" className=" flex justify-center items-center">
                            <NetimButton text="Ok" onClickButtom={onAccept} />
                        </section>
                    </section>


                </div>
            </section>
        </div>
    )
}