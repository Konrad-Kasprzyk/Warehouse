import { Module } from "@nestjs/common";
import { TaskManager } from "./Service/task-manager.service";

@Module({
  controllers: [],
  providers: [TaskManager],
  exports: [TaskManager],
})
export class DomainModule {}
