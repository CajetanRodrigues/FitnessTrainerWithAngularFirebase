import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import { StopTrainingComponent } from './stop-training.component';
import {ExerciseService} from "../exercise.service";

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;
  timer : number;
  step : number;
  id : number;
  name : string;
  duration : number;
  calories : number;
  constructor(private dialog: MatDialog , private  exerciseService : ExerciseService) {}

  ngOnInit() {
    this.startOrResumeTimer();
    this.id = this.exerciseService.getRunningExercise().id
    this.name = this.exerciseService.getRunningExercise().name
    this.duration = this.exerciseService.getRunningExercise().duration
    this.calories = this.exerciseService.getRunningExercise().calories

  }

  startOrResumeTimer() {
    this.step = this.exerciseService.getRunningExercise().duration / 100 *1000;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        this.exerciseService.completeExercise();
        clearInterval(this.timer);
      }
    }, this.step);
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });
    // subscribe the data from the dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.exerciseService.cancelExercise(this.progress)
      } else {
        this.exerciseService.completeExercise();
      }
    });
  }
}
