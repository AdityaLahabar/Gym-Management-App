import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.css',
})
export class WorkoutComponent {
  constructor(public authService: AuthService) {}
  weeklyWorkout = [
    {
      day: 'Monday',
      image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      exercises: [
        { name: 'Chest Press', reps: '4 sets of 12 reps' },
        { name: 'Incline Dumbbell Press', reps: '3 sets of 10 reps' },
        { name: 'Push Ups', reps: '3 sets to failure' },
      ],
    },
    {
      day: 'Tuesday',
      image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
      exercises: [
        { name: 'Squats', reps: '4 sets of 10 reps' },
        { name: 'Lunges', reps: '3 sets of 12 reps' },
        { name: 'Leg Press', reps: '3 sets of 10 reps' },
      ],
    },
    {
      day: 'Wednesday',
      image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg',
      exercises: [{ name: 'Rest Day / Active Stretching', reps: '' }],
    },
    {
      day: 'Thursday',
      image: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg',
      exercises: [
        { name: 'Back Rows', reps: '4 sets of 10 reps' },
        { name: 'Pull-Ups', reps: '3 sets to failure' },
        { name: 'Deadlifts', reps: '3 sets of 6 reps' },
      ],
    },
    {
      day: 'Friday',
      image: 'https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg',
      exercises: [
        { name: 'Shoulder Press', reps: '4 sets of 10 reps' },
        { name: 'Lateral Raises', reps: '3 sets of 12 reps' },
        { name: 'Shrugs', reps: '3 sets of 15 reps' },
      ],
    },
    {
      day: 'Saturday',
      image: 'https://images.pexels.com/photos/4752861/pexels-photo-4752861.jpeg',
      exercises: [
        { name: 'Cardio', reps: '30 minutes running' },
        { name: 'Core Workout', reps: 'Planks, Crunches, Leg Raises' },
      ],
    },
    {
      day: 'Sunday',
      image: 'https://images.pexels.com/photos/917732/pexels-photo-917732.jpeg',
      exercises: [{ name: 'Rest or Yoga', reps: '' }],
    },
  ];
}
