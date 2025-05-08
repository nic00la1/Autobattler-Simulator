import { Equipment } from "../../interfaces/Equipment";

export class Hero {
  name: string;
  health: number;
  maxHealth: number = 100;
  attack: number;
  level: number;
  experience: number;
  expThreshold: number;
  equipment : Equipment;
  className: string; // Add this property

  constructor(
    name: string,
    health: number,
    maxHealth: number = 100,
    attack: number,
    level: number = 1,
    experience: number = 0,
    expThreshold: number = 100,
    className: string = "Warrior" // Default class name
  ) {
    this.name = name;
    this.health = health;
    this.maxHealth = maxHealth;
    this.attack = attack;
    this.level = level;
    this.experience = experience;
    this.expThreshold = expThreshold;
    this.className = className; // Initialize class name
    this.equipment = {
        weapon: null,
        armor: null,
        accessory: null,
    }
  }
}
