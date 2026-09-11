import type { FightAnimationState } from "../../animations/animations.types";
import { getStatusEffectDamageColor } from "../../animations/utils/animation-utils";
import { COMBAT_VISUAL_ICON_CONFIG, getStatusEffectDamageIcon } from "../../utils/status-effect-display-config";
import { CombatColoredIcon } from "./icons/CombatColorIcon";

export type CombatFloatingAnimation = Extract<
    FightAnimationState,
    {
        type:
        | 'damage'
        | 'healing'
        | 'resource_changed'
        | 'status_effect_damage';
    }
>;
interface CombatFloatingValueProps {
    animation: CombatFloatingAnimation;
}

export const CombatFloatingValue = ({
    animation,
}: CombatFloatingValueProps) => {

    const getVisualConfig = () => {

        switch (animation.type) {

            /*
             * Daño directo.
             */
            case 'damage': {
                return {
                    amount: animation.amount,
                    sign: '-',
                    icon:
                        COMBAT_VISUAL_ICON_CONFIG[
                            animation.damageType
                        ].icon,

                    colorClass: COMBAT_VISUAL_ICON_CONFIG[animation.damageType].color,

                    critical: animation.critical,

                    animationClass:
                        'animate-[fight-damage-number_var(--fight-damage-duration)_linear_forwards]',
                };
            }

            /*
             * Curación.
             */
            case 'healing': {
                return {
                    amount: animation.amount,
                    sign: '+',
                    icon:
                        COMBAT_VISUAL_ICON_CONFIG.heal.icon,

                    colorClass: 'text-green-400',

                    critical: false,

                    animationClass:
                        'animate-[fight-damage-number_var(--fight-damage-duration)_linear_forwards]',
                };
            }

            /*
             * Cambio de recursos.
             */
            case 'resource_changed': {

                const isHp =
                    animation.resource === 'hp';

                return {
                    amount: animation.amount,

                    sign:
                        animation.increased
                            ? '+'
                            : '-',

                    icon: isHp
                        ? COMBAT_VISUAL_ICON_CONFIG.heal.icon
                        : COMBAT_VISUAL_ICON_CONFIG.mana.icon,

                    colorClass: isHp
                        ? 'text-green-500'
                        : 'text-blue-400',

                    critical: animation.critical,

                    animationClass:
                        'animate-[fight-resource-number_var(--fight-resource-duration)_linear_forwards]'
                };
            }

            /*
             * Daño producido por un estado.
             */
            case 'status_effect_damage': {
                return {
                    amount: animation.amount,
                    sign: '-',

                    icon:
                        getStatusEffectDamageIcon(
                            animation.effectId
                        ),

                    colorClass:
                        getStatusEffectDamageColor(
                            animation.effectId
                        ),

                    critical: false,

                    animationClass:
                        'animate-[fight-damage-number_var(--fight-damage-duration)_linear_forwards]',
                };
            }
        }
    };

    const config = getVisualConfig();

    return (
        <div
            className={`
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                z-[70]

                flex
                items-center
                gap-1

                whitespace-nowrap
                font-black
                drop-shadow-lg

                ${config.animationClass}
                ${config.colorClass}

                ${config.critical
                    ? 'text-2xl'
                    : 'text-xl'
                }
            `}
        >
            {/* Icono del tipo de daño/recurso */}
            <CombatColoredIcon
                src={config.icon}
                critical={config.critical}
            />

            {/* Valor */}
            <span>
                {config.sign}
                {config.amount}
            </span>

            {/* Indicador crítico adicional */}
            {config.critical && (
                <img
                    src={
                        COMBAT_VISUAL_ICON_CONFIG
                            .critico.icon
                    }
                    alt=""
                    className="
                        h-5
                        w-5
                        object-contain
                    "
                />
            )}
        </div>
    );
};