import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ConvsMgrAssessmentsModule } from '@app/features/convs-mgr/conversations/assessments';

import { QuestionBankListComponent } from './components/question-bank-list/question-bank-list.component';
import { QuestionBankHeaderComponent } from './components/question-bank-header/question-bank-header.component';
import { QuestionBankRouterModule } from './question-banks.router.module';
import { QuestionBankQuestionFormComponent } from './components/question-bank-question-form/question-bank-question-form.component';
import {
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuestionBankMediaUploadComponent } from './components/question-bank-media-upload/question-bank-media-upload.component';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';
import { QuestionCardComponent } from './components/question-card/question-card.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MultiLangModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialBricksModule,
    MaterialDesignModule,
    FormsModule,

    QuestionBankRouterModule,
    ConvlPageModule,

    ConvsMgrAssessmentsModule,
  ],
  declarations: [
    QuestionBankListComponent,
    QuestionBankHeaderComponent,
    QuestionBankQuestionFormComponent,
    QuestionBankMediaUploadComponent,
    QuestionCardComponent,
  ],
  providers: [AssessmentQuestionBankStore],
})
export class QuestionBanksModule {}
