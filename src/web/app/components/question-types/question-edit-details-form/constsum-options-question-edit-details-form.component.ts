import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component } from "@angular/core";
import { StatusMessageService } from "../../../../services/status-message.service";
import {
  FeedbackConstantSumDistributePointsType,
  FeedbackConstantSumQuestionDetails,
} from "../../../../types/api-output";
import { DEFAULT_CONSTSUM_OPTIONS_QUESTION_DETAILS } from "../../../../types/default-question-structs";
import { QuestionEditDetailsFormComponent } from "./question-edit-details-form.component";

/**
 * Question details edit form component for constsum options question.
 */
@Component({
  selector: "tm-constsum-options-question-edit-details-form",
  templateUrl: "./constsum-options-question-edit-details-form.component.html",
  styleUrls: [
    "./constsum-options-question-edit-details-form.component.scss",
    "./cdk-drag-drop.scss",
  ],
})
export class ConstsumOptionsQuestionEditDetailsFormComponent extends QuestionEditDetailsFormComponent<FeedbackConstantSumQuestionDetails> {
  uniqueId = Math.random().toString(36).substring(2);

  get radioGroupName(): string {
    return `constsum-radio-${this.uniqueId}`;
  }
  // enum
  FeedbackConstantSumDistributePointsType: typeof FeedbackConstantSumDistributePointsType =
    FeedbackConstantSumDistributePointsType;

  constructor(private statusMessageService: StatusMessageService) {
    super(DEFAULT_CONSTSUM_OPTIONS_QUESTION_DETAILS());
  }

  get hasMaxPoint(): boolean {
    return this.model.maxPoint !== undefined;
  }

  get hasMinPoint(): boolean {
    return this.model.minPoint !== undefined;
  }

  /**
   * Increases number of Constsum options.
   */
  increaseNumberOfConstsumOptions(): void {
    const newOptions: string[] = this.model.constSumOptions.slice();
    newOptions.push("");

    this.triggerModelChangeBatch({
      constSumOptions: newOptions,
    });
  }

  /**
   * Reorders the list on dragging the Constsum options.
   */
  onConstsumOptionDropped(event: CdkDragDrop<string[]>): void {
    if (!this.isEditable) {
      return;
    }

    const newOptions: string[] = this.model.constSumOptions.slice();
    moveItemInArray(newOptions, event.previousIndex, event.currentIndex);

    this.triggerModelChange("constSumOptions", newOptions);
  }

  /**
   * Tracks the Constsum option by index.
   */
  trackConstsumOption(index: number): string {
    return index.toString();
  }

  /**
   * Deletes a Constsum option.
   */
  onConstsumOptionDeleted(event: number): void {
    if (this.model.constSumOptions.length <= 2) {
      this.statusMessageService.showErrorToast(
        "There must be at least one option."
      );
      return;
    }

    const newOptions: string[] = this.model.constSumOptions.slice();
    newOptions.splice(event, 1);

    this.triggerModelChangeBatch({
      constSumOptions: newOptions,
    });
  }

  /**
   * Changes new Constsum option at specified index.
   */
  onConstsumOptionEntered(event: string, index: number): void {
    const newOptions: string[] = this.model.constSumOptions.slice();
    newOptions[index] = event;

    this.triggerModelChange("constSumOptions", newOptions);
  }

  /**
   * Changes force uneven distribution option.
   */
  onForceUnevenDistribution(event: boolean): void {
    this.triggerModelChangeBatch({
      forceUnevenDistribution: event,
      distributePointsFor: event
        ? FeedbackConstantSumDistributePointsType.DISTRIBUTE_ALL_UNEVENLY
        : FeedbackConstantSumDistributePointsType.NONE,
    });
  }

  /**
   * Resets maxPoint.
   */
  resetMaxPoint(event: boolean): void {
    if (event) {
      this.triggerModelChange("maxPoint", 0);
    } else {
      this.triggerModelChange("maxPoint", undefined);
    }
  }

  /**
   * Resets minPoint.
   */
  resetMinPoint(event: boolean): void {
    if (event) {
      this.triggerModelChange("minPoint", 0);
    } else {
      this.triggerModelChange("minPoint", undefined);
    }
  }
}
