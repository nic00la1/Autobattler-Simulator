import { Injectable } from '@angular/core';
import { Hero } from '../classes/hero/Hero';
import { Enemy } from '../classes/enemy/Enemy';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  hero: Hero | null = null;

  createCharacter(name: string, characterClass: string): void {
    if (characterClass === 'Warrior') {
      this.hero = new Hero(name, 100, 15, 1); // Wojownik: więcej HP
    } else if (characterClass === 'Mage') {
      this.hero = new Hero(name, 80, 20, 1); // Mag: większy atak
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
      new Enemy('Goblin', 50, 10, 20),
      new Enemy('Orc', 80, 15, 30),
      new Enemy('Troll', 120, 20, 40),
    ];
  }

}