import { Component, EventEmitter, Output } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Hero } from '../../classes/hero/Hero';
import { Enemy } from '../../classes/enemy/Enemy';
import { CommonModule } from '@angular/common';
import { Loot } from '../../interfaces/Loot';
import { BattleSimulationComponent } from "../battle-simulation/battle-simulation.component";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  imports: [CommonModule, BattleSimulationComponent],
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  player: Hero;
  currentEnemy: Enemy | null = null;
  battleLog: string[] = [];
  lootItems: Loot[] = []; // Tablica do przechowywania zdobytego lootu
  allLootItems: Loot[] = []; // Stores loot from all battles
  gameOver: boolean = false;
  battleCount: number = 0; // Licznik walk
  maxBattles: number = 10; // Maksymalna liczba walk

  @Output() playerAttack = new EventEmitter<{ damage: number; health: number }>();
  @Output() enemyAttack = new EventEmitter<{ damage: number; health: number }>();


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

    if (this.battleCount >= this.maxBattles) {
      this.gameOver = true;
      this.addLogEntry('Gratulacje! Ukończyłeś wszystkie 10 walk!');
      this.addLogEntry('Podsumowanie lootu:');
      this.addLogEntry(this.summarizeLoot());
      return;
    }

    this.lootItems = []; // Usuń loot przed rozpoczęciem nowej rundy
    this.currentEnemy = this.getRandomEnemy();
    this.battleLog = [];
    this.gameOver = false; // Resetuj gameOver na false przy rozpoczęciu nowej walki
    this.battleCount++; // Zwiększ licznik walk
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
      this.playerAttack.emit({ damage: this.player.attack, health: this.currentEnemy.health });

      // Dodaj opóźnienie dla logu, aby zsynchronizować z animacją
      setTimeout(() => {
        if (this.currentEnemy) { // Sprawdź ponownie, czy currentEnemy nie jest null
          this.addLogEntry(
            `${this.player.name} atakuje ${this.currentEnemy.name} za ${this.player.attack} obrażeń. ${this.currentEnemy.name} ma ${Math.max(this.currentEnemy.health, 0)} HP.`
          );
        }
      }, 500); // Opóźnienie 500 ms (dostosuj do czasu animacji)
    }
}

enemyAttacks(): void {
    if (this.currentEnemy) {
      this.player.health -= this.currentEnemy.attack;
      this.enemyAttack.emit({ damage: this.currentEnemy.attack, health: this.player.health });

      // Dodaj opóźnienie dla logu, aby zsynchronizować z animacją
      setTimeout(() => {
        if (this.currentEnemy) { // Sprawdź ponownie, czy currentEnemy nie jest null
          this.addLogEntry(
            `${this.currentEnemy.name} atakuje ${this.player.name} za ${this.currentEnemy.attack} obrażeń. ${this.player.name} ma ${Math.max(this.player.health, 0)} HP.`
          );
        }
      }, 500); // Opóźnienie 500 ms (dostosuj do czasu animacji)
    }
}
endBattle(): void {
  if (this.player.health <= 0) {
    setTimeout(() => {
      this.addLogEntry(`${this.player.name} został pokonany! Koniec gry.`);
      this.gameOver = true;
    }, 1000);
    return;
  }

  if (this.currentEnemy) {
    this.addLogEntry(`${this.player.name} pokonuje ${this.currentEnemy.name}! Zdobywa ${this.currentEnemy.expReward} EXP.`);
    this.player.experience += this.currentEnemy.expReward;

    if (this.currentEnemy.loot) {
      (Array.isArray(this.currentEnemy.loot) ? this.currentEnemy.loot : [this.currentEnemy.loot]).forEach((loot) => {
        if (Math.random() < loot.dropChance) {
          const item = loot.weapon || loot.armor || loot.accessory;
          this.addLogEntry(`Zdobyto przedmiot: ${item}!`);
          this.addLootToPlayer(loot);
          this.lootItems.push(loot);
          this.allLootItems.push(loot); // Add loot to cumulative list
        }
      });
    }

    if (this.player.experience >= this.player.expThreshold) {
      this.levelUp();
    }
  }

  setTimeout(() => {
    if (!this.gameOver) {
      this.startNewBattle();
    }
  }, 1000);
}

  addLootToPlayer(loot: Loot): void {
    if (loot.weapon) this.player.equipment.weapon = loot.weapon;
    if (loot.armor) this.player.equipment.armor = loot.armor;
    if (loot.accessory) this.player.equipment.accessory = loot.accessory;
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
    this.battleCount = 0; // Resetowanie licznika walk
    this.allLootItems = [];
    this.gameOver = false;
    this.startNewBattle();
}

summarizeLoot(): string {
  if (this.lootItems.length === 0) {
    return 'Nie zdobyto żadnego lootu.';
  }

  return this.lootItems
    .map((loot, index) => {
      const item = loot.weapon || loot.armor || loot.accessory;
      return `${index + 1}. ${item} (Szansa dropu: ${(loot.dropChance * 100).toFixed(2)}%)`;
    })
    .join('\n');
}
  
}