export interface  ExerciseModel {
  id : number;
  name : string;
  duration : number;
  calories : number ;
  date ?: Date;
  state ?: 'completed' | 'cancelled' | null

}
