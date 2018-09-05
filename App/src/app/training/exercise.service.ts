import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';

import { ExerciseModel } from './exercise.model';
import "rxjs-compat/add/operator/map";

@Injectable()
  export class TrainingService {
  exerciseChanged = new Subject<ExerciseModel>();
  exercisesChanged = new Subject<ExerciseModel[]>(); // Bridge between past-training and service
  finishedExercisesChanged = new Subject<ExerciseModel[]>();
  private availableExercises: ExerciseModel[] = []; // Fetch data from database into availExer.
  private runningExercise: ExerciseModel; // Bridge between newExer compo and currExerCompo
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories
          };
        });
      })
      .subscribe((exercises: ExerciseModel[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      }));
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() { //This function and below function are similar
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise }; // ReStructure into JSON data
  }

  fetchCompletedOrCancelledExercises() { // Fetch the data from database and store it in the
    // local Subscription array and pass it to past-training
    this.fbSubs.push(this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: ExerciseModel[]) => {
        this.finishedExercisesChanged.next(exercises);
      }));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: ExerciseModel) {
    this.db.collection('finishedExercises').add(exercise); //
    // Adds all past exercises in the same collection named as finishedExercises
  }
}
