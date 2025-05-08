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
    const defaultEquipment: Equipment = {
      weapon: 'Żelazny Miecz',
      armor: 'Skórzana Zbroja',
      accessory: 'Drewniany Pierścień',
    };

    if (characterClass === 'Warrior') {
      this.hero = new Hero(name, 100, 15, 1); // Wojownik: więcej HP
    } else if (characterClass === 'Mage') {
      this.hero = new Hero(name, 80, 20, 1); // Mag: większy atak
    }

    if (this.hero) {
      this.hero.equipment = defaultEquipment; // Assign default equipment
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