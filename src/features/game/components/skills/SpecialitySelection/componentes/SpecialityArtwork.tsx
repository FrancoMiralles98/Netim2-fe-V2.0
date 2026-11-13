import type { CharacterSpeciality } from "netim2-shared";
import { SPECIALITY_IMAGES } from "../specialities.config";

interface SpecialityArtworkProps {
    especialidad: CharacterSpeciality;
}

export const SpecialityArtwork = ({ especialidad }: SpecialityArtworkProps) => {
    const imagePath = SPECIALITY_IMAGES[especialidad];
    if (!imagePath) return null;

    return (
        <div
            className="pointer-events-none absolute top-[2%] right-0 bottom-[25%] left-[35%] overflow-hidden"
            style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 78%, transparent 100%)" }}
        >
            <div
                className="absolute inset-0"
                style={{ maskImage: "radial-gradient(ellipse 35% 25% at 100% 0%, transparent 0%, black 100%)" }}
            >
                <div
                    className="absolute inset-0"
                    style={{ maskImage: "radial-gradient(ellipse 75% 40% at 0% 100%, transparent 0%, transparent 50%, black 100%)" }}
                >
                    <div
                        className="absolute top-0 left-0 h-[80%] w-full"
                        style={{ maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)" }}
                    >
                        <img
                            src={imagePath}
                            alt=""
                            className="h-full w-full object-cover object-center"
                            style={{ maskImage: "linear-gradient(to right, transparent 0%, black 18%, black 76%, transparent 100%)" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
