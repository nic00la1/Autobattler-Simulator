import { Loot } from '../../interfaces/Loot';

export class Enemy {
  name: string;
  health: number;
  attack: number;
  expReward: number;
  loot: Loot | null; // Loot can be null if the enemy doesn't drop anything
  color: string; // Color for the enemy

  constructor(
    name: string,
    health: number,
    attack: number,
    expReward: number,
    loot: Loot | null = null,
    color: string
  ) {
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.expReward = expReward;
    this.loot = loot;
    this.color = color; // Assign the color to the enemy
  }
}
