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

    const player = { 
      x: 100, 
      y: 200, 
      width: 50, 
      height: 50, 
      color: this.player.className === 'Warrior' ? 'blue' : 'purple' // Warrior: Blue, Mage: Purple
    };
    
    const enemy = { x: 600, y: 200, width: 50, height: 50, color: 'red' };

    let playerHealth = this.player.health;
    let enemyHealth = this.enemy.health;

    // Store maximum health values
    const maxPlayerHealth = this.player.health;
    const maxEnemyHealth = this.enemy.health;

    const attackInterval = 1000; // 1-second delay between attacks
    let isPlayerTurn = true;

    const confetti: { x: number; y: number; color: string }[] = [];

    const generateConfetti = () => {
      for (let i = 0; i < 100; i++) {
        confetti.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        });
      }
    };

    const drawConfetti = () => {
      confetti.forEach((piece) => {
        ctx.fillStyle = piece.color;
        ctx.fillRect(piece.x, piece.y, 5, 5);
        piece.y += 2; // Move confetti downward
        if (piece.y > canvas.height) piece.y = 0; // Reset confetti position
      });
    };

    const drawCrown = (x: number, y: number) => {
      ctx.fillStyle = 'gold';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 10, y - 20);
      ctx.lineTo(x + 20, y);
      ctx.lineTo(x + 30, y - 20);
      ctx.lineTo(x + 40, y);
      ctx.closePath();
      ctx.fill();
    };

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
      ctx.fillText(`(${this.player.className})`, player.x + player.width / 2, player.y + player.height + 40);

      // Draw enemy
      ctx.fillStyle = enemy.color;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

      // Draw enemy name
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this.enemy!.name, enemy.x + enemy.width / 2, enemy.y + enemy.height + 20);

      // Ensure health values are not below zero
      const clampedPlayerHealth = Math.max(playerHealth, 0);
      const clampedEnemyHealth = Math.max(enemyHealth, 0);

      // Draw health bars
      ctx.fillStyle = 'green';
      ctx.fillRect(player.x, player.y - 20, Math.max((clampedPlayerHealth / maxPlayerHealth) * 100, 0), 10);
      ctx.fillRect(enemy.x, enemy.y - 20, Math.max((clampedEnemyHealth / maxEnemyHealth) * 100, 0), 10);

      // Draw health labels
      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`HP: ${clampedPlayerHealth}/${maxPlayerHealth}`, player.x + player.width / 2, player.y - 25);
      ctx.fillText(`HP: ${clampedEnemyHealth}/${maxEnemyHealth}`, enemy.x + enemy.width / 2, enemy.y - 25);

      // Draw confetti if battle is over
      if (playerHealth <= 0 || enemyHealth <= 0) {
        drawConfetti();

        if (playerHealth > 0) {
          drawCrown(player.x + player.width / 2 - 20, player.y - 40); // Crown for player
        } else if (enemyHealth > 0) {
          drawCrown(enemy.x + enemy.width / 2 - 20, enemy.y - 40); // Crown for enemy
        }

        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
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
          // Player attacks
          const originalX = player.x;
          const attackX = player.x + 50;

          // Animate player attack
          const attackAnimation = setInterval(() => {
            player.x += 5;
            if (player.x >= attackX) {
              clearInterval(attackAnimation);
              enemyHealth = Math.max(enemyHealth - this.player.attack, 0); // Apply damage
              player.x = originalX; // Reset position
              isPlayerTurn = false;
              setTimeout(simulateBattle, attackInterval);
            }
          }, 30);
        } else {
          // Enemy attacks
          const originalX = enemy.x;
          const attackX = enemy.x - 50;

          // Animate enemy attack
          const attackAnimation = setInterval(() => {
            enemy.x -= 5;
            if (enemy.x <= attackX) {
              clearInterval(attackAnimation);
              playerHealth = Math.max(playerHealth - this.enemy!.attack, 0); // Apply damage
              enemy.x = originalX; // Reset position
              isPlayerTurn = true;
              setTimeout(simulateBattle, attackInterval);
            }
          }, 30);
        }
      } else {
        // Generate confetti and end battle
        generateConfetti();
      }
    };

    animate();
    simulateBattle();
  }
}