import type { CharacterSpeciality, CharacterSummary } from "netim2-shared";

export interface SelectionCardProps {
    character: CharacterSummary;
    maxAttributeValue: number;
    isActive: boolean
    getImageClass: (type?: CharacterSpeciality)=> string
    handleDeleteClick: () => void
    handleConnectClick: () => void
}