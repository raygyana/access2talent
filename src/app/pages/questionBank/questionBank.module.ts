import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './questionBank.routing';
import { FormsModule } from '@angular/forms';
import { TopbarComponent } from './topbar/topbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomModalPopUpService } from '../../../component/custom-modal-pop-up/custom-modal-pop-up.service';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionBankComponent } from './question-bank/question-bank.component';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb.component';

@NgModule({
    imports: [
        CommonModule,
        routing,
        FormsModule,

    ],
    declarations: [
        TopbarComponent,
        DashboardComponent,
        QuestionsComponent,
        QuestionBankComponent,
        BreadCrumbComponent
    ],
    providers: [
        CustomModalPopUpService

    ],
    exports: [
        FormsModule
    ]
})
export class QuestionBankModule { }
