/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ContentLinkModel, FormFieldValidator, FormModel, FormOutcomeEvent } from 'ng2-activiti-form';
import { AlfrescoAuthenticationService, CardViewUpdateService, ClickNotification, LogService, UpdateNotification } from 'ng2-alfresco-core';
import { LightUserRepresentation, PeopleProcessService } from 'ng2-alfresco-core';
import { Observable, Observer } from 'rxjs/Rx';
import { TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListService } from './../services/tasklist.service';
import { CommentsComponent } from './comments.component';

declare var require: any;

@Component({
    selector: 'adf-task-details, activiti-task-details',
    templateUrl: './task-details.component.html',
    styleUrls: ['./task-details.component.scss'],
    providers: [
        CardViewUpdateService
    ]
})
export class TaskDetailsComponent implements OnInit, OnChanges {

    @ViewChild('activiticomments')
    activiticomments: CommentsComponent;

    @ViewChild('activitichecklist')
    activitichecklist: any;

    @ViewChild('errorDialog')
    errorDialog: TemplateRef<any>;

    @Input()
    debugMode: boolean = false;

    @Input()
    taskId: string;

    @Input()
    showNextTask: boolean = true;

    @Input()
    showHeader: boolean = true;

    @Input()
    showHeaderContent: boolean = true;

    @Input()
    showInvolvePeople: boolean = true;

    @Input()
    showComments: boolean = true;

    @Input()
    showChecklist: boolean = true;

    @Input()
    showFormTitle: boolean = true;

    @Input()
    showFormCompleteButton: boolean = true;

    @Input()
    showFormSaveButton: boolean = true;

    @Input()
    readOnlyForm: boolean = false;

    @Input()
    showFormRefreshButton: boolean = true;

    @Input()
    peopleIconImageUrl: string = require('../assets/images/user.jpg');

    @Input()
    fieldValidators: FormFieldValidator[] = [];

    @Output()
    formSaved: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formCompleted: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter<ContentLinkModel>();

    @Output()
    formLoaded: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    taskCreated: EventEmitter<TaskDetailsModel> = new EventEmitter<TaskDetailsModel>();

    @Output()
    taskDeleted: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    executeOutcome: EventEmitter<FormOutcomeEvent> = new EventEmitter<FormOutcomeEvent>();

    @Output()
    assignTask: EventEmitter<void> = new EventEmitter<void>();

    taskDetails: TaskDetailsModel;
    taskFormName: string = null;

    taskPeople: LightUserRepresentation[] = [];

    noTaskDetailsTemplateComponent: TemplateRef<any>;

    showAssignee: boolean = false;

    private peopleSearchObserver: Observer<LightUserRepresentation[]>;
    public errorDialogRef: MdDialogRef<TemplateRef<any>>;

    peopleSearch$: Observable<LightUserRepresentation[]>;

    constructor(private activitiTaskList: TaskListService,
                private authService: AlfrescoAuthenticationService,
                private peopleProcessService: PeopleProcessService,
                private logService: LogService,
                private cardViewUpdateService: CardViewUpdateService,
                private dialog: MdDialog) {
        this.peopleSearch$ = new Observable<LightUserRepresentation[]>(observer => this.peopleSearchObserver = observer).share();
    }

    ngOnInit() {
        if (this.taskId) {
            this.loadDetails(this.taskId);
        }

        this.cardViewUpdateService.itemUpdated$.subscribe(this.updateTaskDetails.bind(this));
        this.cardViewUpdateService.itemClicked$.subscribe(this.clickTaskDetails.bind(this));
    }

    ngOnChanges(changes: SimpleChanges): void {
        let taskId = changes.taskId;
        this.showAssignee = false;

        if (taskId && !taskId.currentValue) {
            this.reset();
        } else if (taskId && taskId.currentValue) {
            this.taskFormName = null;
            this.loadDetails(taskId.currentValue);
        }
    }

    /**
     * Reset the task details
     */
    private reset() {
        this.taskDetails = null;
    }

    /**
     * Check if the task has a form
     * @returns {TaskDetailsModel|string|boolean}
     */
    hasFormKey() {
        return (this.taskDetails
        && this.taskDetails.formKey
        && this.taskDetails.formKey !== 'null');
    }

    isTaskActive() {
        return this.taskDetails && this.taskDetails.duration === null;
    }

    /**
     * Save a task detail and update it after a successful response
     *
     * @param updateNotification
     */
    private updateTaskDetails(updateNotification: UpdateNotification) {
        this.activitiTaskList.updateTask(this.taskId, updateNotification.changed)
            .subscribe(
                () => {
                    this.loadDetails(this.taskId);
                }
            );
    }

