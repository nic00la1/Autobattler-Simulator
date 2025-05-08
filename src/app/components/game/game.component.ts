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

  getEquipmentEntries(): { key: string; value: string | null }[] {
    return Object.entries(this.player.equipment).map(([key, value]) => ({
      key,
      value,
    }));
  }

  startNewBattle(): void {
    if (this.player.health <= 0) {
      this.gameOver = true;
      this.addLogEntry('Koniec gry! Uruchom ponownie, aby zagrać jeszcze raz.');
      return;
    }

    this.currentEnemy = this.getRandomEnemy();
    this.battleLog = [];
    this.gameOver = false; // Resetuj gameOver na false przy rozpoczęciu nowej walki
    this.addLogEntry(`${this.player.name} napotyka ${this.currentEnemy.name}!`);
    this.simulateBattle();
  }

  getRandomEnemy(): Enemy {
    const enemies = this.gameService.getEnemies();
    const weights = [60, 30, 10]; // Przykładowe wagi dla przeciwników
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
    }, 1000); // 1-sekundowe opóźnienie między akcjami
  }

  isBattleOver(): boolean {
    return this.player.health <= 0 || (this.currentEnemy !== null && this.currentEnemy.health <= 0);
  }

  heroAttacks(): void {
    if (this.currentEnemy) {
      this.currentEnemy.health -= this.player.attack;
      this.addLogEntry(
        `${this.player.name} atakuje ${this.currentEnemy.name} za ${this.player.attack} obrażeń. ${this.currentEnemy.name} ma ${Math.max(this.currentEnemy.health, 0)} HP.`
      );
    }
  }

  enemyAttacks(): void {
    if (this.currentEnemy) {
      this.player.health -= this.currentEnemy.attack;
      this.addLogEntry(
        `${this.currentEnemy.name} atakuje ${this.player.name} za ${this.currentEnemy.attack} obrażeń. ${this.player.name} ma ${Math.max(this.player.health, 0)} HP.`
      );
    }
  }

  endBattle(): void {
    if (this.player.health <= 0) {
      this.addLogEntry(`${this.player.name} został pokonany! Koniec gry.`);
      this.gameOver = true;
      return;
    }

    if (this.currentEnemy) {
      this.addLogEntry(`${this.player.name} pokonuje ${this.currentEnemy.name}! Zdobywa ${this.currentEnemy.expReward} EXP.`);
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
    this.player.expThreshold += 50; // Zwiększ próg dla następnego poziomu
    this.player.health = 100; // Ulecz na poziomie
    this.player.attack += 5;
    this.addLogEntry(`${this.player.name} awansuje na poziom ${this.player.level}!`);
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