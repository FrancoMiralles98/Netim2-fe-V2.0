import type { NetimTextProps } from "../types/netimTextProps"

export const NetimText = ({text,cssAditionals}:NetimTextProps) => {
    return (
        <p className={`text-center text-white text-xs py-1 tracking-wide font-light ${cssAditionals ? cssAditionals: ''}`}>
            {text}
        </p>
    )
}