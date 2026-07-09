
import { NetimText } from "../typography/components/NetimText"
import type { ButtomNetimProps } from "./types/buttomNetimProps"

export const NetimButton = ({onClickButtom,text,widthButtom}: ButtomNetimProps) => {
    return (
        <div onClick={onClickButtom} className='relative w-max cursor-pointer-custom'>
            <img src="/button/moda_b.png" className={`${widthButtom} h-[20px]`} alt="" />
            <div className=" absolute flex items-center justify-center top-[1px] left-0 w-full h-[18px]">
                <NetimText text={text}/>
            </div>
        </div>
    )
}