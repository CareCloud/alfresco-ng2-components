# Activiti Form component

The component shows a Form from Activiti (see it live: [Form Quickstart](https://embed.plnkr.co/YSLXTqb3DtMhVJSqXKkE/))

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Advanced properties](#advanced-properties)
  * [Events](#events)
- [Details](#details)
  * [Custom empty form template](#custom-empty-form-template)
  * [Controlling outcome execution behaviour](#controlling-outcome-execution-behaviour)
  * [Form Field Validators](#form-field-validators)
    + [Custom set of validators](#custom-set-of-validators)
    + [Custom validator example](#custom-validator-example)
- [Other documentation](#other-documentation)
  * [Common scenarios](#common-scenarios)
    + [Changing field value based on another field](#changing-field-value-based-on-another-field)
    + [Listen all form Events](#listen-all-form-events)
- [See also](#see-also)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-form 
    [taskId]="taskId">
</adf-form>
```

**Display form instance by task id:**

```html
<adf-form 
    [taskId]="selectedTask?.id">
</adf-form>
```

For an existing Task both form and values will be fetched and displayed.

**Display form definition by form id:**

```html
<adf-form 
    [formId]="selectedFormDefinition?.id"
    [data]="customData">
</adf-form>
```

Only form definition will be fetched.

**Display form definition by form name:**

```html
<adf-form 
    [formName]="selectedFormDefinition?.name"
    [data]="customData">
</adf-form>
```

**Display form definition by ECM nodeId:**

In this case the metadata of the node are showed in an activiti Form.
If there is no form definied in activiti for the type of the node,
a new form will be automaticaly created in Activiti.

```html
<adf-form 
    [nodeId]="'e280be3a-6584-45a1-8bb5-89bfe070262e'">
</adf-form>
```

**Display form definition by form name, and store the form field as metadata:**

The param nameNode is optional.

```html
<adf-form 
    [formName]="'activitiForms:patientFolder'"
    [saveMetadata]="true"
    [path]="'/Sites/swsdp/documentLibrary'"
    [nameNode]="'test'">
</adf-form>
```

**Display form definition by ECM nodeId:**

In this case the metadata of the node are shown in an activiti Form,
and store the form field as metadata. The param nameNode is optional.

```html
<adf-form 
    [nodeId]="'e280be3a-6584-45a1-8bb5-89bfe070262e'"
    [saveMetadata]="true"
    [path]="'/Sites/swsdp/documentLibrary'"
    [nameNode]="'test'">
</adf-form>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| taskId | string | | Task id to fetch corresponding form and values. |
| formId | string | | The id of the form definition to load and display with custom values. |
| formName | string | | Name of the form definition to load and display with custom values. |
| data | FormValues | | Custom form values map to be used with the rendered form. |
| showTitle | boolean | true | Toggle rendering of the form title. |
| showCompleteButton | boolean | true | Toggle rendering of the `Complete` outcome button. |
| disableCompleteButton | boolean | false | The `Complete` outcome button is shown but it will be disabled. |
| showSaveButton | boolean | true | Toggle rendering of the `Save` outcome button. |
| readOnly | boolean | false | Toggle readonly state of the form. Enforces all form widgets render readonly if enabled. |
| showRefreshButton | boolean | true | Toggle rendering of the `Refresh` button. |
| showValidationIcon | boolean | true | Toggle rendering of the validation icon next form title. |
| saveMetadata | boolean | false | Store the value of the form as metadata. |
| path | string |  |  Path of the folder where to store the metadata. |
| nameNode | string | true | Name to assign to the new node where the metadata are stored. |
| fieldValidators | FormFieldValidator[] | See [Form Field Validators](#form-field-validators) section below | Contains a list of form field validator instances. |

### Advanced properties

 The following properties are for complex customisation purposes:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| form | FormModel | | Underlying form model instance. |
| showDebugButton | boolean | false | Toggle debug options. |
| debugMode | boolean | false | Toggle debug mode, allows displaying additional data for development and debugging purposes. |

### Events

| Name |  Return Type | Description |
| --- | --- | --- |
| formLoaded | [FormModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form.model.ts) | Invoked when form is loaded or reloaded. |
| formSaved | [FormModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form.model.ts)  | Invoked when form is submitted with `Save` or custom outcomes.  |
| formCompleted | [FormModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form.model.ts)  | Invoked when form is submitted with `Complete` outcome.  |
| formDataRefreshed | [FormModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form.model.ts) | Invoked when form values are refreshed due to a data property change  |
| executeOutcome | [FormOutcomeEvent](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form-outcome-event.model.ts) | Invoked when any outcome is executed, default behaviour can be prevented via `event.preventDefault()` |
| onError | any | Invoked at any error |

## Details

All `form*` events receive an instance of the `FormModel` as event argument for ease of development:

**MyView.component.html**

```html
<adf-form
    [taskId]="selectedTask?.id"
    (formSaved)="onFormSaved($event)">
</adf-form>
```

**MyView.component.ts**

```ts
onFormSaved(form: FormModel) {
    console.log(form);
}
```

### Custom empty form template

You can add a template that will be show if no form definition has been found

```html
<adf-form .... >

    <div empty-form >
        <h2>Empty form</h2>
    </div>

</adf-form>

```

### Controlling outcome execution behaviour

If absolutely needed it is possible taking full control over form outcome execution by means of `executeOutcome` event.
This event is fired upon each outcome execution, both system and custom ones.

You can prevent default behaviour by calling `event.preventDefault()`.
This allows for example having custom form validation scenarios and/or additional validation summary presentation.

Alternatively you may want just running additional code on outcome execution without suppressing default one.

**MyView.component.html**

```html
<adf-form
    [taskId]="selectedTask?.id"
    executeOutcome="validateForm($event)">
</adf-form>
```

**MyView.component.ts**

```ts
import { FormOutcomeEvent } from 'ng2-activiti-form';

export class MyView {

    validateForm(event: FormOutcomeEvent) {
        let outcome = event.outcome;

        // you can also get additional properties of outcomes
        // if you defined them within outcome definition

        if (outcome) {
            let form = outcome.form;
            if (form) {
                // check/update the form here
                event.preventDefault();
            }
        }
    }

}
```

There are two additional functions that can be of a great value when controlling outcomes:

- `saveTaskForm()` - saves current form
- `completeTaskForm(outcome?: string)` - save and complete form with a given outcome name

**Please note that if `event.preventDefault()` is not called then default outcome behaviour
will also be executed after your custom code.**

### Form Field Validators

The Form component provides you with access to all Form Field validators. By default the following instances are created automatically:

- RequiredFieldValidator
- NumberFieldValidator
- MinLengthFieldValidator
- MaxLengthFieldValidator
- MinValueFieldValidator
- MaxValueFieldValidator
- RegExFieldValidator
- DateFieldValidator
- MinDateFieldValidator
- MaxDateFieldValidator

If needed, you can completely redefine the set of validators used by the form.

All changes to `fieldValidators` collection are automatically applied to all the further validation cycles.

#### Custom set of validators

You can provide your own set of field validators based on either custom validator instances, or a mixture of default and custom ones.

```html
<adf-form [fieldValidators]="fieldValidators"></adf-form>
```

The Form component exposes a special `FORM_FIELD_VALIDATORS` constant that allows you get a quick access to all system validator instances.

```ts
import { FORM_FIELD_VALIDATORS } from 'ng2-activiti-form';

@Component({...})
export class AppComponent {

    fieldValidators = [
        // default set of ADF validators if needed
        ...FORM_FIELD_VALIDATORS,

        // custom validators
        new MyValidator1(),
        new MyValidator2()
    ];

}
```

#### Custom validator example

A form field validator must implement the "FormFieldValidator" interface:

```ts
export interface FormFieldValidator {

    isSupported(field: FormFieldModel): boolean;
    validate(field: FormFieldModel): boolean;

}
```

There might be many different validators used for various field types and purposes,
so the validation layer needs every validator instance to support "isSupported" call.

It is up to validator to declare support for a form field.
If you want to check field types the [FormFieldTypes](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form-field-types.ts) class can help you with the predefined constants and helper methods.

In addition every validator has access to all underlying APIs of the [FormFieldModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-form/src/components/widgets/core/form-field.model.ts),
including the reference to the Form instance and so other form fields.

Below is a source code for a demo validator that is executed for all the "TEXT" fields, and ensures the value is not "admin", otherwise the `field.validationSummary` value is set to an error.

```ts
import { FormFieldModel, FormFieldTypes, FormFieldValidator } from 'ng2-activiti-form';

export class DemoFieldValidator implements FormFieldValidator {

    isSupported(field: FormFieldModel): boolean {
        return field && field.type === FormFieldTypes.TEXT;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field)) {
            if (field.value && field.value.toLowerCase() === 'admin') {
                field.validationSummary = 'Sorry, the value cannot be "admin".';
                return false;
            }
        }
        return true;
    }

}
```

Your component can extend the default validation set instead of replacing it entirely.
In the example below we redefine a default validation set with an additional "DemoFieldValidator":

```ts
import { DemoFieldValidator } from './demo-field-validator';

@Component({...})
export class AppComponent {

    fieldValidators = [
        ...FORM_FIELD_VALIDATORS,
        new DemoFieldValidator()
    ];

}
```

You can now use the 'fieldValidators' property with the Form or Task Details components to assign custom validator set for the underlying Form Model:

```html
<activiti-task-details
    [fieldValidators]="fieldValidators"
    taskId="123">
</<activiti-task-details>

<!-- OR -->

<adf-form
    [fieldValidators]="fieldValidators"
    taskI="123">
</adf-form>
```

Now if you run the application and try to enter "admin" in one of the text fields (either optional or required), you should see the following error:

![](docassets/images/demo-validator.png)

## Other documentation

### Common scenarios

#### Changing field value based on another field

Create a simple Form with a dropdown widget (id: `type`), and a multiline text (id: `description`).

```ts
formService.formFieldValueChanged.subscribe((e: FormFieldEvent) => {
    if (e.field.id === 'type') {
        const fields: FormFieldModel[] = e.form.getFormFields();
        const description = fields.find(f => f.id === 'description');
        if (description != null) {
            console.log(description);
            description.value = 'Type set to ' + e.field.value;
        }
    }
});
```

You subscribe to the `formFieldValueChanged` event and check whether event is raised for the `type` widget, then you search for a `description` widget and assign its value to some simple text.

The result should be as following:

![](docassets/images/form-service-sample-01.png)

#### Listen all form Events

If you want to listen all the events fired in the form you can subscribe to this Subject :

```ts
formService.formEvents.subscribe((event: Event) => {
  console.log('Event fired:' + event.type);
  console.log('Event Target:' + event.target);
});
```

## See also

- [Form Stencils with Angular 2](stencils.md)
- [Form Extensibility and Customisation](extensibility.md).