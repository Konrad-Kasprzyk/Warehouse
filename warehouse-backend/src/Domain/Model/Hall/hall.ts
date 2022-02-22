import { Employee } from "../Employee/employee";
import { Product } from "../Product/product";
import { Task } from "../Task/task";
import { Shelf } from "./shelf";

/** Store single hall information, working employees inside, tasks, shelves and products. */
export class Hall {
  /**
   * @throws Hall number is missing or below zero.
   */
  constructor(number: number) {
    if (!number || number < 0) throw new Error("Hall number is missing or below zero.");
    this.Number = number;
  }
  readonly id: number;
  /** Unique number of this hall */
  readonly Number: number;
  /** Employees working inside this hall. */
  Employees: Employee[];
  Shelves: Shelf[];
  Products: Product[];
  /** Task is contained in only one hall. */
  Tasks: Task[];
}
