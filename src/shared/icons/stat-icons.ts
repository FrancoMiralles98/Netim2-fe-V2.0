import { COMBAT_COLORS } from '../colors/combat-colors';

export function getStatIconColor(path: string): string {
    const key = path.startsWith('general.') ? path.split('.')[1] : path;
    if (key === 'ad' || key === 'ap') return COMBAT_COLORS[key].text;
    return 'text-slate-200';
}

const STAT_ICONS: Record<string, string> = {
    ad: '/fight/icono-ad.png', ap: '/fight/icono-ap.png',
    hp: '/fight/healt-icon1.png', mana: '/fight/mana-icon1.png',
    regen_hp: '/game/regen-vida.png', regen_mana: '/game/regen-mana.png',
    def: '/game/armor.png', va: '/game/va.png', vh: '/game/cdr.png', vm: '/game/vm.png',
};

export function getStatIcon(path: string): string | undefined {
    const parts = path.split('.');
    return STAT_ICONS[parts[1]] ?? STAT_ICONS[parts[0]];
}
