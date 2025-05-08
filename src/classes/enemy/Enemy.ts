import { Loot } from '../../interfaces/Loot';

export class Enemy {
  name: string;
  health: number;
  attack: number;
  expReward: number;
  loot: Loot | null; // Loot can be null if the enemy doesn't drop anything

  constructor(
    name: string,
    health: number,
    attack: number,
    expReward: number,
    loot: Loot | null = null
  ) {
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.expReward = expReward;
    this.loot = loot;
  }
}
