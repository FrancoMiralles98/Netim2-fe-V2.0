import type { ActiveStatusEffectId, CombatAction } from "netim2-shared";
import type { FightFighterState } from "../../card/fighter-state";

export interface FightActionDisplay {
    name: string;
    icon: string;
}

export const getFightActionDisplay = (fighter: FightFighterState, action: CombatAction): FightActionDisplay | undefined => {

    switch (action.type) {

        case 'basic_attack':
            return {
                name: 'Ataque básico',
                icon: '/fight/icons/basic-attack.png'
            };

        case 'use_damage_skill':
        case 'use_healing_skill':
        case 'cast_aura':
        case 'cast_buff': {

            const skill = fighter.skills.find(
                skill =>
                    skill.skillId ===
                    action.skillId
            );

            if (!skill) {
                return undefined;
            }

            return {
                name: skill.name,
                icon: skill.icon
            };
        }

        case 'skip_turn':
            return undefined;
    }
};

export const getStatusEffectDamageColor = (
    effectId: ActiveStatusEffectId
) => {
    switch (effectId) {
        case 'veneno':
            return 'text-green-500';

        case 'incendio':
            return 'text-orange-500';

        case 'sangrado':
            return 'text-red-500';

        case 'electrico':
            return 'text-cyan-400';

        default:
            return 'text-white';
    }
};