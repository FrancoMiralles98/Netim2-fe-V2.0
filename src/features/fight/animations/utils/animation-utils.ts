import type { ActiveStatusEffectId, CombatAction } from "netim2-shared";
import type { FightFighterState } from "../../card/fighter-state";

export const getFightActionDisplay = (
    fighter: FightFighterState,
    action: CombatAction
): {
    icon: string;
    name: string;
} | undefined => {

    switch (action.type) {

        case 'basic_attack':
            return {
                icon: './fight/basic-attack.png',
                name: 'Ataque básico'
            };

        case 'use_damage_skill':
        case 'use_healing_skill':
        case 'cast_aura':
        case 'cast_buff': {
            const skill =
                fighter.skills.find(
                    skill =>
                        skill.skillId ===
                        action.skillId
                );

            if (!skill) {
                return undefined;
            }

            return {
                icon: skill.icon,
                name: skill.name
            };
        }

        case 'skip_turn':
            return {
                icon: '/fight/icons/skip-turn.png',
                name: 'Pasar turno'
            };
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