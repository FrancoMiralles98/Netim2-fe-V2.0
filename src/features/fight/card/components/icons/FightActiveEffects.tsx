import { FightAuraIcon } from "./FightAuraIcon";
import { FightBuffIcon } from "./FightBuffIcon";
import type { FightFighterState } from "../../fighter-state";
import { FightStatusEffectIcon } from "./FightStatusEffectIcon";

export const FightActiveEffects = ({
    fighter,
    fighters
}: {
    fighter: FightFighterState;
    fighters: FightFighterState[];
}) => {

    const getSourceName = (
        fighterId: string
    ): string => {
        return (
            fighters.find(
                fighter =>
                    fighter.fighterId === fighterId
            )?.name ?? 'Desconocido'
        );
    };

    const hasEffects =
        fighter.activeEffects.length > 0 ||
        fighter.activeAuras.length > 0 ||
        fighter.activeBuffs.length > 0;

    if (!hasEffects) {
        return null;
    }

    return (
        <div
            className="
            
                 absolute
        bottom-full
        left-0
        right-0
        z-20
        mb-1.5
        flex
        flex-wrap
        gap-1
            "
        >
            {fighter.activeEffects.map(effect => (
                <FightStatusEffectIcon
                    key={effect.instanceId}
                    effect={effect}
                    sourceName={
                        getSourceName(
                            effect.sourceFighterId
                        )
                    }
                />
            ))}

            {fighter.activeAuras.map(aura => (
                <FightAuraIcon
                    key={aura.instanceId}
                    aura={aura}
                    sourceName={
                        getSourceName(
                            aura.sourceFighterId
                        )
                    }
                />
            ))}

            {fighter.activeBuffs.map(buff => (
                <FightBuffIcon
                    key={buff.instanceId}
                    buff={buff}
                    sourceName={
                        getSourceName(
                            buff.sourceFighterId
                        )
                    }
                />
            ))}
        </div>
    );
};