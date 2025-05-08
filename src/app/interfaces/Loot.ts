export interface Loot {
  weapon?: string;
  armor?: string;
  accessory?: string;
  dropChance: number; // Chance to drop this loot (0 to 1)
}