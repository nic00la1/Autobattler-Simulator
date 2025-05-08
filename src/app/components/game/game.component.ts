import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Hero } from '../../classes/hero/Hero';
import { Enemy } from '../../classes/enemy/Enemy';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  imports: [CommonModule],
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  player: Hero;
  currentEnemy: Enemy | null = null;
  battleLog: string[] = [];
  gameOver: boolean = false; 

  constructor(private gameService: GameService) {
    this.player = this.gameService.getHero()!;
    this.startNewBattle();
  }

  startNewBattle(): void {
    if (this.player.health <= 0) {
      this.gameOver = true;
      this.addLogEntry('Game Over! Restart to play again.');
      return;
    }

    this.currentEnemy = this.getRandomEnemy();
    this.battleLog = [];
    this.gameOver = false; // Reset gameOver to false when starting a new battle
    this.addLogEntry(`${this.player.name} encounters a ${this.currentEnemy.name}!`);
    this.simulateBattle();
  }

  getRandomEnemy(): Enemy {
    const enemies = this.gameService.getEnemies();
    const weights = [60, 30, 10]; // Example weights for enemies
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    for (let i = 0; i < enemies.length; i++) {
      cumulativeWeight += weights[i];
      if (random < cumulativeWeight) {
        return enemies[i];
      }
    }
    return enemies[0]; // Fallback
  }

  simulateBattle(): void {
    if (!this.currentEnemy) return;

    const interval = setInterval(() => {
      if (this.isBattleOver()) {
        clearInterval(interval);
        this.endBattle();
        return;
      }

      this.heroAttacks();
      if (this.currentEnemy && this.currentEnemy.health > 0) {
        this.enemyAttacks();
      }
    }, 1000); // 1-second delay between actions
  }

  isBattleOver(): boolean {
    return this.player.health <= 0 || (this.currentEnemy !== null && this.currentEnemy.health <= 0);
  }

  heroAttacks(): void {
    if (this.currentEnemy) {
      this.currentEnemy.health -= this.player.attack;
      this.addLogEntry(
        `${this.player.name} attacks ${this.currentEnemy.name} for ${this.player.attack} damage. ${this.currentEnemy.name} has ${Math.max(this.currentEnemy.health, 0)} HP left.`
      );
    }
  }

  enemyAttacks(): void {
    if (this.currentEnemy) {
      this.player.health -= this.currentEnemy.attack;
      this.addLogEntry(
        `${this.currentEnemy.name} attacks ${this.player.name} for ${this.currentEnemy.attack} damage. ${this.player.name} has ${Math.max(this.player.health, 0)} HP left.`
      );
    }
  }

  endBattle(): void {
    if (this.player.health <= 0) {
      this.addLogEntry(`${this.player.name} has been defeated! Game Over.`);
      this.gameOver = true;
      return;
    }

    if (this.currentEnemy) {
      this.addLogEntry(`${this.player.name} defeats ${this.currentEnemy.name}! Gains ${this.currentEnemy.expReward} EXP.`);
      this.player.experience += this.currentEnemy.expReward;

      if (this.player.experience >= this.player.expThreshold) {
        this.levelUp();
      }
    }

    this.startNewBattle();
  }

  levelUp(): void {
    this.player.level++;
    this.player.experience -= this.player.expThreshold;
    this.player.expThreshold += 50; // Increase threshold for next level
    this.player.health = 100; // Heal on level up
    this.player.attack += 5;
    this.addLogEntry(`${this.player.name} levels up to level ${this.player.level}!`);
  }

  addLogEntry(entry: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.battleLog.unshift(`[${timestamp}] ${entry}`);
  }

  restartGame(): void {
    this.player = this.gameService.getHero()!;
    this.player.health = 100;
    this.player.level = 1;
    this.player.experience = 0;
    this.player.expThreshold = 50;
    this.battleLog = [];
    this.gameOver = false;
    this.startNewBattle();
  }
}