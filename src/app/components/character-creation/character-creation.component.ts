import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-character-creation',
  imports: [FormsModule],
  templateUrl: './character-creation.component.html',
  styleUrl: './character-creation.component.css'
})
export class CharacterCreationComponent {
  characterName: string = '';
  characterClass: string = 'Warrior';

  private gameService = inject(GameService);
  private router = inject(Router);

  onSubmit(): void {
    if (this.characterName.trim() === '') {
      alert('Wpisz prawidłową nazwę postaci.');
      return;
    }

    this.gameService.createCharacter(this.characterName, this.characterClass);
    alert(`Postać ${this.characterName} stworzona jako ${this.characterClass}!`);

    // Redirect to the game screen
    this.router.navigate(['/game']);
  }
}