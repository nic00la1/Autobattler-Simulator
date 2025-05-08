import { Injectable } from '@angular/core';
import { Hero } from '../classes/hero/Hero';
import { Enemy } from '../classes/enemy/Enemy';
import { Equipment } from '../interfaces/Equipment';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  hero: Hero | null = null;

  createCharacter(name: string, characterClass: string): void {
    let classSpecificEquipment: Equipment;
  
    if (characterClass === 'Warrior') {
      classSpecificEquipment = {
        weapon: 'Miecz Wojownika', // Warrior-specific weapon
        armor: 'Zbroja Wojownika', // Warrior-specific armor
        accessory: 'Pierścień Mocy', // Warrior-specific accessory
      };
      this.hero = new Hero(name, 100, 15, 20); // Warrior: More HP
    } else if (characterClass === 'Mage') {
      classSpecificEquipment = {
        weapon: 'Różdżka Maga', // Mage-specific weapon
        armor: 'Szata Maga', // Mage-specific armor
        accessory: 'Amulet Magii', // Mage-specific accessory
      };
      this.hero = new Hero(name, 80, 20, 30); // Mage: Higher attack
    } else {
      // Default fallback
      classSpecificEquipment = {
        weapon: 'Żelazny Miecz',
        armor: 'Skórzana Zbroja',
        accessory: 'Drewniany Pierścień',
      };
      this.hero = new Hero(name, 90, 10, 25); // Balanced stats
    }
  
    if (this.hero) {
      this.hero.equipment = classSpecificEquipment; // Assign class-specific equipment
      this.hero.className = characterClass; // Assign class name
    }
  
    console.log('Postać stworzona:', this.hero);
  }
  getHero(): Hero | null {
    return this.hero;
  }

  getRandomEnemy(): Enemy {
    const enemies = [
      new Enemy('Goblin', 50, 10, 20),
      new Enemy('Orc', 80, 15, 30),
      new Enemy('Troll', 120, 20, 40),
    ];
    return enemies[Math.floor(Math.random() * enemies.length)];
  }

  getEnemies(): Enemy[] {
    return [
      new Enemy('Goblin', 50, 10, 20, { 
        weapon: 'Sztylet', 
        armor: 'Pancerz z Tkaniny', 
        dropChance: 0.5 
      }),
      new Enemy('Ork', 80, 15, 30, { 
        weapon: 'Topór', 
        armor: 'Kolczuga', 
        dropChance: 0.4 
      }),
      new Enemy('Troll', 120, 20, 40, { 
        weapon: 'Maczuga', 
        armor: 'Skórzana Zbroja', 
        dropChance: 0.6,
        accessory: "Amulet Siły", 
      }),
    ];   
  }
}