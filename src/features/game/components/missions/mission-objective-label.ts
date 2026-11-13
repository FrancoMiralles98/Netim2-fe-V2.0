import type { MissionAction, MissionObjectiveDetail } from "netim2-shared";

const actionLabels: Record<MissionAction["event"], string> = {
    attribute_point_gained: "Conseguí puntos de atributo",
    attribute_point_allocated: "Asigná puntos de atributo",
    speciality_selected: "Elegí una especialidad",
    skill_upgraded: "Mejorá una habilidad",
    item_equipped: "Equipá un ítem",
    equipment_upgraded: "Mejorá un equipo",
    equipment_bonus_added: "Agregá un bonus a un equipo",
    equipment_bonus_changed: "Cambiá un bonus de un equipo",
    equipment_stone_added: "Incrustá una piedra en un equipo",
    chest_opened: "Abrí cofres",
    fish_caught: "Pescá",
    buff_crafted: "Fabricá un buff",
    character_level_up: "Subí de nivel",
    fight_completed: "Completá combates",
};

export const getMissionObjectiveLabel = (objective: MissionObjectiveDetail): string => {
    if (objective.type === "collect") return `Conseguí ${objective.itemName}`;
    if (objective.type === "action") return objective.action.shortDescription ?? actionLabels[objective.action.event];

    const targets = objective.mobs?.map(({ name }) => name).join(" o ");
    const enemyType = "enemyType" in objective.target ? objective.target.enemyType : undefined;
    const zone = objective.target.zone;
    return `Derrotá ${targets || enemyType || "enemigos"}${zone ? ` en ${zone}` : ""}`;
};
