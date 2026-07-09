import type { NetimTextProps } from "../types/netimTextProps"

export const NetimText = ({text,cssAditionals}:NetimTextProps) => {
    return (
        <p className={`text-center text-white self-center text-xs tracking-wide font-light ${cssAditionals ? cssAditionals: ''}`}>
            {text}
        </p>
    )
}