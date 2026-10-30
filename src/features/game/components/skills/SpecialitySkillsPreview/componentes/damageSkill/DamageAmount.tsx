import type { SkillDamage } from "netim2-shared";
import { COMBAT_COLORS } from "../../../../../../../shared/colors/combat-colors";

type DamageType = SkillDamage["components"][number]["damageType"];

const DAMAGE_STYLES = {
    ad: { color: COMBAT_COLORS.ad.text, icon: "/fight/icono-ad.png", label: "Daño físico" },
    ap: { color: COMBAT_COLORS.ap.text, icon: "/fight/icono-ap.png", label: "Daño mágico" },
    true: { color: COMBAT_COLORS.true.text, icon: null, label: "Daño verdadero" },
} as const;

export const DamageAmount = ({ value, damageType }: { value: string; damageType?: DamageType }) => {
    const style = damageType ? DAMAGE_STYLES[damageType] : undefined;

    return (
        <span className={`inline-flex items-center gap-1 align-middle ${style?.color ?? ""}`}>
            {value}
            {style?.icon && (
                <span
                    role="img"
                    aria-label={style.label}
                    className="h-4 w-4 shrink-0 bg-current"
                    style={{
                        maskImage: `url('${style.icon}')`,
                        maskSize: "contain",
                        maskPosition: "center",
                        maskRepeat: "no-repeat",
                    }}
                />
            )}
        </span>
    );
};
