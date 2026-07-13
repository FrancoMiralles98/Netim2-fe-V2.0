import { NetimButton } from "../../../shared/button/ButtomNetim"
import { useUserSession } from "../../userSession/hook/useUserSession"
import type { CharacterSelectionType } from "../types/character-selection.type"

export const Selection = ({ changeType }: { changeType: (typeToChange: CharacterSelectionType) => void }) => {
    const { logout } = useUserSession()
    return (
        <section className="relative mx-auto min-h-[700px] w-[1200px]">
            <div className="absolute left-40 top-0 z-20">
                <NetimButton onClickButtom={() => changeType("creation")} widthButtom="w-[100px]" text="Crear Personje" />
            </div>
            <div className="absolute left-40 top-7 z-20">
                <NetimButton onClickButtom={logout} text="Salir" />
            </div>  
        </section>
    )
}