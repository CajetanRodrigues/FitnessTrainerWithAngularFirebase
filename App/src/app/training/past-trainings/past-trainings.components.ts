import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ExerciseService} from "../exercise.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {ExerciseModel} from "../exercise.model";

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit , AfterViewInit{
  displayedColumns: string[] = ['date', 'name', 'calories', 'duration','state'];
  dataSource = new MatTableDataSource<ExerciseModel>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private exerciseService : ExerciseService) { }

  ngOnInit() {
    this.dataSource.data = this.exerciseService.getCompletedOrCancelledExcercises();
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
