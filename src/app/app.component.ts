import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Autobattler-Simulator';
  showCharacterCreation = true; // Flag to control visibility of character creation component
  playerName: string = ''; // Player's name to be passed to the game component

  onCharacterCreated(name: string): void {
    this.playerName = name;
    this.showCharacterCreation = false; // Hide character creation after name is set
  }
  onBackToCharacterCreation(): void {
    this.showCharacterCreation = true; // Show character creation again
    this.playerName = ''; // Reset player name  
  }

  onGameOver(): void {
    this.showCharacterCreation = true; // Show character creation again
    this.playerName = ''; // Reset player name
  }
}
