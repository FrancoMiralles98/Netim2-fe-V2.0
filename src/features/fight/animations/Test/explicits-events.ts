import type { FightEvent } from "netim2-shared";

export const EXPLICIT_EVENTS: FightEvent[] = [
    {
        type: 'fight_finished',

        eventId: 'event-finished',
        fightId: 'fight-test',
        turnNumber: 8,

        result: {
            outcome: 'winner',

            winnerSide: 'allies',

            winnerFighterIds: [
                'guerrero-id1'
            ],

            survivingFighterIds: [
                'guerrero-id1'
            ],

            defeatedFighterIds: [
                'mob-id'
            ],

            reason: 'team_defeated',

            finishedOnTurn: 8
        }
    }
];