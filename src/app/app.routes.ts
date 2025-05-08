import { Routes } from '@angular/router';
import { CharacterCreationComponent } from './components/character-creation/character-creation.component';
import { GameComponent } from './components/game/game.component';

export const routes: Routes = [
    { path: '', component: CharacterCreationComponent }, // Ekran tworzenia postaci
    { path: 'game', component: GameComponent }, // Ekran gry
];
