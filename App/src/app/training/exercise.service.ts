import {ExerciseModel} from "./exercise.model";
import {Subject} from "rxjs/Subject";


export class ExerciseService{

  // Beans class
  private availableExcercises : ExerciseModel[] = [
    {id : 1 , name : 'squats', duration : 10, calories : 100},
    {id : 2, name : 'push ups', duration : 30, calories : 150},
    {id : 3 , name : 'hand stand', duration : 8, calories : 60}
  ];
  private completedExercises : ExerciseModel[] = [];
  private  runningExercise : ExerciseModel;
   exerciseChanged = new Subject();

  getExercises(){
    return this.availableExcercises.slice(); // returns exact copy of array
  }
  onStartTraining(selectedId : number){
    // find method here works same like predicate interface in java
    this.runningExercise = this.availableExcercises.find(ex => ex.id == selectedId);
    this.exerciseChanged.next({...this.runningExercise})
  }
  getRunningExercise()
  {
    return {...this.runningExercise}
  }
  completeExercise(){
    this.completedExercises.push({
      ...this.runningExercise ,
      date: new Date() ,
      state: 'completed'})
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }
  cancelExercise(progress : number){
    this.completedExercises.push({
      ...this.runningExercise ,
      duration : this.runningExercise.duration * (progress/100),
      calories : this.runningExercise.duration * (progress/100),
      date: new Date() ,
      state: 'cancelled'})
    this.runningExercise = null;
    this.exerciseChanged.next(null);

  }
  getCompletedOrCancelledExcercises()
  {
    return this.completedExercises.slice();
  }
}