    private clickTaskDetails(clickNotification: ClickNotification) {
        if (clickNotification.target.key === 'assignee') {
            this.showAssignee = true;
        }
    }

    /**
     * Load the activiti task details
     * @param taskId
     */
    private loadDetails(taskId: string) {
        this.taskPeople = [];
        this.readOnlyForm = false;

        if (taskId) {
            this.activitiTaskList.getTaskDetails(taskId).subscribe(
                (res: TaskDetailsModel) => {
                    this.taskDetails = res;

                    if (this.taskDetails.name === 'null') {
                        this.taskDetails.name = 'No name';
                    }

                    let endDate: any = res.endDate;
                    this.readOnlyForm = this.readOnlyForm ? this.readOnlyForm : !!(endDate && !isNaN(endDate.getTime()));
                    if (this.taskDetails && this.taskDetails.involvedPeople) {
                        this.taskDetails.involvedPeople.forEach((user) => {
                            this.taskPeople.push(new LightUserRepresentation(user));
                        });
                    }
                });
        }
    }

    isAssigned(): boolean {
        return this.taskDetails.assignee ? true : false;
    }

    isAssignedToMe(): boolean {
        return this.taskDetails.assignee.email === this.authService.getBpmUsername();
    }

    /**
     * Retrieve the next open task
     * @param processInstanceId
     * @param processDefinitionId
     */
    private loadNextTask(processInstanceId: string, processDefinitionId: string): void {
        let requestNode = new TaskQueryRequestRepresentationModel(
            {
                processInstanceId: processInstanceId,
                processDefinitionId: processDefinitionId
            }
        );
        this.activitiTaskList.getTasks(requestNode).subscribe(
            (response) => {
                if (response && response.length > 0) {
                    this.taskDetails = new TaskDetailsModel(response[0]);
                } else {
                    this.reset();
                }
            }, (error) => {
                this.onError.emit(error);
            });
    }

    /**
     * Complete button clicked
     */
    onComplete(): void {
        this.activitiTaskList.completeTask(this.taskId).subscribe(
            (res) => this.onFormCompleted(null)
        );
    }

    onFormContentClick(content: ContentLinkModel): void {
        this.formContentClicked.emit(content);
    }

    onFormSaved(form: FormModel): void {
        this.formSaved.emit(form);
    }

    onFormCompleted(form: FormModel): void {
        this.formCompleted.emit(form);
        if (this.showNextTask && (this.taskDetails.processInstanceId || this.taskDetails.processDefinitionId)) {
            this.loadNextTask(this.taskDetails.processInstanceId, this.taskDetails.processDefinitionId);
        }
    }

    onFormLoaded(form: FormModel): void {
        this.taskFormName = (form && form.name ? form.name : null);
        this.formLoaded.emit(form);
    }

    onChecklistTaskCreated(task: TaskDetailsModel): void {
        this.taskCreated.emit(task);
    }

    onChecklistTaskDeleted(taskId: string): void {
        this.taskDeleted.emit(taskId);
    }

    onFormError(error: any): void {
        this.errorDialogRef = this.dialog.open(this.errorDialog, { width: '500px' });
        this.onError.emit(error);
    }

    onFormExecuteOutcome(event: FormOutcomeEvent): void {
        this.executeOutcome.emit(event);
    }

    closeErrorDialog(): void {
        this.dialog.closeAll();
    }

    onClaimAction(taskId: string): void {
        this.loadDetails(taskId);
    }

    toggleHeaderContent(): void {
        this.showHeaderContent = !this.showHeaderContent;
    }

    isCompletedTask(): boolean {
        return this.taskDetails && this.taskDetails.endDate ? true : undefined;
    }

    searchUser(searchedWord: string) {
        this.peopleProcessService.getWorkflowUsers(null, searchedWord)
            .subscribe((users) => {
                users = users.filter((user) => user.id !== this.taskDetails.assignee.id);
                this.peopleSearchObserver.next(users);
            }, error => this.logService.error('Could not load users'));
    }

    onCloseSearch() {
        this.showAssignee = false;
    }

    assignTaskToUser(selectedUser: LightUserRepresentation) {
        this.activitiTaskList.assignTask(this.taskDetails.id, selectedUser).subscribe(
            (res: any) => {
                this.logService.info('Task Assigned to ' + selectedUser.email);
                this.assignTask.emit();
            });
        this.showAssignee = false;
    }

    getTaskHeaderViewClass() {
        if (this.showAssignee) {
            return 'assign-edit-view';
        } else {
            return 'default-view';
        }
    }
}
