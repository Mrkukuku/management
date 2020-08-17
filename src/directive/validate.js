import moment from 'moment'
const timeFormat = function (value) {
    let reslut = ""
    if( value ){
        reslut = moment(value).format("YYYY-MM-DD HH:mm:ss")
    }
    return reslut
}

export {
    timeFormat
}