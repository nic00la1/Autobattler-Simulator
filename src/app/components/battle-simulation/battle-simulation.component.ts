import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Hero } from '../../classes/hero/Hero';
import { Enemy } from '../../classes/enemy/Enemy';

@Component({
  selector: 'app-battle-simulation',
  templateUrl: './battle-simulation.component.html',
  styleUrls: ['./battle-simulation.component.css'],
})
export class BattleSimulationComponent implements OnChanges {
  @ViewChild('battleCanvas', { static: true }) battleCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() player!: Hero;
  @Input() enemy!: Enemy | null;

  private ctx!: CanvasRenderingContext2D;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player'] || changes['enemy']) {
      this.startAnimation();
    }
  }

  startAnimation(): void {
    if (!this.enemy) return;

    const canvas = this.battleCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    const ctx = this.ctx;

    const player = { x: 100, y: 200, width: 50, height: 50, color: 'blue' };
    const enemy = { x: 600, y: 200, width: 50, height: 50, color: 'red' };

    let playerHealth = this.player.health;
    let enemyHealth = this.enemy.health;

    const attackInterval = 1000; // 1-sekundowe opóźnienie między atakami
    let isPlayerTurn = true;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Draw player name
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this.player.name, player.x + player.width / 2, player.y + player.height + 20);

      // Draw enemy
      ctx.fillStyle = enemy.color;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

      // Draw enemy name
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this.enemy!.name, enemy.x + enemy.width / 2, enemy.y + enemy.height + 20);

      // Draw health bars
      ctx.fillStyle = 'green';
      ctx.fillRect(player.x, player.y - 20, Math.max((playerHealth / this.player.health) * 100, 0), 10);
      ctx.fillRect(enemy.x, enemy.y - 20, Math.max((enemyHealth / this.enemy!.health) * 100, 0), 10);

      // Draw health labels
      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`HP: ${playerHealth}/${this.player.health}`, player.x + player.width / 2, player.y - 25);
      ctx.fillText(`HP: ${enemyHealth}/${this.enemy!.health}`, enemy.x + enemy.width / 2, enemy.y - 25);

      // Stop animation if battle is over
      if (playerHealth <= 0 || enemyHealth <= 0) {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';

        if (playerHealth <= 0 && enemyHealth <= 0) {
          ctx.fillText('Remis!', canvas.width / 2, canvas.height / 2);
        } else if (playerHealth <= 0) {
          ctx.fillText('Przeciwnik wygrywa!', canvas.width / 2, canvas.height / 2);
        } else if (enemyHealth <= 0) {
          ctx.fillText('Gracz wygrywa!', canvas.width / 2, canvas.height / 2);
        }
        return;
      }

      requestAnimationFrame(animate);
    };

    const simulateBattle = () => {
      if (playerHealth > 0 && enemyHealth > 0) {
        if (isPlayerTurn) {
          enemyHealth = Math.max(enemyHealth - this.player.attack, 0); // Atak gracza
        } else {
          playerHealth = Math.max(playerHealth - this.enemy!.attack, 0); // Atak przeciwnika
        }
        isPlayerTurn = !isPlayerTurn; // Zmiana tury
        setTimeout(simulateBattle, attackInterval); // Opóźnienie kolejnego ataku
      }
    };

    animate();
    simulateBattle();
  }
}