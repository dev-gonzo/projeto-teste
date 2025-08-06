import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'formatMinutes',
    standalone: true
})

export class FormatMinutesPipe implements PipeTransform {
    transform(value: number): string {
        if(value == null) return '';

        const minutes = Math.floor(value / 60);
        const seconds = value % 60;

        const time = `${this.pad(minutes)}:${this.pad(seconds)}`;

        if(value >= 60){
            return `${time} minutos`;
        }
        else{
            return `${time} segundos`;
        }

    }

    private pad(value: number): string {
        return value < 10 ? '0' + value : value.toString();
    }
}