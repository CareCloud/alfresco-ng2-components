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

import { Component } from '@angular/core';
import { BaseComponent } from './base-icon.component';

@Component({
    selector: 'diagram-icon-receive-task',
    templateUrl: './diagram-icon-receive-task.component.html'
})
export class DiagramIconReceiveTaskComponent extends BaseComponent {

    constructor(public elementRef: ElementRef,
                private diagramColorService: DiagramColorService) {
        super(elementRef, diagramColorService);
    }

    public ngOnInit(): void {
        this.position = {x: this.data.x + 4, y: this.data.y + 2};
        this.options.stroke = 'none' ;
        this.options.fillColors = '#16964d' ;
    }
}
