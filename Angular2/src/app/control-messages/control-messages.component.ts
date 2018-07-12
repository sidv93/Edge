import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ValidationService } from "../common-services/validation.service";

@Component({
    selector: "control-messages",
    template: `<div *ngIf="errorMessage !== null">{{errorMessage}}</div>`,
})
export class ControlMessagesComponent implements OnInit {
    //   errorMessage: string;
    @Input() public control: FormControl;
    constructor() { }
    public ngOnInit() {
    }
    public get errorMessage() {
        for (let propertyName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
                return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
            }
        }

        return null;
    }
}
