import dateTimeFormat from 'date-and-time';

const DateTimeStringFormat = "YYYY-MM-DD HH:mm:ss";

function DateTimeNow(){
    return dateTimeFormat.format(
        new Date(), DateTimeStringFormat
    )
}

function ParseDateTime(datetime) {
    return dateTimeFormat.format(
        new Date(datetime * 1000), DateTimeStringFormat
    )
}

export { DateTimeNow, ParseDateTime };