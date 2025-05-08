import { Equipment } from "../../interfaces/Equipment";

export class Hero {
  name: string;
  health: number;
  attack: number;
  level: number;
  experience: number;
  expThreshold: number;
  equipment : Equipment;

  constructor(
    name: string,
    health: number,
    attack: number,
    level: number = 1,
    experience: number = 0,
    expThreshold: number = 100,
  ) {
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.level = level;
    this.experience = experience;
    this.expThreshold = expThreshold;
    this.equipment = {
        weapon: null,
        armor: null,
        accessory: null,
    }
  }
}
