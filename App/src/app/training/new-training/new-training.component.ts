import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {ExerciseService} from "../exercise.service";
import {ExerciseModel} from "../exercise.model";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
   availableExercises: ExerciseModel[] = [];

  constructor(private exerciseService : ExerciseService  ) {

  }

  ngOnInit() {

      this.availableExercises = this.exerciseService.getExercises();
  }

  onStartTraining(selectedId : NgForm) {
    this.exerciseService.onStartTraining(selectedId.value.exercise);
  }

}
