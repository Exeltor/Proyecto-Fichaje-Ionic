import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { StepperComponent } from './stepper.component';


@NgModule({
  declarations: [StepperComponent],
  imports: [
    CdkStepperModule,
    CommonModule
  ],
  exports: [StepperComponent]
})
export class StepperModule { }
