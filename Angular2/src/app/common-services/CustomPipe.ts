import {Pipe, PipeTransform} from "@angular/core";

@Pipe({ name: "customPipe" })
export class CustomPipe implements PipeTransform {

  public  transform(input: any, args: string[]): any {
        // transform input somehow
        return input;
    }
}
