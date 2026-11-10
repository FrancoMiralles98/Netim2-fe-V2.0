import { useId, type CSSProperties } from "react";
import type { ItemDTO } from "netim2-shared";
import "./item-legendary-halo.css";

interface ItemLegendaryImageProps {
    item: ItemDTO;
    src: string;
    alt: string;
    className?: string;
    style?: CSSProperties;
}

export const ItemLegendaryImage = ({ item, src, alt, className, style }: ItemLegendaryImageProps) => {
    const filterId = useId();

    if (item.type !== "equip" || item.legendary !== true) {
        return <img src={src} alt={alt} className={className} style={style} />;
    }

    return (
        <span className={`item-legendary-image ${className ?? ""}`} style={style}>
            <img className="item-legendary-image__base" src={src} alt={alt} />
            <svg className="item-legendary-image__defs" width="0" height="0" aria-hidden="true" focusable="false">
                <defs>
                    <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
                        <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="expanded" />
                        <feComposite in="expanded" in2="SourceAlpha" operator="out" result="edge" />
                        <feFlood floodColor="#fff5eb" result="white" />
                        <feComposite in="white" in2="edge" operator="in" />
                    </filter>
                </defs>
            </svg>
            <span className="item-legendary-image__sweep" aria-hidden="true">
                <img src={src} alt="" style={{ filter: `url("#${filterId}") drop-shadow(0 0 1px #fff2dc)` }} />
            </span>
        </span>
    );
};
